# Tracking

A library used to load Google Analytics and fire events. 

#### Useful functions. 


`trackEvent`

Send an Analytics tracking event.

See 
https://developers.google.com/analytics/devguides/collection/gtagjs/event
https://support.google.com/analytics/answer/1033068#Anatomy

`trackClick`

Send an Analytics tracking event for clicks.

See https://developers.google.com/analytics/devguides/collection/gtagjs/events

`trackError`

Send an Analytics tracking event for exceptions.

See https://developers.google.com/analytics/devguides/collection/ga4/exceptions

`getTimeTracker`

Starts a timer and returns a callback to stop it and send an Analytics timing_complete event.

See https://developers.google.com/analytics/devguides/collection/gtagjs/user-timings
