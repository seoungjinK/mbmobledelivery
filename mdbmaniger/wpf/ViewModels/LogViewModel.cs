using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Windows;
using System.Windows.Threading;

namespace MBDManager.ViewModels
{
    public partial class LogViewModel : ObservableObject
    {
        
        private readonly List<LogEntryModel> _allLogs = new();

       
        [ObservableProperty]
        private ObservableCollection<LogEntryModel> _logEntries = new();

        
        [ObservableProperty] private DateTime? _searchDate = DateTime.Now;
        [ObservableProperty] private string _selectedLevel = "전체";  /
        [ObservableProperty] private string _selectedDevice = "전체"; 

        public LogViewModel()
        {
           
            AddLog("System", "Info", "로그 시스템 초기화 완료");
        }

        public void AddLog(string device, string level, string message)
        {
            try
            {
                var newLog = new LogEntryModel
                {
                    Timestamp = DateTime.Now,
                    Device = device,
                    Level = level,
                    Message = message
                };

                
                Application.Current.Dispatcher.Invoke(() =>
                {
                   
                    _allLogs.Insert(0, newLog);

                    
                    if (_allLogs.Count > 1000) _allLogs.RemoveAt(_allLogs.Count - 1);

                   
                    if (IsMatchFilter(newLog))
                    {
                        LogEntries.Insert(0, newLog);
                        if (LogEntries.Count > 500) LogEntries.RemoveAt(LogEntries.Count - 1);
                    }
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Log Error: {ex.Message}");
            }
        }

        
        [RelayCommand]
        private void Search()
        {
            
            var filtered = _allLogs.Where(log => IsMatchFilter(log)).ToList();

            LogEntries.Clear();
            foreach (var item in filtered)
            {
                LogEntries.Add(item);
            }
        }

       
        private bool IsMatchFilter(LogEntryModel log)
        {
            
            if (SearchDate.HasValue && log.Timestamp.Date != SearchDate.Value.Date) return false;

            // 2. 레벨 확인
            if (SelectedLevel != "전체" && log.Level != SelectedLevel) return false;

            // 3. 장치 확인
            if (SelectedDevice != "전체" && log.Device != SelectedDevice) return false;

            return true;
        }
    }

   
    public class LogEntryModel
    {
        public DateTime Timestamp { get; set; }
        public string Level { get; set; }   // Info, Warning, Error
        public string Device { get; set; }  // Camera, AGV, Server, System
        public string Message { get; set; }
    }
}