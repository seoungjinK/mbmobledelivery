using System;

namespace MBDManager.Models
{
    public class InspectionRecord
    {
        public long Id { get; set; }
        public string Timestamp { get; set; }
        public string QrCode { get; set; }
        public string Result { get; set; }
        public string Zone { get; set; }

        
        public string ImagePath { get; set; }

        public string Details { get; set; }

        public string DisplayResult => Result == "Normal" ? "정상" : "불량";

        public string ImagePath1 => ImagePath?.Replace("_cam0", "_cam1");
        public string ImagePath2 => ImagePath?.Replace("_cam0", "_cam2");
    }
}