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

const title = _x('Arrow Right', 'sticker name', 'web-stories');

const ArrowRight = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 44 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M26.3794 27.4742L34.0047 19.831L26.3794 12.0845V17.5587H15.3536C14.7354 17.5587 14.2201 17.7825 13.808 18.23C13.3958 18.6776 13.1897 19.2113 13.1897 19.831V28.6103H17.5176V22H26.3794V27.4742ZM43.2787 20.4507C44.2404 21.5524 44.2404 22.5853 43.2787 23.5493L23.4941 43.3803C23.082 43.7934 22.5667 44 21.9485 44C21.3302 44 20.815 43.7934 20.4028 43.3803L0.618267 23.5493C0.206087 23.1361 0 22.6197 0 22C0 21.3803 0.206087 20.8639 0.618267 20.4507L20.4028 0.619718C20.815 0.206571 21.3302 0 21.9485 0C22.5667 0 23.082 0.206571 23.4941 0.619718L43.2787 20.4507Z"
      fill="white"
    />
  </svg>
);

ArrowRight.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 44 / 44,
  svg: ArrowRight,
  title,
};
