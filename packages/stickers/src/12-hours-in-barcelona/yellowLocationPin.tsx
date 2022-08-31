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

const title = _x('Yellow Location Pin', 'sticker name', 'web-stories');

const YellowLocationPin = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 32 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M16.046 0.5C20.2759 0.5 23.8774 1.99493 26.8506 4.98485C29.8238 7.97476 31.3103 11.5875 31.3103 15.8232C31.3103 20.0589 29.8238 23.6717 26.8506 26.6616L16 37.5L5.1954 26.6616C2.19155 23.6717 0.689651 20.0589 0.689651 15.8232C0.689651 11.5875 2.19155 7.97476 5.1954 4.98485C8.19924 1.99493 11.8161 0.5 16.046 0.5ZM16 20.9154C17.3487 20.9154 18.4827 20.4482 19.4023 19.5139C20.3525 18.5484 20.8276 17.4038 20.8276 16.0802C20.8276 14.7565 20.3525 13.612 19.4023 12.6465C18.4521 11.681 17.318 11.1982 16 11.1982C14.7126 11.1982 13.5939 11.681 12.6437 12.6465C11.6935 13.612 11.2184 14.7565 11.2184 16.0802C11.2184 17.4038 11.6935 18.5484 12.6437 19.5139C13.5632 20.4482 14.682 20.9154 16 20.9154Z"
      fill="#FFC700"
    />
  </svg>
);

YellowLocationPin.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 32 / 38,
  svg: YellowLocationPin,
  title,
};
