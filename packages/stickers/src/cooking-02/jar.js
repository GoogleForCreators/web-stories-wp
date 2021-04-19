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

function Jar({ style }) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 27 37"
      fill="none"
    >
      <path
        d="M3.42718 6.03597V6.03597C1.91768 6.97556 1 8.62769 1 10.4057V31C1 33.7614 3.23858 36 6 36H21C23.7614 36 26 33.7614 26 31V10.4057C26 8.62769 25.0823 6.97556 23.5728 6.03597V6.03597M3.42718 6.03597V2C3.42718 1.44772 3.8749 1 4.42718 1H22.5728C23.1251 1 23.5728 1.44772 23.5728 2V6.03597M3.42718 6.03597H23.5728"
        stroke="white"
        strokeWidth="2"
      />
      <rect x="7" y="13" width="13" height="14" fill="white" />
    </svg>
  );
}

Jar.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 27 / 37,
  svg: Jar,
};
