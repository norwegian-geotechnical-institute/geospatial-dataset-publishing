const appInsights = new Microsoft.ApplicationInsights.ApplicationInsights({
  config: {
    connectionString: window.APPLICATIONINSIGHTS_CONNECTION_STRING,
    enableAutoRouteTracking: true
  }
});
appInsights.loadAppInsights();
appInsights.trackPageView();

window.appInsights = appInsights;

// Example custom event
appInsights.trackEvent({
  name: "Tsunami Map",
  properties: userStats
});
