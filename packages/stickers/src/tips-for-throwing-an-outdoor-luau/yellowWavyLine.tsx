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

const title = _x('Yellow Wavy Line', 'sticker name', 'web-stories');

const YellowWavyLine = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 50 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.955261 1.06791C0.955261 0.478118 1.43338 0 2.02317 0C4.52148 0 5.81898 0.52048 7.02672 1.01042L7.04781 1.01898C8.1308 1.45834 9.13116 1.86419 11.2139 1.86419C13.3101 1.86419 14.3152 1.45643 15.3992 1.01665L15.4146 1.01042C16.6211 0.520964 17.9145 0 20.4046 0C22.903 0 24.2005 0.52048 25.4082 1.01042L25.4293 1.01898C26.5123 1.45834 27.5126 1.86419 29.5954 1.86419C31.6916 1.86419 32.6967 1.45643 33.7807 1.01665L33.7961 1.01042C35.0026 0.520964 36.296 0 38.7861 0C41.2759 0 42.5735 0.520752 43.7823 1.01015L43.8 1.01732C44.8866 1.45728 45.8915 1.86419 47.9769 1.86419C48.5667 1.86419 49.0448 2.34231 49.0448 2.93209C49.0448 3.52188 48.5667 4 47.9769 4C45.4871 4 44.1895 3.47925 42.9807 2.98985L42.963 2.98268C41.8764 2.54272 40.8714 2.13581 38.7861 2.13581C36.7034 2.13581 35.703 2.54166 34.62 2.98103L34.5989 2.98958C33.3912 3.47952 32.0937 4 29.5954 4C27.1053 4 25.8119 3.47904 24.6053 2.98958L24.59 2.98335C23.5059 2.54357 22.5008 2.13581 20.4046 2.13581C18.3219 2.13581 17.3215 2.54166 16.2386 2.98102L16.2175 2.98958C15.0097 3.47952 13.7122 4 11.2139 4C8.72379 4 7.43039 3.47904 6.22384 2.98958L6.20849 2.98335C5.12443 2.54357 4.11933 2.13581 2.02317 2.13581C1.43338 2.13581 0.955261 1.65769 0.955261 1.06791Z"
      fill="#ECE7BD"
    />
  </svg>
);

YellowWavyLine.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 4,
  svg: YellowWavyLine,
  title,
};
