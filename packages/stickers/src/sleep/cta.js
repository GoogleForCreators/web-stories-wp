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

const title = _x('Circled Dot', 'sticker name', 'web-stories');

const Cta = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 61 61"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <rect
      opacity=".2"
      x=".496094"
      y=".235352"
      width="60"
      height="59.9336"
      rx="29.9668"
      fill="#fff"
    />
    <rect
      x="18.4971"
      y="18.2168"
      width="24"
      height="23.9734"
      rx="11.9867"
      fill="#FDF5DC"
    />
  </svg>
);

Cta.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 61 / 61,
  svg: Cta,
  title,
};
