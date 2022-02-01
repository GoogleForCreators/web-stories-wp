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

const title = _x('Burst with Arrow', 'sticker name', 'web-stories');

const FashionStarburstWithArrow = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 280 270"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M157.588 0L140 15.8699 122.428 0l-12.955 19.5973L88.3634 8.44767l-7.497 22.08763-23.3165-5.7131-1.5667 23.1944-24.0747.0489 4.4645 22.8526-23.2996 5.8434 10.1925 21.0622L2.20698 109.071l15.29722 17.937L0 142.976l19.4248 13.705-12.83756 19.662 22.35616 8.611-7.379 22.136 23.8556 2.962-1.4489 23.211 23.8893-2.865 4.5656 22.837 22.3899-8.513 10.2941 21.013 19.509-13.623L140 270l15.381-17.888 19.51 13.623 10.293-21.013 22.407 8.513 4.565-22.837 23.873 2.865-1.449-23.211 23.872-2.962-7.379-22.136 22.34-8.611-12.838-19.662L280 142.976l-17.487-15.968 15.28-17.937-21.059-11.2473 10.193-21.0622-23.283-5.8434 4.447-22.8526-24.057-.0489-1.584-23.1944-23.316 5.7131-7.497-22.08763-21.11 11.14963L157.588 0zm-11.889 109.488c0 10.932 6.756 20.317 16.382 24.413h-57.199v2.198h57.199c-9.626 4.096-16.382 13.481-16.382 24.413h2.197c0-13.443 11.192-24.413 25.017-24.413v-2.198c-13.825 0-25.017-10.97-25.017-24.413h-2.197z"
      fill="#FF3000"
    />
  </svg>
);

FashionStarburstWithArrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 280 / 270,
  svg: FashionStarburstWithArrow,
  title,
};
