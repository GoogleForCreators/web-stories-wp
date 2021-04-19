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
import PropTypes from 'prop-types';

function YeastPackage({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 34 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.59889 5L8.99889 2C13.9978 5 24.5 8.5 32 9.5C31.6024 10.4278 31.2486 11.3491 30.9349 12.2613M7.59889 5C10.8559 7.17421 20.0828 11.6704 30.9349 12.2613M7.59889 5C5.2445 10.0451 2.30835 16.9736 1.16508 32.5M30.9349 12.2613C26.5148 25.113 30.0331 36.1657 30.5 38.5C11.5 43.5 2.5 38.5 1 36.5C1 35.2902 1.05971 33.9311 1.16508 32.5M1.16508 32.5C4.61005 34.6667 15.1 38.1 29.5 34.5M15.5 22C13 20 8.5 20.9 10.5 24.5C10.5 27.7 10.5 29.8333 10.5 30.5L20.5 31.5L21 26.5C22.3333 24.6667 22 20 15.5 22Z"
        stroke="white"
        strokeWidth="2"
      />
    </svg>
  );
}

YeastPackage.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 34 / 42,
  svg: YeastPackage,
};
