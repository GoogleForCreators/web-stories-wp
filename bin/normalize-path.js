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
const resize = (x, y, path) => {
  const coords = path
    .replace(/\s*(-)/g, ' $1')
    .replace(/\s*([A-Za-z,])\s*/g, ' $1 ')
    .split(' ');
  let coordIndex = 0;
  return coords.reduce((acc, value) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      const scaled = coordIndex % 2 === 0 ? parsed / x : parsed / y;
      return `${acc} ${scaled.toFixed(6)}`;
    }
    coordIndex = 0;
    return `${acc} ${value}`;
  }, '');
};

// eslint-disable-next-line no-console
console.log(
  resize(
    // viewbox width
    392,
    // viewbox height
    392,
    // path to normalize
    `M392,196c0,108.25-87.75,196-196,196S0,304.25,0,196S87.75,0,196,0S392,87.75,392,196z M196,30
	c-44.34,0-86.03,17.27-117.38,48.62C47.27,109.97,30,151.66,30,196s17.27,86.03,48.62,117.38C109.97,344.73,151.66,362,196,362
	s86.03-17.27,117.38-48.62C344.73,282.03,362,240.34,362,196s-17.27-86.03-48.62-117.38C282.03,47.27,240.34,30,196,30 M196,0
	c108.25,0,196,87.75,196,196s-87.75,196-196,196S0,304.25,0,196S87.75,0,196,0L196,0z`
  )
);
