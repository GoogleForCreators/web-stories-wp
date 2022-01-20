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

const title = _x('Flight Path', 'sticker name', 'web-stories');

function FlightPath({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 35 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M21.2338 48.3749C21.6045 48.7492 21.6016 49.3531 21.2274 49.7238C20.8531 50.0946 20.2491 50.0917 19.8784 49.7174C19.5077 49.3431 19.5105 48.7392 19.8848 48.3684C20.2591 47.9977 20.8631 48.0006 21.2338 48.3749Z"
        fill="white"
      />
      <path
        d="M2.59424 13.4632C2.64373 13.4845 2.67836 13.5198 2.69813 13.5693C2.71791 13.6188 2.71718 13.6683 2.69594 13.7178L2.30089 14.6383L3.16999 15.8903L3.033 16.2095L2.01736 15.2989L1.74975 15.9225L1.88745 16.2672L1.78073 16.5159L1.42186 16.1949L0.945641 16.1575L1.06086 15.8993L1.38283 15.7738L1.65363 15.1428L0.290728 15.0414L0.434616 14.7163L1.94406 14.4763L2.33963 13.5649C2.36087 13.5154 2.39624 13.4808 2.44575 13.461C2.49526 13.4412 2.54476 13.442 2.59424 13.4632Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.958541 17.9835C0.888204 18.241 0.822636 18.4989 0.761787 18.757L0.607051 18.7205C0.668326 18.4606 0.734351 18.201 0.805178 17.9416C0.876005 17.6822 0.951115 17.425 1.03042 17.1701L1.18223 17.2173C1.10347 17.4705 1.02888 17.7259 0.958541 17.9835ZM2.33896 14.2528C2.11256 14.7304 1.90205 15.2179 1.70813 15.715L1.56002 15.6572C1.75531 15.1566 1.96731 14.6657 2.19531 14.1847L2.33896 14.2528ZM0.451149 20.3181C0.365514 20.8447 0.299029 21.3716 0.251267 21.898L0.0929388 21.8836C0.141038 21.3535 0.207992 20.8229 0.294232 20.2926L0.451149 20.3181ZM0.163453 23.4885C0.152873 24.0206 0.1611 24.5516 0.187688 25.0807L0.0289103 25.0887C0.00213619 24.5559 -0.006149 24.0212 0.00450506 23.4853L0.163453 23.4885ZM3.90183 11.4794C3.61 11.9216 3.33304 12.3747 3.0717 12.8384L2.9332 12.7603C3.19638 12.2934 3.47528 11.8371 3.76914 11.3919L3.90183 11.4794ZM5.83456 8.94992C5.48411 9.34883 5.1472 9.75951 4.82458 10.1816L4.69827 10.085C5.02311 9.66007 5.36231 9.24659 5.71513 8.84499L5.83456 8.94992ZM0.322755 26.6674C0.386075 27.1949 0.467498 27.7198 0.566572 28.2415L0.410386 28.2711C0.310642 27.746 0.228664 27.2175 0.164909 26.6864L0.322755 26.6674ZM0.91617 29.7955C1.04982 30.3089 1.2006 30.8183 1.36807 31.3232L1.21717 31.3732C1.04862 30.8651 0.896852 30.3523 0.762319 29.8355L0.91617 29.7955ZM8.09107 6.7033C7.69027 7.05295 7.30148 7.41507 6.92545 7.78929L6.8133 7.67661C7.19183 7.2999 7.58316 6.93541 7.98656 6.58351L8.09107 6.7033ZM1.91819 32.8183C2.11697 33.3095 2.33175 33.7954 2.56209 34.2754L2.41876 34.3441C2.187 33.8612 1.97087 33.3723 1.77082 32.878L1.91819 32.8183ZM10.6198 4.76769C10.1775 5.06397 9.74558 5.37327 9.32476 5.69523L9.22816 5.56897C9.65165 5.24497 10.0863 4.93372 10.5313 4.63561L10.6198 4.76769ZM13.3705 3.16032C12.8948 3.40094 12.4279 3.65503 11.9704 3.92223L11.8902 3.78495C12.3505 3.51613 12.8202 3.26051 13.2988 3.01846L13.3705 3.16032ZM3.29555 35.6899C3.55373 36.1525 3.82672 36.6087 4.11409 37.0577L3.98019 37.1434C3.6911 36.6917 3.41647 36.2328 3.15673 35.7674L3.29555 35.6899ZM16.2926 1.89258C15.792 2.07593 15.2986 2.27306 14.813 2.48363L14.7497 2.33778C15.2382 2.12597 15.7345 1.9277 16.238 1.7433L16.2926 1.89258ZM5.01244 38.3736C5.32363 38.8017 5.6484 39.2223 5.98634 39.6346L5.86338 39.7354C5.5235 39.3207 5.19685 38.8977 4.88384 38.467L5.01244 38.3736ZM19.3428 0.968895C18.8241 1.09451 18.3111 1.23417 17.8044 1.38755L17.7583 1.23539C18.2679 1.08114 18.7838 0.940698 19.3054 0.814382L19.3428 0.968895ZM7.03157 40.8379C7.39001 41.2275 7.76086 41.6085 8.14371 41.9803L8.03295 42.0944C7.64797 41.7205 7.27504 41.3374 6.91457 40.9455L7.03157 40.8379ZM9.31759 43.0585C9.71689 43.4054 10.1274 43.7427 10.5488 44.07L10.4513 44.1956C10.0276 43.8665 9.61483 43.5273 9.21334 43.1785L9.31759 43.0585ZM22.4761 0.391625C21.9469 0.459324 21.4219 0.541213 20.9017 0.636977L20.873 0.480626C21.396 0.384334 21.9239 0.301998 22.456 0.233932L22.4761 0.391625ZM11.8336 45.0131C12.2683 45.3145 12.7132 45.6055 13.1678 45.8858L13.0844 46.0211C12.6273 45.7394 12.1801 45.4467 11.743 45.1438L11.8336 45.0131ZM25.6545 0.158951C25.1206 0.169252 24.5895 0.193838 24.062 0.232412L24.0504 0.0738587C24.5808 0.0350772 25.1147 0.0103586 25.6515 0L25.6545 0.158951ZM14.5471 46.6862C15.0113 46.9394 15.4846 47.1816 15.9667 47.4125L15.898 47.5559C15.4135 47.3238 14.9377 47.0803 14.471 46.8258L14.5471 46.6862ZM28.8409 0.26667C28.3084 0.220478 27.7777 0.188561 27.2492 0.170648L27.2546 0.0117605C27.7859 0.0297672 28.3194 0.0618519 28.8546 0.108286L28.8409 0.26667ZM17.4213 48.0629C17.9089 48.266 18.4045 48.4576 18.9079 48.6373L18.8544 48.787C18.3485 48.6064 17.8503 48.4138 17.3602 48.2097L17.4213 48.0629ZM31.9964 0.706703C31.4716 0.60565 30.9473 0.518756 30.4242 0.445763L30.4462 0.28831C30.972 0.36168 31.4989 0.449024 32.0265 0.550592L31.9964 0.706703ZM20.4273 49.1362L20.5311 48.7723L21.1696 49.4317L20.7251 49.5459L20.7259 49.543L20.2793 49.655L20.3837 49.2891C20.3813 49.2884 20.3789 49.2877 20.3765 49.287L20.4222 49.1347C20.4239 49.1352 20.4256 49.1357 20.4273 49.1362ZM33.5585 1.04923L33.5534 1.04797L33.5914 0.893596C33.5938 0.894194 33.5963 0.894793 33.5987 0.895391L33.6947 0.527282L34.0224 0.850718L34.0232 0.847831L34.348 1.17206L33.463 1.41541L33.5585 1.04923Z"
        fill="white"
      />
    </svg>
  );
}

FlightPath.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 35 / 50,
  svg: FlightPath,
  title,
};
