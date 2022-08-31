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

const title = _x('Cloud Banner', 'sticker name', 'web-stories');

const CloudBanner = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 50 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M23.5464 25.9229C21.4359 26.7493 19.0785 27.2113 16.5915 27.2113C7.56047 27.2113 0.23938 21.1198 0.23938 13.6056C0.23938 6.09145 7.56047 0 16.5915 0C21.1119 0 25.204 1.52619 28.1639 3.99306C30.0853 3.21943 32.2185 2.78873 34.4647 2.78873C42.9124 2.78873 49.7605 8.88018 49.7605 16.3944C49.7605 23.9086 42.9124 30 34.4647 30C30.1885 30 26.3221 28.4391 23.5464 25.9229Z"
      fill="#FDF0D6"
    />
  </svg>
);

CloudBanner.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 30,
  svg: CloudBanner,
  title,
};
