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

const title = _x('Scribbled Arrow', 'sticker name', 'web-stories');

function scribbledArrow({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 96 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M1.66459 19.9878C13.6031 19.2564 25.5416 18.5297 37.4847 17.7984C49.4231 17.0671 61.3616 16.3403 73.3047 15.609C80.0417 15.197 86.7741 14.7851 93.5111 14.3731C94.1429 14.3361 94.521 13.4011 93.8616 13.0771C85.9533 9.21209 78.0128 5.42578 70.0307 1.72742C69.8509 2.14864 69.6757 2.57448 69.4958 2.9957C76.4081 4.77313 82.9929 7.72164 88.9322 11.6977C90.6199 12.8271 92.2477 14.0399 93.8201 15.3313C93.8662 14.9656 93.9123 14.6046 93.9584 14.2389C88.2359 17.604 82.5087 20.9691 76.7862 24.3342C76.0161 24.7832 76.7124 25.9866 77.4825 25.533C83.2096 22.1726 88.9322 18.8075 94.6547 15.4424C95.0098 15.2341 95.1435 14.6416 94.7931 14.35C89.1305 9.69348 82.7209 6.01826 75.8409 3.50486C73.8811 2.7874 71.8845 2.17178 69.8601 1.65336C69.1316 1.46358 68.592 2.57911 69.3252 2.92164C77.3119 6.62463 85.257 10.4109 93.1561 14.2759C93.2714 13.8455 93.3866 13.415 93.5065 12.9799C81.568 13.7112 69.6296 14.4379 57.6865 15.1693C45.748 15.9006 33.8095 16.6273 21.8664 17.3587C15.1294 17.7706 8.397 18.1826 1.65998 18.5945C0.783847 18.6501 0.774623 20.0387 1.66459 19.9878Z"
        fill="#FFFFFF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.5458 18.7965C31.7604 19.1508 25.9776 19.5039 20.1954 19.8569C14.0389 20.2329 7.88306 20.6087 1.72573 20.9859L1.72171 20.9862C1.21392 21.0152 0.745242 20.8306 0.419215 20.4653C0.115733 20.1254 -0.00061555 19.7023 2.44762e-06 19.3294C0.00120792 18.603 0.496401 17.6663 1.59671 17.5965L1.59895 17.5964L21.8053 16.3605C21.8053 16.3605 21.8053 16.3605 21.8053 16.3605C27.5907 16.0063 33.3737 15.6532 39.156 15.3001C45.3124 14.9242 51.4681 14.5483 57.6253 14.1711C63.4101 13.8169 69.1923 13.4639 74.9739 13.1108C78.9713 12.8668 82.9685 12.6227 86.966 12.3783C81.0463 9.51861 75.1016 6.70357 69.1336 3.93509L68.1188 3.67414L68.2721 3.31517C68.1637 3.16631 68.0826 2.99859 68.0327 2.81714C67.9187 2.40191 67.989 1.99601 68.1328 1.67698C68.3326 1.23383 68.7863 0.766467 69.4016 0.65429L69.5158 0.386719L70.2218 0.713821C72.2385 1.23412 74.2291 1.8499 76.1847 2.56581C82.0047 4.69205 87.4924 7.63665 92.486 11.2934C92.9398 11.5144 93.3936 11.7356 93.8472 11.9571L94.8424 11.8962L94.6919 12.4422C94.7373 12.4832 94.78 12.5266 94.8201 12.5721L95.2051 12.3457L95.1138 13.0697C95.1147 13.0722 95.1156 13.0746 95.1164 13.0771C95.1528 13.1797 95.1772 13.2824 95.1915 13.3839C95.2705 13.4483 95.3495 13.5128 95.4282 13.5776L95.4327 13.5813C95.9419 14.005 96.0518 14.6151 95.9757 15.0868C95.9021 15.5427 95.6356 16.0262 95.1611 16.3047C94.997 16.4012 94.8329 16.4977 94.6688 16.5942L94.5856 17.254L94.1521 16.898C88.7661 20.0652 83.3794 23.2324 77.9886 26.3955C77.5512 26.6526 77.0592 26.6999 76.6127 26.545C76.1926 26.3992 75.8806 26.0996 75.6916 25.7736C75.5026 25.4474 75.3984 25.0293 75.4782 24.5943C75.5629 24.1327 75.8429 23.7272 76.2808 23.4713C79.1417 21.789 82.0037 20.1067 84.8656 18.4244C86.461 17.4866 88.0564 16.5488 89.6516 15.6111L73.3658 16.6071C73.3658 16.6071 73.3659 16.6071 73.3658 16.6071C67.5798 16.9614 61.7962 17.3146 56.0133 17.6677C49.8575 18.0436 43.7024 18.4194 37.5458 18.7965ZM1.66459 19.9878C7.82101 19.6107 13.9774 19.2347 20.1345 18.8588C25.9171 18.5057 31.7004 18.1526 37.4847 17.7984C43.6411 17.4213 49.7975 17.0454 55.9545 16.6694C61.7372 16.3163 67.5204 15.9632 73.3047 15.609L92.6889 14.4234C92.7612 14.4801 92.8334 14.537 92.9055 14.594C92.9283 14.612 92.9511 14.6301 92.9739 14.6482C93.0148 14.6807 93.0557 14.7132 93.0965 14.7457C93.0208 14.7902 92.9451 14.8348 92.8693 14.8793C92.8654 14.8816 92.8614 14.884 92.8574 14.8863C92.747 14.9512 92.6366 15.0161 92.5262 15.081C92.4082 15.1504 92.2902 15.2198 92.1722 15.2892C92.0661 15.3516 91.96 15.414 91.8539 15.4764C89.6942 16.7461 87.534 18.0159 85.3738 19.2857C82.5109 20.9685 79.648 22.6513 76.7862 24.3342C76.0161 24.7832 76.7124 25.9866 77.4825 25.533C82.7674 22.4321 88.0483 19.3272 93.329 16.222C93.7709 15.9621 94.2128 15.7022 94.6547 15.4424C94.6574 15.4408 94.6601 15.4392 94.6628 15.4376C94.7282 15.3977 94.7859 15.3448 94.8342 15.2831C94.9963 15.0761 95.0521 14.771 94.9378 14.5347C94.9355 14.53 94.9331 14.5253 94.9307 14.5207C94.8979 14.4574 94.8524 14.3994 94.7931 14.35C94.7903 14.3477 94.7875 14.3454 94.7847 14.3431C94.6181 14.2062 94.4509 14.0701 94.283 13.9348C94.2445 13.9038 94.206 13.8729 94.1675 13.842C94.2579 13.5761 94.2019 13.2756 93.9136 13.1052C93.898 13.0959 93.8816 13.087 93.8645 13.0785C93.8635 13.078 93.8626 13.0776 93.8616 13.0771C93.7416 13.0185 93.6217 12.9599 93.5017 12.9013C92.9904 12.6515 92.4789 12.4021 91.9672 12.1531C91.9333 12.1282 91.8994 12.1033 91.8655 12.0785C89.625 10.4397 87.2837 8.9465 84.8567 7.6087C82.5852 6.35654 80.2385 5.24055 77.8292 4.26879C77.171 4.00333 76.5082 3.74863 75.8409 3.50486C73.9402 2.80904 72.0049 2.20901 70.0432 1.70053C69.9822 1.68472 69.9212 1.669 69.8601 1.65336C69.8578 1.65275 69.8554 1.65215 69.8531 1.65156C69.1281 1.47079 68.5944 2.58022 69.3252 2.92164C69.3363 2.92676 69.3473 2.93187 69.3583 2.93699C69.4038 2.95807 69.4492 2.97914 69.4947 3.00022C72.0028 4.16356 74.5068 5.33511 77.0066 6.51474C79.2863 7.59051 81.5625 8.67299 83.835 9.76207C85.4481 10.5351 87.0594 11.3115 88.6688 12.0912C88.6688 12.0912 88.6688 12.0912 88.6688 12.0912C88.7805 12.1453 88.8923 12.1995 89.004 12.2536C89.6148 12.5498 90.2253 12.8464 90.8356 13.1434C90.3578 13.1727 89.88 13.2019 89.4022 13.2311C89.2026 13.2434 89.003 13.2556 88.8035 13.2678C84.214 13.5485 79.6243 13.8287 75.0344 14.109C69.2525 14.462 63.47 14.8151 57.6865 15.1693C51.5298 15.5464 45.373 15.9224 39.2157 16.2983C33.4333 16.6514 27.6504 17.0045 21.8664 17.3587L1.65998 18.5945C0.783847 18.6501 0.774623 20.0387 1.66459 19.9878Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

scribbledArrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 96 / 27,
  svg: scribbledArrow,
  title,
};
