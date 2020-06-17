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
 * Add a request handler for intercepting requests.
 *
 * Used intercept HTTP requests during tests with a custom handler function.
 * Returns a function that, when called, stops further request
 * handling/interception.
 *
 * @param  {Function} callback Function to handle requests.
 * @return {Function} Function that can be called to remove the added handler function from the page.
 */
function addRequestInterception(callback) {
  const requestHandler = (request) => {
    // Prevent errors for requests that happen after interception is disabled.
    if (!request._allowInterception) {
      return;
    }

    callback(request);
  };

  page.on('request', requestHandler);

  return () => {
    page.off('request', requestHandler);
  };
}

export default addRequestInterception;
