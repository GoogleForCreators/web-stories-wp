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

const title = _x('Arrow', 'sticker name', 'web-stories');

const FashionArrowLight = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 17 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M15.9436 4.43653c.2145-.21452.2145-.56234 0-.77687L12.4477.163723c-.2146-.2145286-.5624-.2145286-.7769 0-.2145.214527-.2145.562346 0 .776874L14.7783 4.0481l-3.1075 3.10749c-.2145.21453-.2145.56235 0 .77688s.5623.21453.7769 0l3.4959-3.49594zm-15.769772.1609H15.5552V3.49876H.173828v1.09867z"
      fill="#FFECE3"
    />
  </svg>
);

FashionArrowLight.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 17 / 9,
  svg: FashionArrowLight,
  title,
};
