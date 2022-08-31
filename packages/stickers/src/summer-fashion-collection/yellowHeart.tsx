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

const title = _x('Yellow Heart', 'sticker name', 'web-stories');

const YellowHeart = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 44 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M3.99717 4.44036C6.22369 2.04717 9.34361 0.685474 12.6124 0.680426C15.8837 0.684212 19.0069 2.04518 21.2368 4.43883L21.9968 5.24191L22.7568 4.43883C27.1816 -0.323491 34.6294 -0.596983 39.3916 3.82784C39.6026 4.02399 39.8064 4.22771 40.0026 4.43883C44.6965 9.50177 44.6965 17.3263 40.0026 22.3893L23.1137 40.1997C22.5294 40.8165 21.5557 40.843 20.9388 40.2587C20.9186 40.2395 20.899 40.2199 20.8799 40.1997L3.99708 22.3893C-0.696457 17.3269 -0.696457 9.50276 3.99717 4.44036ZM6.22324 20.2708H6.22477L21.9968 36.9059L37.7703 20.2708C41.3562 16.4023 41.3562 10.4243 37.7703 6.55573C34.5139 3.02629 29.0128 2.80499 25.4833 6.06139C25.312 6.2195 25.1471 6.38437 24.989 6.55573L23.1137 8.53418C22.4957 9.14823 21.4979 9.14823 20.8799 8.53418L19.0045 6.55727C15.7481 3.02783 10.247 2.80653 6.71758 6.06292C6.54622 6.22103 6.38135 6.3859 6.22324 6.55727C2.60619 10.4319 2.57968 16.4208 6.22324 20.2708Z"
      fill="#FFF7CE"
    />
  </svg>
);
YellowHeart.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 44 / 41,
  svg: YellowHeart,
  title,
};
