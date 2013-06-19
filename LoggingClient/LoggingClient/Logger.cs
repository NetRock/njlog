using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
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

        public static void LogError(string title, string message)
        {
            Logger.Log(title, LogCategory.Error, message);
        }

        public static void LogWarning(string title, string message)
        {
            Logger.Log(title, LogCategory.Warning, message);
        }

        public static void LogInfo(string title, string message)
        {
            Logger.Log(title, LogCategory.Information, message);
        }

        private static void Log(string title, string category, string message)
        {
            List<LogItem> logList;

            if (!logDict.TryGetValue(Thread.CurrentThread.ManagedThreadId, out logList))
            {
                lock (logDict)
                {
                    if (!logDict.TryGetValue(Thread.CurrentThread.ManagedThreadId, out logList))
                    {
                        logList = new List<LogItem>();
                        logDict.Add(Thread.CurrentThread.ManagedThreadId, logList);
                    }
                }
            }

            logList.Add(new LogItem
                        {
                            title = title,
                            category = category,
                            message = message,
                            appId = appId,
                            loggedDate = DateTime.UtcNow
                        });
        }

        private static void SendIfAny()
        {
            var keys = logDict.Keys.ToArray();

            foreach (var key in keys)
            {
                var logList = logDict[key];
                logList.RemoveAll(l => l.category == LogCategory.Done);
                if (logList.Count > 0)
                {
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
            }

            foreach (var item in totalList)
            {
                item.category = LogCategory.Done;
            }
            totalList.Clear();
        }

        private class LogApp
        {
            public string appId { get; set; }
        }

        private static async Task<string> GetApplicationId()
        {
            if (domain == null || appName == null || version == null)
            {
                throw new ArgumentNullException("Need to set domain, appname, version first.");
            }

            using (var client = GetWebApiClient())
            {
                var response = await client.GetAsync(string.Format("application/{0}/{1}/{2}", domain, appName, version));
                var app = await response.Content.ReadAsAsync<LogApp>();
                return app.appId;
            }
        }

        private static HttpClient GetWebApiClient()
        {
            if (string.IsNullOrEmpty(loggingServiceAddress))
            {
                throw new ArgumentException("Empty LoggingService Address");
            }

            var handler = new HttpClientHandler
            {
                UseDefaultCredentials = true,
                PreAuthenticate = true,
                ClientCertificateOptions = ClientCertificateOption.Automatic
            };

            var client = new HttpClient(handler) { BaseAddress = new Uri(loggingServiceAddress) };
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return client;
        }
    }
}
