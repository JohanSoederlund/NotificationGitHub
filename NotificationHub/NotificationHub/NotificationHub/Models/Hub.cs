using System;

namespace NotificationHub.Models
{
    public class Hub
    {
        public int ID { get; set; }
        public string Organization { get; set; }
        public string Release { get; set; }
        public string Commit { get; set; }
    }
}

