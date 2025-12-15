using OpenCvSharp;
using OpenCvSharp.WpfExtensions;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Media.Imaging;
using System.Windows.Threading;

namespace MBDManager.Services
{
    public static class CameraService
    {
        
        public static async Task<bool> StartCapture(int cameraIndex, Dispatcher dispatcher, Action<BitmapSource> onFrame, CancellationToken token)
        {
            
            VideoCapture capture = await Task.Run(() =>
            {
                var cap = new VideoCapture(cameraIndex, VideoCaptureAPIs.DSHOW);

                
                cap.Set(VideoCaptureProperties.FourCC, FourCC.MJPG);
                cap.Set(VideoCaptureProperties.FrameWidth, 640);
                cap.Set(VideoCaptureProperties.FrameHeight, 640);
                cap.Set(VideoCaptureProperties.Fps, 15);
                cap.Set(VideoCaptureProperties.Brightness, 100);
                cap.Set(VideoCaptureProperties.Exposure, -5);

                return cap;
            });

            
            if (!capture.IsOpened())
            {
                System.Diagnostics.Debug.WriteLine($"❌ 카메라 {cameraIndex}번 열기 실패");
                capture.Dispose();
                return false; 
            }

            _ = Task.Run(() =>
            {
                using (capture) 
                using (var mat = new Mat())
                {
                    System.Diagnostics.Debug.WriteLine($"✅ 카메라 {cameraIndex}번 루프 시작");

                    while (!token.IsCancellationRequested)
                    {
                        if (!capture.Read(mat) || mat.Empty())
                        {
                            Thread.Sleep(10);
                            continue;
                        }

                        dispatcher.Invoke(() =>
                        {
                            try
                            {
                                var frame = mat.ToBitmapSource();
                                frame.Freeze();
                                onFrame(frame);
                            }
                            catch { }
                        });

                        Thread.Sleep(33);
                    }
                }
                System.Diagnostics.Debug.WriteLine($"카메라 {cameraIndex} 종료됨");
            }, token);

            return true; 
        }
    }
}