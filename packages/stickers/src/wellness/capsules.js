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

function Capsules({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 64 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.5017 32.3725L31.9562 41.8725M56.662 43.866L45.3998 50.3682M42.2042 18.2168L52.2042 12.5532M14.7919 7.32742L21.8464 18.2523M22.7517 19.8152C25.375 15.2714 31.1851 13.7146 35.7289 16.3379C40.2727 18.9613 41.8295 24.7714 39.2062 29.3152L23.2062 57.028C20.5828 61.5717 14.7727 63.1286 10.2289 60.5052C5.68513 57.8819 4.12832 52.0717 6.75167 47.528L22.7517 19.8152ZM61.4664 52.1872C63.2619 55.2972 62.1963 59.274 59.0864 61.0695C55.9764 62.8651 51.9996 61.7995 50.2041 58.6895L39.2529 39.7215C37.4573 36.6115 38.5229 32.6348 41.6329 30.8392C44.7429 29.0437 48.7196 30.1092 50.5152 33.2192L61.4664 52.1872ZM37.3333 10.8349C35.4933 7.75099 36.5017 3.75938 39.5856 1.91938C42.6695 0.0793744 46.6611 1.08775 48.5011 4.17165L57.3348 18.9772C59.1748 22.0611 58.1664 26.0527 55.0825 27.8927C51.9986 29.7327 48.007 28.7243 46.167 25.6404L37.3333 10.8349ZM22.8639 2.11513C25.8808 0.167098 29.9056 1.03353 31.8536 4.05035C33.8016 7.06718 32.9352 11.092 29.9184 13.04L11.5186 24.9212C8.50173 26.8692 4.47692 26.0028 2.52889 22.9859C0.580862 19.9691 1.44729 15.9443 4.46412 13.9963L22.8639 2.11513Z"
        stroke="#E53616"
        strokeWidth="2"
      />
    </svg>
  );
}

Capsules.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 64 / 63,
  svg: Capsules,
};
