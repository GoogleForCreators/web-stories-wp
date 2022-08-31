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

const title = _x('Green Location Pin', 'sticker name', 'web-stories');

function LocationPin({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 26 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 30.6714C13 30.6714 25.3636 22.429 25.3636 12.8129C25.3636 9.53381 24.061 6.38908 21.7424 4.07044C19.4238 1.75181 16.279 0.449219 13 0.449219C9.72095 0.449219 6.57621 1.75181 4.25758 4.07044C1.93895 6.38908 0.636353 9.53381 0.636353 12.8129C0.636353 22.429 13 30.6714 13 30.6714ZM17.1211 12.8128C17.1211 15.0889 15.276 16.934 12.9999 16.934C10.7238 16.934 8.87869 15.0889 8.87869 12.8128C8.87869 10.5367 10.7238 8.69156 12.9999 8.69156C15.276 8.69156 17.1211 10.5367 17.1211 12.8128Z"
        fill="#C2CDA3"
      />
    </svg>
  );
}

LocationPin.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 26 / 31,
  svg: LocationPin,
  title,
};
