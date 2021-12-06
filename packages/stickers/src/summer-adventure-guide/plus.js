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

const title = _x('Plus', 'sticker name', 'web-stories');

const Plus = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M8.60506 31.1897L16.2748 0.529297L25.3901 2.80951L17.7203 33.4699L8.60506 31.1897Z"
      fill="white"
    />
    <path
      d="M0.529663 17.7209L31.19 25.3907L33.4702 16.2754L2.80986 8.60565L0.529663 17.7209Z"
      fill="white"
    />
  </svg>
);

Plus.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 34 / 34,
  svg: Plus,
  title,
};
