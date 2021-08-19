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

const title = _x('Jump Rope', 'sticker name', 'web-stories');

function JumpRope({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 44 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 30H6V46H0V30ZM2 32V44H4V32H2Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.3295 27.598L38.0921 31.2473L28.3606 43.9477L23.598 40.2984L33.3295 27.598ZM33.7006 30.402L26.402 39.9273L27.9895 41.1437L35.2881 31.6184L33.7006 30.402Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.53055 31.464C3.52022 31.5409 3.49176 31.7526 3.39443 31.9472L1.60557 31.0528C1.57006 31.1238 1.55267 31.1847 1.54601 31.2132C1.54696 31.2073 1.54808 31.1998 1.54932 31.1906C1.55626 31.1393 1.56432 31.0546 1.57271 30.9271C1.58939 30.6735 1.60305 30.3212 1.61982 29.8656C1.62135 29.824 1.6229 29.7816 1.62448 29.7385C1.65711 28.8487 1.70119 27.6466 1.79931 26.2428C2.00479 23.3029 2.44899 19.4455 3.53787 15.6024C4.62452 11.7672 6.37331 7.87349 9.23602 4.92804C12.1264 1.95408 16.1034 0 21.5 0C24.1868 0 26.2949 0.531636 27.8692 1.52163C29.4616 2.52293 30.4328 3.94692 30.9055 5.57228C30.914 5.60131 30.9223 5.63041 30.9304 5.65956C32.1785 5.46965 33.4165 5.39161 34.6018 5.43827C38.7686 5.60232 42.6673 7.36789 43.58 11.6919C44.0194 13.7737 43.7203 16.3148 42.5725 19.3348C41.4229 22.3592 39.3995 25.9252 36.3029 30.0961L34.6971 28.9039C37.7255 24.8248 39.6396 21.422 40.7029 18.6242C41.768 15.8219 41.9571 13.6873 41.6231 12.105C40.989 9.10086 38.2939 7.58518 34.5232 7.43673C33.4712 7.39531 32.3653 7.46504 31.2457 7.63458C31.3919 10.3401 30.5039 13.3161 29.2052 15.8882C27.5671 19.1322 25.109 22.0624 22.7032 23.2076C21.4749 23.7923 20.0893 23.9821 18.861 23.248C17.6737 22.5384 16.9191 21.1282 16.5207 19.2026C15.6468 14.9785 18.3468 11.4094 21.9432 9.04701C24.0038 7.69342 26.4577 6.65974 28.9609 6.04968C28.606 4.8905 27.9226 3.91775 26.8046 3.2147C25.6426 2.48399 23.9382 2 21.5 2C16.6466 2 13.1861 3.73342 10.6702 6.32196C8.12669 8.93901 6.50048 12.4828 5.46213 16.1476C4.42601 19.8045 3.99521 23.5096 3.79444 26.3822C3.69868 27.7523 3.65564 28.9257 3.623 29.8157L3.61846 29.9391C3.60203 30.3858 3.58737 30.7699 3.5684 31.0583C3.55897 31.2017 3.54738 31.3395 3.53131 31.4584L3.53055 31.464ZM29.2591 8.03634C27.0433 8.59604 24.8671 9.51921 23.0412 10.7186C19.7157 12.9031 17.8532 15.7715 18.4793 18.7974C18.8309 20.4968 19.4044 21.2428 19.887 21.5313C20.3287 21.7952 20.9548 21.8249 21.8436 21.4018C23.6722 20.5313 25.8704 18.0553 27.4198 14.9868C28.5965 12.6565 29.3027 10.1747 29.2591 8.03634ZM1.54265 31.2304C1.54265 31.2304 1.54351 31.2239 1.54601 31.2132C1.54403 31.2254 1.54265 31.2304 1.54265 31.2304Z"
        fill="#FFC864"
      />
    </svg>
  );
}

JumpRope.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 44 / 46,
  svg: JumpRope,
  title,
};
