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
import { _x } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

const title = _x('Pie Chart', 'sticker name', 'web-stories');

function PieChart({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M27.6146 0V22.3854H50C49.7258 19.4477 48.962 16.6863 47.7086 14.1011C46.416 11.4767 44.7807 9.17549 42.8026 7.19742C40.8245 5.21934 38.5233 3.58403 35.8989 2.29142C33.3137 1.03799 30.5523 0.274188 27.6146 0ZM40.0705 45.0059C41.4414 43.9483 42.6949 42.7928 43.8308 41.5394C44.9667 40.2468 45.9655 38.8563 46.8273 37.3678C47.689 35.8793 48.394 34.293 48.9424 32.6087C49.4908 30.9244 49.8433 29.2009 50 27.4383H29.4947L40.0705 45.0059ZM22.5617 24.9119V0C19.4281 0.313358 16.4904 1.17508 13.7485 2.5852C10.9675 3.99531 8.56836 5.81668 6.55112 8.04936C4.53387 10.282 2.93773 12.8476 1.76263 15.7462C0.587539 18.6056 0 21.6608 0 24.9119C0 28.3588 0.665878 31.6099 1.99765 34.6651C3.29025 37.7203 5.07245 40.3839 7.3443 42.6557C9.61615 44.9275 12.2797 46.7097 15.3349 48.0024C18.3901 49.3341 21.6412 50 25.0881 50C27.0075 50 28.8582 49.7846 30.6404 49.3537C32.4226 48.9228 34.1363 48.3353 35.7814 47.5911C35.7814 47.5911 35.096 46.416 33.725 44.0658C32.3541 41.7548 30.8363 39.1892 29.1716 36.369C27.5068 33.5488 25.989 30.9636 24.6181 28.6134C23.2472 26.224 22.5617 24.9902 22.5617 24.9119Z"
        fill="white"
      />
    </svg>
  );
}

PieChart.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 50,
  svg: PieChart,
  title,
};
