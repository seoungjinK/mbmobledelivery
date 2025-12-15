using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace MBDManager.Services
{
    public class AgvService
    {
        private readonly HttpClient _client;

       
        public string AgvIpAddress => SettingsService.Instance.Settings.AgvIpAddress;

        public AgvService()
        {
            _client = new HttpClient();
            _client.Timeout = TimeSpan.FromSeconds(1.5); 
        }

       
        public async Task<bool> SendCommandAsync(string command)
        {
            if (string.IsNullOrEmpty(AgvIpAddress)) return false;

            try
            {
                string url = $"http://{AgvIpAddress}/{command}";
                var response = await _client.GetAsync(url);
                return response.IsSuccessStatusCode;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"AGV 명령 오류: {ex.Message}");
                return false;
            }
        }

        
        public async Task<bool> CheckConnectionAsync()
        {
            if (string.IsNullOrEmpty(AgvIpAddress)) return false;

            try
            {
                string url = $"http://{AgvIpAddress}/";
                var response = await _client.GetAsync(url);
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }
    }
}