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

const title = _x('Facebook', 'sticker name', 'web-stories');

const FacebookIcon = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 14 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M8.68442 25.349V13.7867h3.74108l.5612-4.506H8.68442V6.40194c0-1.30378.35013-2.19452 2.15348-2.19452h2.2999V.176657C12.7397.121918 11.3751 0 9.78517 0 6.46854 0 4.19991 2.09998 4.19991 5.95657V9.2807H.449219v4.506H4.19991V25.349h4.48451z"
      fill="#094228"
    />
  </svg>
);

FacebookIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 14 / 26,
  svg: FacebookIcon,
  title,
};
