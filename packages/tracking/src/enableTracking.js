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

const SCRIPT_IDENTIFIER = 'data-web-stories-tracking';

function loadScriptTag(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute(SCRIPT_IDENTIFIER, '');
    script.async = true;
    script.src = url;
    script.addEventListener('load', resolve);
    script.addEventListener('error', reject);
    document.head.appendChild(script);
  });
}

/**
 * Loads the Analytics tracking script.
 *
 * @param {boolean} [sendPageView=true] Whether to send a page view event or not upon loading.
 * @return {Promise<void>} Promise.
 */
async function loadTrackingScript(sendPageView = true) {
  if (document.querySelector(`script[${SCRIPT_IDENTIFIER}]`)) {
    return;
  }

  await loadScriptTag(
    `https://www.googletagmanager.com/gtag/js?id=${config.trackingId}&l=${DATA_LAYER}`
  );

  // This way we'll get "Editor" and "Dashboard" instead of "Edit Story ‹ Web Stories Dev — WordPress".
  const pageTitle = config.appName;

  // 'Plugin Activation' -> '/plugin-activation'
  // This way we get nicer looking paths like '/editor' instead of 'wp-admin/post-new.php?post_type=web-story'.
  const pagePath = '/' + config.appName.replace(/ /g, '-').toLowerCase();

  gtag('js', new Date());

  // Note: `set` commands need to be placed before `config` commands to ensure
  // those values are passed along with the initial config.

  // Universal Analytics custom dimensions.
  gtag('set', {
    custom_map: {
      dimension1: 'analytics',
      dimension2: 'adNetwork',
      dimension3: 'search_order',
      dimension4: 'search_orderby',
      dimension5: 'file_size',
      dimension6: 'file_type',
      dimension7: 'status',
      dimension8: 'siteLocale',
      dimension9: 'userLocale',
      dimension10: 'userRole',
      dimension11: 'enabledExperiments',
      dimension12: 'wpVersion',
      dimension13: 'phpVersion',
      dimension14: 'isMultisite',
      dimension15: 'name',
      dimension16: 'activePlugins',
    },
  });

  // Google Analytics 4 user properties.
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
    // Re-using user properties values for the custom dimensions.
    ...config.userProperties,
  });

  // Support GA4 in parallel.
  // At some point, only this will remain.
  gtag('config', config.trackingIdGA4, {
    app_name: config.appName,
    // This doesn't seem to be fully working for web properties.
    // See https://support.google.com/analytics/answer/9268042
    app_version: config.appVersion,
    send_page_view: sendPageView,
    // Setting the transport method to 'beacon' lets the hit be sent
    // using 'navigator.sendBeacon' in browsers that support it.
    transport_type: 'beacon',
    page_title: pageTitle,
    page_path: pagePath,
  });
}

async function enableTracking(sendPageView) {
  if (!config.trackingAllowed || config.trackingEnabled) {
    return;
  }

  await loadTrackingScript(sendPageView);
  config.trackingEnabled = true;
}

export default enableTracking;
