using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CommunityToolkit.Mvvm.Messaging;
using MBDManager.Messages;
using MBDManager.Models;
using MBDManager.Services;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.IO;
using System.Threading.Tasks;
using System.Windows;

namespace MBDManager.ViewModels
{
    public partial class HistoryViewModel : ObservableObject, IDisposable
    {
        private readonly SocketIOService _socketService;

        // --- 검색 조건 ---
        [ObservableProperty] private DateTime? _searchDate = DateTime.Now;
        [ObservableProperty] private string _searchQrCode;
        [ObservableProperty] private string _searchStatus = "전체";

        // --- 결과 리스트 ---
        [ObservableProperty]
        private ObservableCollection<InspectionRecord> _inspectionHistory = new();

        [ObservableProperty]
        private InspectionRecord _selectedHistoryItem;

        public HistoryViewModel()
        {
            _socketService = new SocketIOService("http://127.0.0.1:5000");
            _socketService.On<List<dynamic>>("search_history_response", OnSearchResponse);
            _ = _socketService.ConnectAsync();

            
            WeakReferenceMessenger.Default.Register<HistoryViewModel, NewInspectionMessage>(this, (recipient, message) =>
            {
                Application.Current.Dispatcher.Invoke(() =>
                {
                    recipient.InspectionHistory.Insert(0, message.Value);
                    recipient.SelectedHistoryItem = message.Value;
                });
            });
        }

        
        private void OnSearchResponse(List<dynamic> data)
        {
            Application.Current.Dispatcher.Invoke(() =>
            {
                InspectionHistory.Clear();
                foreach (var item in data)
                {
                   
                    string GetString(object obj, string propName)
                    {
                        try
                        {
                            if (obj is System.Text.Json.JsonElement element)
                            {
                                if (element.TryGetProperty(propName, out var prop)) return prop.ToString();
                            }
                            else
                            {
                                return ((dynamic)obj)[propName]?.ToString();
                            }
                        }
                        catch { }
                        return "-";
                    }

                    
                    string dbPath = GetString(item, "image_path");

                    
                    if (!string.IsNullOrEmpty(dbPath) && !Path.IsPathRooted(dbPath) && dbPath != "-")
                    {
                        string baseDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "InspectionData");
                        dbPath = Path.Combine(baseDir, dbPath);
                    }

                    InspectionHistory.Add(new InspectionRecord
                    {
                        Timestamp = GetString(item, "timestamp"),
                        QrCode = GetString(item, "qr_code"),
                        Result = GetString(item, "result"),
                        Zone = GetString(item, "zone"),
                        ImagePath = dbPath, // 가공된 경로 할당
                        Details = $"판독 결과: {GetString(item, "result")}"
                    });
                }
            });
        }

        [RelayCommand]
        private async Task Search()
        {
            var filter = new
            {
                date = SearchDate?.ToString("yyyy-MM-dd"),
                qr_code = SearchQrCode,
                status = SearchStatus
            };

            await _socketService.EmitAsync("search_history", filter);
        }

        public void Dispose()
        {
            _socketService.Dispose();
        }
    }
}