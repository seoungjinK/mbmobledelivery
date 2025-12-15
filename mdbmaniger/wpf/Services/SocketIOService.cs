using SocketIOClient; 
using System;
using System.Threading.Tasks;

namespace MBDManager.Services
{
    public class SocketIOService : IDisposable
    {
       
        private readonly SocketIOClient.SocketIO _client;

        public event Action OnConnected;
        public event Action OnDisconnected;

        public SocketIOService(string url)
        {
            
            var options = new SocketIOClient.SocketIOOptions
            {
                Transport = SocketIOClient.Transport.TransportProtocol.WebSocket // WebSocket 강제 사용
            };

            _client = new SocketIOClient.SocketIO(url, options);

            
            _client.OnConnected += async (sender, e) =>
            {
                OnConnected?.Invoke();
                await Task.CompletedTask;
            };

            _client.OnDisconnected += (sender, e) =>
            {
                OnDisconnected?.Invoke();
            };
        }

        public async Task ConnectAsync()
        {
            try
            {
                await _client.ConnectAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"연결 실패: {ex.Message}");
            }
        }

        public async Task DisconnectAsync()
        {
            if (_client.Connected)
            {
                await _client.DisconnectAsync();
            }
        }

        // 데이터 전송 (Emit)
        public async Task EmitAsync(string eventName, object data)
        {
            if (_client.Connected)
            {
                await _client.EmitAsync(eventName, data);
            }
        }

        // 데이터 수신 (On)
        public void On<T>(string eventName, Action<T> callback)
        {
            _client.On(eventName, response =>
            {
              
                try
                {
                    var data = response.GetValue<T>();
                    callback(data);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"데이터 파싱 오류 ({eventName}): {ex.Message}");
                }
            });
        }

        public void Dispose()
        {
            _client?.Dispose();
        }
    }
}