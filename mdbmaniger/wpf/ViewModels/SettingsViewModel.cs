using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MBDManager.Services;
using System.Windows;

namespace MBDManager.ViewModels
{
    public partial class SettingsViewModel : ObservableObject
    {
        
        [ObservableProperty]
        private AppSettings _currentSettings;

        public SettingsViewModel()
        {
            
            CurrentSettings = SettingsService.Instance.Settings;
        }

        [RelayCommand]
        private void SaveSettings()
        {
           
            SettingsService.Instance.Save();

            
            MessageBox.Show("설정이 저장되었습니다.\n변경 사항을 적용하려면 프로그램을 재시작해주세요.",
                            "설정 저장 완료", MessageBoxButton.OK, MessageBoxImage.Information);
        }
    }
}