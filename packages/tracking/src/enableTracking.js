/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Internal dependencies
 */
import { DATA_LAYER } from './constants';
import { config, gtag } from './shared';

/**
 * Loads the Analytics tracking script.
 *
 * @param {boolean} [sendPageView=true] Whether to send a page view event or not upon loading.
 * @return {Promise<void>} Promise.
 */
function loadTrackingScript(sendPageView = true) {
  const SCRIPT_IDENTIFIER = 'data-web-stories-tracking';

  if (document.querySelector(`script[${SCRIPT_IDENTIFIER}]`)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute(SCRIPT_IDENTIFIER, '');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.trackingId}&l=${DATA_LAYER}`;
    script.addEventListener('load', resolve);
    script.addEventListener('error', reject);
    document.head.appendChild(script);

    // This way we'll get "Editor" and "Dashboard" instead of "Edit Story ‹ Web Stories Dev — WordPress".
    const pageTitle = config.appName;

    // 'Plugin Activation' -> '/plugin-activation'
    // This way we get nicer looking paths like '/editor' instead of 'wp-admin/post-new.php?post_type=web-story'.
    const pagePath = '/' + config.appName.replace(/ /g, '-').toLowerCase();

    gtag('js', new Date());

    // Note: `set` commands need to be placed before `config` commands to ensure those values are passed along with page views.
    // See https://developers.google.com/analytics/devguides/collection/ga4/persistent-values
    // See https://developers.google.com/analytics/devguides/collection/ga4/user-properties
    gtag('set', 'user_properties', config.userProperties);

    gtag('config', config.trackingId, {
      anonymize_ip: true,
      app_name: config.appName,
      app_version: config.appVersion,
      send_page_view: sendPageView,
      // Setting the transport method to 'beacon' lets the hit be sent
      // using 'navigator.sendBeacon' in browsers that support it.
      transport_type: 'beacon',
      page_title: pageTitle,
      page_path: pagePath,
      // Only needed for universal analytics.
      custom_map: {
        dimension3: 'order',
        dimension4: 'orderby',
        dimension5: 'file_size',
        dimension6: 'file_type',
        dimension7: 'status',
      },
    });

    // Support GA4 in parallel.
    // At some point, only this will remain.
    gtag('config', config.trackingIdGA4, {
      app_name: config.appName,
      // This doesn't seem to be fully working for web properties.
      // So we send it as both app_version and a user property.
      // See https://support.google.com/analytics/answer/9268042
      app_version: config.appVersion,
      send_page_view: sendPageView,
      // Setting the transport method to 'beacon' lets the hit be sent
      // using 'navigator.sendBeacon' in browsers that support it.
      transport_type: 'beacon',
      page_title: pageTitle,
      page_path: pagePath,
    });
  });
}

async function enableTracking(sendPageView) {
  if (!config.trackingAllowed) {
    return Promise.resolve();
  }

  config.trackingEnabled = true;

  //eslint-disable-next-line no-return-await
  return await loadTrackingScript(sendPageView);
}

export default enableTracking;
