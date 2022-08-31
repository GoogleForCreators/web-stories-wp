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

const title = _x('Black Star', 'sticker name', 'web-stories');

const BlackStar = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M20 0L23.8268 10.7612L34.1421 5.85786L29.2388 16.1732L40 20L29.2388 23.8268L34.1421 34.1421L23.8268 29.2388L20 40L16.1732 29.2388L5.85786 34.1421L10.7612 23.8268L0 20L10.7612 16.1732L5.85786 5.85786L16.1732 10.7612L20 0Z"
      fill="#020202"
    />
  </svg>
);

BlackStar.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 40 / 40,
  svg: BlackStar,
  title,
};
