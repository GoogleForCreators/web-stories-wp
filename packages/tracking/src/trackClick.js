/*
 * Copyright 2021 Google LLC
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
import isTrackingEnabled from './isTrackingEnabled';
import track from './track';

/**
 * Send an Analytics tracking event for clicks.
 *
 * Works for both Universal Analytics and Google Analytics 4.
 *
 * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events
 * @param {MouseEvent|null} event The actual click event.
 * @param {string} eventName The event name (e.g. 'search').
 * @return {Promise<void>} Promise that always resolves.
 */
async function trackClick(event, eventName) {
  // currentTarget becomes null after event bubbles up, so we
  // grab it for reference before any async operations occur.
  // https://github.com/facebook/react/issues/2857#issuecomment-70006324
  const { currentTarget } = event || {};

  // Handle cases where trackClick is used in places where the event is not passed and thus undefined.
  if (!currentTarget) {
    return Promise.resolve();
  }

  if (!(await isTrackingEnabled())) {
    return Promise.resolve();
  }

  const openLinkInNewTab =
    currentTarget?.target === '_blank' ||
    event.ctrlKey ||
    event.shiftKey ||
    event.metaKey ||
    event.which === 2;

  if (openLinkInNewTab) {
    return track(eventName);
  }

  event.preventDefault();

  return track(eventName).finally(() => {
    document.location = currentTarget.href;
  });
}

export default trackClick;
