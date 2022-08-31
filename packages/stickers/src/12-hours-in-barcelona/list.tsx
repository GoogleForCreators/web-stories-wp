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

const title = _x('List', 'sticker name', 'web-stories');

const List = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 30 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.51724 1C2.3841 1 1.46552 1.91859 1.46552 3.05172V34.9483C1.46552 36.0814 2.3841 37 3.51724 37H26.4828C27.6159 37 28.5345 36.0814 28.5345 34.9483V3.05172C28.5345 1.91859 27.6159 1 26.4828 1H3.51724ZM0.465515 3.05172C0.465515 1.3663 1.83182 0 3.51724 0H26.4828C28.1682 0 29.5345 1.3663 29.5345 3.05172V34.9483C29.5345 36.6337 28.1682 38 26.4828 38H3.51724C1.83182 38 0.465515 36.6337 0.465515 34.9483V3.05172ZM7.48276 13.8966C7.48276 13.6204 7.70661 13.3966 7.98276 13.3966H15.6379C15.9141 13.3966 16.1379 13.6204 16.1379 13.8966C16.1379 14.1727 15.9141 14.3966 15.6379 14.3966H7.98276C7.70661 14.3966 7.48276 14.1727 7.48276 13.8966ZM7.48276 19C7.48276 18.7239 7.70661 18.5 7.98276 18.5H22.0172C22.2934 18.5 22.5172 18.7239 22.5172 19C22.5172 19.2761 22.2934 19.5 22.0172 19.5H7.98276C7.70661 19.5 7.48276 19.2761 7.48276 19ZM7.48276 24.1034C7.48276 23.8273 7.70661 23.6034 7.98276 23.6034H22.0172C22.2934 23.6034 22.5172 23.8273 22.5172 24.1034C22.5172 24.3796 22.2934 24.6034 22.0172 24.6034H7.98276C7.70661 24.6034 7.48276 24.3796 7.48276 24.1034ZM7.48276 29.2069C7.48276 28.9308 7.70661 28.7069 7.98276 28.7069H22.0172C22.2934 28.7069 22.5172 28.9308 22.5172 29.2069C22.5172 29.483 22.2934 29.7069 22.0172 29.7069H7.98276C7.70661 29.7069 7.48276 29.483 7.48276 29.2069Z"
      fill="#FFC700"
    />
  </svg>
);

List.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 30 / 38,
  svg: List,
  title,
};
