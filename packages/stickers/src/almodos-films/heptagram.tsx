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

const title = _x('Heptagram', 'sticker name', 'web-stories');

const Heptagram = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 79 77"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M39.5 0.5L47.8653 23.1293L70.7733 15.5604L58.2966 36.2098L78.4971 49.4008L54.5737 52.5209L56.8554 76.5388L39.5 59.78L22.1446 76.5388L24.4263 52.5209L0.502884 49.4008L20.7034 36.2098L8.22674 15.5604L31.1347 23.1293L39.5 0.5Z"
      fill="white"
    />
  </svg>
);

Heptagram.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 79 / 77,
  svg: Heptagram,
  title,
};
