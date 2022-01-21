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

const title = _x('White Line', 'sticker name', 'web-stories');

const WhiteLine = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 54 3"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M1.35956 2.14847C14.6931 2.24904 28.0153 2.1033 41.2932 1.70828C45.0941 1.5944 48.8805 1.45586 52.6846 1.30721C53.2209 1.28534 53.039 0.708323 52.5192 0.731685C39.2786 1.27021 26.009 1.57254 12.6972 1.60241C8.93879 1.61498 5.18246 1.60438 1.42716 1.5822C0.877387 1.56782 0.82531 2.14717 1.35956 2.14847Z"
      fill="white"
    />
  </svg>
);

WhiteLine.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 54 / 3,
  svg: WhiteLine,
  title,
};
