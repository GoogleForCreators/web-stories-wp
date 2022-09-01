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
 * External dependencies
 */
import { renderToStaticMarkup as _renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';

/* eslint-disable no-console -- Deliberately overriding console.error  */

/**
 * Render a React element to static markup.
 *
 * Silences any `useLayoutEffect` warnings.
 *
 * Similar to `renderToString`, except this doesn't create extra DOM attributes
 * such as `data-reactid`, that React uses internally. This is useful if you want
 * to use React as a simple static page generator, as stripping away the extra
 * attributes can save lots of bytes.
 *
 * @param element React element.
 * @return Markup.
 */
function renderToStaticMarkup(element: ReactElement) {
  const originalConsoleError = console.error;
  console.error = function (error, ...args) {
    if (
      typeof error === 'string' &&
      !error.startsWith('Warning: useLayoutEffect does nothing on the server')
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- OK to pass through here.
      originalConsoleError(error, ...args);
    }
  };

  const markup = _renderToStaticMarkup(element);

  console.error = originalConsoleError;

  return markup;
}

/* eslint-enable no-console -- Deliberately overriding console.error */

export default renderToStaticMarkup;
