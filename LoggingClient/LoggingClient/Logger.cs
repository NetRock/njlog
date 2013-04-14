using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace LoggingClient
{
    public static class Logger
    {
        private const int CheckingPeriod = 10000;

        private static Dictionary<int, List<LogItem>> logDict = new Dictionary<int, List<LogItem>>();

        private static List<LogItem> totalList = new List<LogItem>();

        private static string loggingServiceAddress { get; set; }

        private static string domain;

        private static string appName;

        private static string version;

        private static string appId;

        private static Timer checkTimer;


        public static async Task Setup(string serviceAddress, string domain, string appName, string version)
        {
            loggingServiceAddress = serviceAddress;
            Logger.domain = domain;
            Logger.appName = appName;
            Logger.version = version;

            appId = await GetApplicationId();

            checkTimer = new Timer(s => SendIfAny(), null, CheckingPeriod, CheckingPeriod);

            AppDomain.CurrentDomain.ProcessExit += (sender, args) =>
                {
                    SendIfAny();
                    checkTimer.Dispose();
                };
        }

        public static void Log(string title, LogCategory category, string message)
        {
            List<LogItem> logList;

            if (!logDict.TryGetValue(Thread.CurrentThread.ManagedThreadId, out logList))
            {
                logList = new List<LogItem>();
                logDict.Add(Thread.CurrentThread.ManagedThreadId, logList);
            }

            logList.Add(new LogItem
                        {
                            title = title,
                            category = category.ToString(),
                            message = message,
                            appId = appId,
                            loggedDate = DateTime.UtcNow
                        });
        }

        private static async void SendIfAny()
        {
            var keys = logDict.Keys.ToArray();

            foreach (var key in keys)
            {
                var logList = logDict[key];
                if (logList.Count > 0)
                {
                    logDict[key] = new List<LogItem>();
                    totalList.AddRange(logList);
                }
            }

            if (totalList.Count > 0)
            {
                SendLogs();
            }
        }

        private static async void SendLogs()
        {
            using (var client = GetWebApiClient())
            {
                await client.PostAsJsonAsync("log", totalList);
                totalList.Clear();
            }
        }

        private static async Task<string> GetApplicationId()
        {
            if (domain == null || appName == null || version == null)
            {
                throw new ArgumentNullException("Need to set domain, appname, version first.");
            }

            using (var client = GetWebApiClient())
            {
                var id = await client.GetStringAsync(string.Format("application/{0}/{1}/{2}", domain, appName, version));
                return id.Replace("\"", string.Empty);
            }
        }

        private static HttpClient GetWebApiClient()
        {
            if (string.IsNullOrEmpty(loggingServiceAddress))
            {
                throw new ArgumentException("Empty LoggingService Address");
            }

            var client = new HttpClient { BaseAddress = new Uri(loggingServiceAddress) };

            return client;
        }
    }
}
