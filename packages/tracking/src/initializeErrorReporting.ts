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
import trackError from './trackError';

const IGNORED_ERROR_MESSAGES = ['ResizeObserver loop limit exceeded'];

/**
 *
 * @param event Error event.
 */
function handleErrors(event: ErrorEvent): void {
  if (event.filename && !event.filename.includes('web-stories')) {
    return;
  }

  if (IGNORED_ERROR_MESSAGES.includes(event.message)) {
    return;
  }

  const errorMessage = `${event.message} (${event.lineno}:${event.colno})`;
  void trackError('uncaught_error', errorMessage, true);
}

/**
 *
 * @param event Promise rejection event.
 */
function handleUncaughtPromises(event: PromiseRejectionEvent): void {
  const errorMessage = (event.reason as string) || 'Promise rejection';
  void trackError('uncaught_promise', errorMessage);
}

function initializeErrorReporting(): void {
  window.addEventListener('error', handleErrors);
  window.addEventListener('unhandledrejection', handleUncaughtPromises);
}

export default initializeErrorReporting;
