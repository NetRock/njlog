using System;

namespace LoggingClient
{
    internal class LogItem
    {
        public string title { get; set; }

        public string category { get; set; }

        public string message { get; set; }

        public string appId { get; set; }

        public DateTime loggedDate { get; set; }
    }
}
