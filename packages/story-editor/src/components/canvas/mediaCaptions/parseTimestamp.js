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
 * Parses a WebVTT timestamp and returns the time in seconds from video start.
 *
 * As implemented in <amp-story-captions>.
 *
 * @see https://www.w3.org/TR/webvtt1/#webvtt-timestamp
 * @see https://github.com/ampproject/amphtml/blob/78fed1a5551cae5486717acbd45878a1e36343a0/extensions/amp-story-captions/0.1/track-renderer.js#L10-L26
 * @param {string} timestamp Timestamp string.
 * @return {?number} Time in seconds.
 */
function parseTimestamp(timestamp) {
  const match = /^(?:(\d{2,}):)?(\d{2}):(\d{2})\.(\d{3})$/.exec(timestamp);
  if (!match) {
    return null;
  }
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = parseInt(match[2]);
  const seconds = parseInt(match[3]);
  const milliseconds = parseInt(match[4]);
  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

export default parseTimestamp;
