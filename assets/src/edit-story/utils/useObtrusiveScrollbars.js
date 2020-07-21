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
 * External dependencies
 */
import { useEffect, useState } from 'react';
import { css } from 'styled-components';

const parentStyle = css`
  width: 30px;
  height: 30px;
  overscroll-behavior: contain;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: -ms-autohiding-scrollbar;
  scrollbar-width: thin;
`;

const childStyle = 'width:100%; height:40px;';

let result = null;

function browserHasObtrusiveScrollbars() {
  if (result !== null) {
    return result;
  }

  const parent = document.createElement('div');
  parent.style.cssText = parentStyle;

  const child = document.createElement('div');
  child.style.cssText = childStyle;

  parent.appendChild(child);
  document.body.appendChild(parent);

  // Measure the child element, if it is not 30px wide the scrollbars are obtrusive.
  const scrollbarWidth = 30 - child.clientWidth;
  document.body.removeChild(parent);

  result = Boolean(scrollbarWidth);
  return result;
}

/**
 * Custom hook to detect whether scrollbars are obtrusive or hidden until scrolled.
 *
 * @see https://www.filamentgroup.com/lab/scrollbars/
 *
 * @return {boolean} Whether scrollbars are obtrusive.
 */
function useObtrusiveScrollbars() {
  const [hasObtrusiveScrollbars, setHasObtrusiveScrollbars] = useState(false);
  useEffect(
    () => setHasObtrusiveScrollbars(browserHasObtrusiveScrollbars()),
    []
  );
  return hasObtrusiveScrollbars;
}

export default useObtrusiveScrollbars;
