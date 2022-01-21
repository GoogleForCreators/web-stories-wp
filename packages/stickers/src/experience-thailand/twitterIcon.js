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

const title = _x('Twitter', 'sticker name', 'web-stories');

const TwitterIcon = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 28 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M27.7837 3.04797c-1.0187.43934-2.1139.73673-3.2623.86966 1.1716-.68491 2.0722-1.76635 2.4982-3.057313-1.0974.633093-2.3129 1.092703-3.6072 1.340533C22.3751 1.12842 20.9003.457031 19.2657.457031c-3.1349 0-5.6794 2.473789-5.6794 5.526589 0 .43258.0509.85389.1481 1.25943-4.72087-.22981-8.90694-2.43098-11.70846-5.77442-.48853.81558-.76868 1.76634-.76868 2.77794 0 1.91729 1.00253 3.60929 2.526 4.60061-.93076-.02929-1.80594-.27712-2.5723-.69167v.06984c0 2.67885 1.95874 4.91155 4.55651 5.41845-.47695.1262-.97937.1938-1.49568.1938-.36582 0-.72238-.0338-1.06967-.0992.72237 2.1967 2.82004 3.7941 5.30667 3.8391-1.94485 1.4825-4.39213 2.3657-7.05473 2.3657-.458428 0-.909912-.0271-1.3544506-.0766C2.61403 21.4347 5.59845 22.3494 8.80515 22.3494c10.44665 0 16.16085-8.4217 16.16085-15.72593 0-.23881-.0047-.47763-.0162-.7142 1.109-.77953 2.0722-1.75282 2.8339-2.8613z"
      fill="#094228"
    />
  </svg>
);

TwitterIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 28 / 23,
  svg: TwitterIcon,
  title,
};
