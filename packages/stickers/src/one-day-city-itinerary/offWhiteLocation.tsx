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

const title = _x('Off-white Location', 'sticker name', 'web-stories');

const OffWhiteLocation = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 14 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M7 0.5C3.41633 0.5 0.5 3.38008 0.5 6.92104C0.5 11.9523 6.389 17.1472 6.63961 17.3654C6.74289 17.4554 6.87144 17.5 7 17.5C7.12856 17.5 7.25711 17.4554 7.36039 17.3661C7.611 17.1472 13.5 11.9523 13.5 6.92104C13.5 3.38008 10.5837 0.5 7 0.5ZM7 10.4167C5.00883 10.4167 3.38889 8.82788 3.38889 6.875C3.38889 4.92212 5.00883 3.33333 7 3.33333C8.99117 3.33333 10.6111 4.92212 10.6111 6.875C10.6111 8.82788 8.99117 10.4167 7 10.4167Z"
      fill="#F7ECE3"
    />
  </svg>
);

OffWhiteLocation.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 14 / 18,
  svg: OffWhiteLocation,
  title,
};
