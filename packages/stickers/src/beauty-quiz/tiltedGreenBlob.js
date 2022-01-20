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
/**
 * External dependencies
 */
import { _x } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

const title = _x('Tilted Green Blob', 'sticker name', 'web-stories');

function TiltedGreenBlob({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 56 49"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M11.1754 3.67825C19.4854 1.13738 29.5191 -0.998853 36.1829 0.859482C43.9179 3.01657 47.9165 9.97117 52.0818 18.707C59.8356 34.9688 53.8011 31.2168 42.5634 41.0813C31.3258 50.9459 15.3782 53.5223 7.62443 37.2605C-0.129372 20.9987 -5.61884 10.0346 11.1754 3.67825Z"
        fill="#397165"
      />
    </svg>
  );
}

TiltedGreenBlob.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 56 / 49,
  svg: TiltedGreenBlob,
  title,
};
