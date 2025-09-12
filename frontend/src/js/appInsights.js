(function() {
    const connectionString = window.APPLICATIONINSIGHTS_CONNECTION_STRING;

    if (!connectionString) {
        return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.monitor.azure.com/scripts/b/ai.2.min.js';
    script.async = true;

    script.onload = function() {
        const appInsights = new Microsoft.ApplicationInsights.ApplicationInsights({
            config: {
                connectionString: connectionString,
                enableAutoRouteTracking: false,
                disableExceptionTracking: true,
                disableTelemetry: false,
                samplingPercentage: 100
            }
        });

        appInsights.loadAppInsights();

        // Generate anonymous user ID for session tracking
        const userId = sessionStorage.getItem('ai_user') ||
            (function() {
                // Prefer cryptographically secure random values
                let randStr = '';
                if (window.crypto && window.crypto.getRandomValues) {
                    // Generate 16 random bytes, then encode as hex
                    const buf = new Uint8Array(16);
                    window.crypto.getRandomValues(buf);
                    randStr = Array.from(buf, b => b.toString(16).padStart(2, '0')).join('');
                } else {
                    // Fallback if crypto not supported (rare): use Math.random, but warn
                    randStr = Math.random().toString(36).substring(2, 15);
                }
                return 'user_' + randStr;
            })();
        sessionStorage.setItem('ai_user', userId);
        appInsights.setAuthenticatedUserContext(userId);

        // Collect comprehensive user statistics
        const userStats = {
            referrer: document.referrer || 'direct',
            userAgent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages ? navigator.languages.join(',') : '',
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            deviceMemory: navigator.deviceMemory || 'unknown',
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : 'unknown'
        };

        // Track page view with enhanced user statistics
        appInsights.trackPageView({
            name: 'Tsunami Map',
            properties: userStats
        });

        // Track user location (with permission)
        if (navigator.geolocation && 'geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // Track approximate location (country/region level for privacy)
                    appInsights.trackEvent('UserLocation', {
                        latitude: Math.round(position.coords.latitude * 10) / 10, // Rounded for privacy
                        longitude: Math.round(position.coords.longitude * 10) / 10, // Rounded for privacy
                        accuracy: position.coords.accuracy > 1000 ? 'low' : 'high'
                    });
                },
                function(error) {
                    // Track location access denied/failed
                    appInsights.trackEvent('LocationAccessDenied', {
                        error: error.message || 'unknown'
                    });
                },
                { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 }
            );
        }

        // Track map interactions
        window.trackMapInteraction = function(action, properties) {
            appInsights.trackEvent('MapInteraction', {
                action: action,
                ...properties,
                timestamp: new Date().toISOString()
            });
        };

        // Track session duration
        let sessionStart = Date.now();
        window.addEventListener('beforeunload', function() {
            const sessionDuration = Math.round((Date.now() - sessionStart) / 1000);
            appInsights.trackEvent('SessionEnd', {
                durationSeconds: sessionDuration,
                userId: userId
            });
        });
    };

    document.head.appendChild(script);
})();