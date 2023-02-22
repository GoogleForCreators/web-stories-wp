# Tracking

Helper library for interacting with Google Events to track page/screen views and events.

Supports only Google Analytics 4

## Usage

### Initialize Tracking

Initialize tracking in the module's entry point.

If the user has opted in to telemetry, this will enable tracking by loading the Google Analytics `gtag.js` script.

By default this will result in a page view being tracked, unless turned off using the second boolean argument.

```js
initializeTracking('Awesome App', false);
```

### Enable/Disable Tracking

Use the `disableTracking` and `enableTracking` functions to initialize tracking after the initial page view.

Useful when the user changes his telemetry preferences at a later point.

The `isTrackingEnabled()` function provides the current opt-in/out status.

### Tracking Screen Views

[Screen views](https://developers.google.com/analytics/devguides/collection/ga4/screen-view) are like page views, but for web apps. To send `screen_view` events when users navigate to different screens within an app,
use the `trackScreenView()` function.

```js
trackScreenView('Settings');
```

### Tracking Clicks

Use the `trackClick` function in your `onClick` handler.

If links are to open in the same tab, they will only do so after the tracking event has already been sent.
This ensures no tracking calls are missed.

```js
trackClick(event, 'contact_support');
```

### Tracking Errors (Exceptions)

You can use `trackError` to send [exception events](https://developers.google.com/analytics/devguides/collection/ga4/exceptions) to measure the number and type of crashes or errors that occur on a web page.

The first parameter is the prefix, the second one the error description, and the third one indicates whether the error was fatal or not.

```js
trackError('demo', 'Division by zero', false);
```

### Tracking Events

At the core of this package is the `trackEvent` function.

All you need to provide is the event name and as many optional event parameters as you want:

```js
trackEvent('insert_template', {
template_name: 'Awesome Template',
});
```

### User Timings

Use the following helper function to start a timer and return a callback to stop it:

```js
const trackTiming = getTimeTracker('video_transcoding'); // Start timer.
// Perform some long task...
trackTiming(); // Stop timer and send event.
```
