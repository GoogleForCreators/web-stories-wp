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

const title = _x('White Frame Corner', 'sticker name', 'web-stories');

const WhiteFrameCorner = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      opacity="0.6"
      d="M25.5 25.5L25.5 0.5L0.5 0.500001L0.5 1.5L24.5 1.5L24.5 25.5H25.5Z"
      fill="white"
    />
  </svg>
);

WhiteFrameCorner.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 26 / 26,
  svg: WhiteFrameCorner,
  title,
};
