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

const title = _x('Green Leaf Banner', 'sticker name', 'web-stories');

const GreenLeafBanner = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 43 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M41.9743 28.096C43.0565 24.2879 38.1535 21.8021 34.9412 20.9069C33.0596 20.3954 31.1855 20.1253 29.349 20.1185C31.5039 19.0608 33.5762 17.8641 35.4761 16.4626C37.7583 14.7903 41.1944 11.2887 38.6674 7.94629C36.3654 4.92567 31.5569 5.77207 29.076 7.02377C27.2584 7.93511 25.8345 9.25234 24.6917 10.8146C24.9499 9.07703 25.0994 7.29931 25.0053 5.53994C24.9337 3.87568 23.2422 -0.86063 20.6675 0.20456C19.3371 0.764601 18.1906 2.52068 17.4938 3.66212C16.5459 5.20964 15.8379 6.93267 15.3661 8.71049C15.0104 10.1408 14.7821 11.5857 14.6513 13.0232C14.55 12.5953 14.4187 12.1454 14.2986 11.7431C13.9385 10.5362 12.6709 7.17138 11.0634 8.86541C9.35098 10.64 8.70707 13.7858 8.31411 16.2111C8.06709 17.6816 7.94751 19.1667 7.90664 20.67C7.43406 19.3021 6.95771 17.8136 6.12911 16.6177C4.8206 14.7563 2.63182 15.0423 1.74391 16.6337C0.634981 18.6531 0.699414 21.6488 1.0373 24.0189C1.41274 26.6524 2.44779 29.1394 4.01502 31.4653C4.09751 31.6043 4.21747 31.692 4.37489 31.7285C5.17721 32.7086 6.28682 33.5203 7.28773 34.2918C9.55945 36.0322 13.1206 38.4013 15.9202 37.658C17.6442 37.1892 17.5577 35.9859 16.894 34.7534C18.2847 35.4955 19.7316 36.1608 21.2235 36.7017C22.9027 37.301 25.193 38.0721 26.5232 36.883C28.4643 35.2364 26.8746 32.8154 24.7527 30.8701C27.2828 31.5022 29.8241 31.8672 32.3427 31.8225C35.3599 31.7887 41.128 31.3297 41.9743 28.096Z"
      fill="#3F4F3E"
    />
  </svg>
);

GreenLeafBanner.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 43 / 38,
  svg: GreenLeafBanner,
  title,
};
