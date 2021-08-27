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
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('White Banner', 'sticker name', 'web-stories');

const WhiteBanner = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 30 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path d="M0.0980225 0H29.9019L26.0745 20H0.0980225V0Z" fill="white" />
  </svg>
);

WhiteBanner.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 30 / 20,
  svg: WhiteBanner,
  title,
};
