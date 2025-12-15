using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MBDManager.Services; 
using MBDManager.Views;    
using System;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;

namespace MBDManager.ViewModels
{
    // 서버에서 보내주는 로그인 응답 데이터 형태
    public class LoginResponse
    {
        public bool success { get; set; }
        public string message { get; set; }
    }

    public partial class LoginViewModel : ObservableObject, IDisposable
    {
        private readonly SocketIOService _socketService;

        [ObservableProperty]
        [NotifyCanExecuteChangedFor(nameof(LoginCommand))]
        private string _username;

        [ObservableProperty]
        private string _errorMessage;

        public LoginViewModel()
        {
            // 1. Socket.IO 서비스 초기화 (Flask 기본 포트 5000)
            _socketService = new SocketIOService("http://127.0.0.1:5000");

            // 2. 서버 연결 이벤트 핸들링
            _socketService.OnConnected += () =>
            {
                // 연결 성공 시 UI 스레드에서 에러 메시지 초기화
                Application.Current.Dispatcher.Invoke(() => ErrorMessage = "");
            };

            _socketService.OnDisconnected += () =>
            {
                Application.Current.Dispatcher.Invoke(() => ErrorMessage = "서버 연결이 끊어졌습니다.");
            };

            // 3. 로그인 응답 리스너 등록
            _socketService.On<LoginResponse>("login_response", OnLoginResponse);

            // 4. 비동기 연결 시작
            _ = _socketService.ConnectAsync();
        }

        
        private void OnLoginResponse(LoginResponse response)
        {
           
            Application.Current.Dispatcher.Invoke(() =>
            {
                if (response.success)
                {
                    

                   
                    MainWindow mainWindow = new MainWindow();
                    mainWindow.Show();

                    
                    CloseWindow();
                }
                else
                {
                    
                    ErrorMessage = response.message;
                }
            });
        }

        [RelayCommand(CanExecute = nameof(CanLogin))]
        private async Task Login(PasswordBox passwordBox)
        {
            
            if (passwordBox == null || string.IsNullOrEmpty(passwordBox.Password))
            {
                ErrorMessage = "비밀번호를 입력해주세요.";
                return;
            }

            try
            {
                ErrorMessage = "로그인 시도 중...";

                var loginData = new
                {
                    Username = this.Username,
                    Password = passwordBox.Password
                };

                await _socketService.EmitAsync("login_request", loginData);
            }
            catch (Exception ex)
            {
                ErrorMessage = $"오류 발생: {ex.Message}";
            }
        }

        
        private bool CanLogin(PasswordBox passwordBox)
        {
            return !string.IsNullOrEmpty(Username);
        }

        
        [RelayCommand]
        private void Close()
        {
            Application.Current.Shutdown();
        }

       
        private void CloseWindow()
        {
            var window = Application.Current.Windows.OfType<LoginWindow>().FirstOrDefault(w => w.DataContext == this);
            window?.Close();
        }

        
        public void Dispose()
        {
            _socketService.Dispose();
        }
    }
}