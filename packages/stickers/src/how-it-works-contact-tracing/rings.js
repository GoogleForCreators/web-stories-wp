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
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('Arrow', 'sticker name', 'web-stories');

const Arrow = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 54 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M31.2643 0.776855L53.7947 23.1199L31.2643 45.463L26.873 41.1081L41.8006 26.2389H0.2052V20.0009H41.8006L26.873 5.13169L31.2643 0.776855ZM31.2643 1.46297L27.5641 5.13246L42.98 20.4881H0.69238V25.7517H42.98L27.5641 41.1074L31.2643 44.7769L53.1029 23.1199L31.2643 1.46297Z"
      fill="white"
    />
  </svg>
);
Arrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 54 / 46,
  svg: Arrow,
  title,
};
