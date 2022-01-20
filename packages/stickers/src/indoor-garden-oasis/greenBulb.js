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

const title = _x('Green Bulb', 'sticker name', 'web-stories');

function GreenBulb({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 26 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M18.2285 32.2222H7.77149C7.36673 32.2222 7.04717 31.8985 7.04717 31.4978C7.04717 29.2781 6.5998 27.3113 5.95156 25.5294C5.28811 23.7044 4.41466 22.052 3.60512 20.5044C2.23256 17.8994 1 15.5657 1 13.0409V12.9022C1.03348 9.01475 2.55212 5.9196 4.80421 3.78629C7.04717 1.65298 10.0327 0.500005 13.0183 0.500005C13.0457 0.500005 13.07 0.500005 13.0883 0.509254H13.1309C16.2716 0.536999 19.4032 1.85645 21.6614 4.23947C23.6792 6.37894 25 9.36003 25 13.0378C25 15.5627 23.7674 17.8964 22.404 20.5013C20.7819 23.578 18.9528 27.0369 18.9528 31.4947C18.9528 31.8985 18.6333 32.2222 18.2285 32.2222ZM8.228 34.8611C7.83236 34.8611 7.50368 34.5374 7.50368 34.1274C7.50368 33.7266 7.83236 33.3937 8.228 33.3937H17.769C18.1646 33.3937 18.4933 33.7266 18.4933 34.1274C18.4933 34.5374 18.1646 34.8611 17.769 34.8611H8.228ZM14.4486 20.2146V19.1911C14.4486 18.7811 14.7682 18.4574 15.1638 18.4574C15.5686 18.4574 15.8882 18.7811 15.8882 19.1911V30.761H17.5194C17.702 26.3125 19.5128 22.8782 21.1258 19.8108C22.404 17.3908 23.5574 15.2051 23.5574 13.0378C23.5574 9.77004 22.3918 7.13115 20.6145 5.25063C18.6333 3.14815 15.8821 1.99517 13.1126 1.96743H13.0183C10.3949 1.96743 7.76541 2.98168 5.78113 4.85911C3.80294 6.73038 2.47603 9.46484 2.43951 12.9084V13.0409C2.43951 15.2081 3.59599 17.3939 4.87116 19.8139C5.71722 21.4231 6.61501 23.1248 7.30281 25.0208C7.93279 26.7595 8.3893 28.6461 8.47755 30.761H10.1088V19.1911C10.1088 18.7811 10.4284 18.4574 10.8331 18.4574C11.2288 18.4574 11.5483 18.7811 11.5483 19.1911V20.2146H14.4486ZM14.4486 30.761V21.6821H11.5514V30.761H14.4486ZM9.07405 37.5C8.66929 37.5 8.34973 37.1671 8.34973 36.7663C8.34973 36.3655 8.66929 36.0326 9.07405 36.0326H16.8468C17.2516 36.0326 17.5711 36.3655 17.5711 36.7663C17.5711 37.1671 17.2516 37.5 16.8468 37.5H9.07405Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.7166 25.6148C5.07839 23.8592 4.24331 22.2633 3.45246 20.7519C3.4295 20.708 3.40658 20.6642 3.38371 20.6205C3.38367 20.6204 3.38374 20.6206 3.38371 20.6205L3.35703 20.5699C2.00225 17.9987 0.75 15.6222 0.75 13.0409V12.9C0.784063 8.9446 2.33096 5.78482 4.63212 3.60495C6.92226 1.42687 9.96968 0.250005 13.0183 0.250005L13.0207 0.250003C13.0325 0.249987 13.0566 0.249955 13.0811 0.252354C13.0928 0.253501 13.1079 0.255446 13.1251 0.259254H13.1331C16.341 0.287592 19.5375 1.63471 21.8429 4.06751C23.9047 6.25374 25.25 9.29676 25.25 13.0378C25.25 15.6037 24.0126 17.9675 22.6761 20.5207L22.6255 20.6173L22.6223 20.6234C20.9989 23.7025 19.2028 27.109 19.2028 31.4947C19.2028 32.0349 18.773 32.4722 18.2285 32.4722H7.77149C7.22769 32.4722 6.79717 32.0356 6.79717 31.4978C6.79717 29.3129 6.35701 27.3752 5.7166 25.6148ZM13.0883 0.509254C13.07 0.500005 13.0457 0.500005 13.0183 0.500005C10.0327 0.500005 7.04717 1.65298 4.80421 3.78629C2.55212 5.9196 1.03348 9.01475 1 12.9022V13.0409C1 15.5602 2.22713 17.8891 3.59604 20.4872L3.60512 20.5044C3.62884 20.5498 3.65261 20.5952 3.67643 20.6407C4.46566 22.149 5.30754 23.7579 5.95156 25.5294C6.5998 27.3113 7.04717 29.2781 7.04717 31.4978C7.04717 31.8985 7.36673 32.2222 7.77149 32.2222H18.2285C18.6333 32.2222 18.9528 31.8985 18.9528 31.4947C18.9528 27.0471 20.7735 23.5938 22.3929 20.5224L22.404 20.5013L22.4379 20.4366C23.7878 17.8577 25 15.5417 25 13.0378C25 9.36003 23.6792 6.37894 21.6614 4.23947C19.4032 1.85645 16.2716 0.536999 13.1309 0.509254H13.0883ZM4.89624 19.8616C5.73493 21.4567 6.6218 23.1435 7.30281 25.0208C7.93279 26.7595 8.3893 28.6461 8.47755 30.761H10.1088V19.1911C10.1088 18.7811 10.4284 18.4574 10.8331 18.4574C11.2288 18.4574 11.5483 18.7811 11.5483 19.1911V20.2146H14.4486V19.1911C14.4486 18.7811 14.7682 18.4574 15.1638 18.4574C15.5686 18.4574 15.8882 18.7811 15.8882 19.1911V30.761H17.5194C17.7016 26.3225 19.5046 22.8938 21.1148 19.8316L21.1258 19.8108C22.404 17.3908 23.5574 15.2051 23.5574 13.0378C23.5574 9.77004 22.3918 7.13115 20.6145 5.25063C18.6333 3.14815 15.8821 1.99517 13.1126 1.96743H13.0183C10.3949 1.96743 7.76541 2.98168 5.78113 4.85911C3.80294 6.73038 2.47603 9.46484 2.43951 12.9084V13.0409C2.43951 15.1992 3.58644 17.3758 4.85534 19.7838L4.89624 19.8616ZM2.68951 12.9097V13.0409C2.68951 15.1334 3.80781 17.2596 5.09234 19.6973L5.12043 19.7508C5.95735 21.3425 6.85097 23.0422 7.53783 24.9355C8.15077 26.6272 8.60294 28.4624 8.71574 30.511H9.8588V19.1911C9.8588 18.6461 10.2873 18.2074 10.8331 18.2074C11.3719 18.2074 11.7983 18.6482 11.7983 19.1911V19.9646H14.1986V19.1911C14.1986 18.6482 14.625 18.2074 15.1638 18.2074C15.7097 18.2074 16.1382 18.6461 16.1382 19.1911V30.511H17.2811C17.5192 26.1321 19.3081 22.7302 20.8865 19.7287L20.9045 19.6944C22.1919 17.2571 23.3074 15.1303 23.3074 13.0378C23.3074 9.83275 22.1655 7.25562 20.4328 5.42235C18.4996 3.37078 15.8139 2.24484 13.1114 2.21743H13.0183C10.4581 2.21743 7.8903 3.20767 5.95295 5.04071C4.02513 6.86433 2.72565 9.53338 2.68951 12.9097ZM8.228 35.1111C7.69331 35.1111 7.25368 34.6745 7.25368 34.1274C7.25368 33.5916 7.69126 33.1437 8.228 33.1437H17.769C18.3057 33.1437 18.7433 33.5916 18.7433 34.1274C18.7433 34.6745 18.3036 35.1111 17.769 35.1111H8.228ZM14.4486 21.6821V30.761H11.5514V21.6821H14.4486ZM11.8014 21.9321V30.511H14.1986V21.9321H11.8014ZM9.07405 37.75C8.52616 37.75 8.09973 37.3 8.09973 36.7663C8.09973 36.2326 8.52616 35.7826 9.07405 35.7826H16.8468C17.3947 35.7826 17.8211 36.2326 17.8211 36.7663C17.8211 37.3 17.3947 37.75 16.8468 37.75H9.07405ZM7.50368 34.1274C7.50368 34.5374 7.83236 34.8611 8.228 34.8611H17.769C18.1646 34.8611 18.4933 34.5374 18.4933 34.1274C18.4933 33.7266 18.1646 33.3937 17.769 33.3937H8.228C7.83236 33.3937 7.50368 33.7266 7.50368 34.1274ZM8.34973 36.7663C8.34973 37.1671 8.66929 37.5 9.07405 37.5H16.8468C17.2516 37.5 17.5711 37.1671 17.5711 36.7663C17.5711 36.3655 17.2516 36.0326 16.8468 36.0326H9.07405C8.66929 36.0326 8.34973 36.3655 8.34973 36.7663Z"
        fill="#235524"
      />
    </svg>
  );
}

GreenBulb.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 26 / 38,
  svg: GreenBulb,
  title,
};
