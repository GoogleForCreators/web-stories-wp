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

const title = _x('Red Section Separator', 'sticker name', 'web-stories');

const RedSectionSeparator = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 40 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M10.5149 17.9471C6.42464 19.3069 1.05691 16.39 -6.12655e-07 14.9808L3.03282 31.036L40 31.036L40 2.40625C37.299 1.43064 30.7046 -0.589522 25.6369 3.06902C20.5691 6.72756 20.7859 14.5324 10.5149 17.9471Z"
      fill="#E0193E"
    />
  </svg>
);

RedSectionSeparator.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 40 / 32,
  svg: RedSectionSeparator,
  title,
};
