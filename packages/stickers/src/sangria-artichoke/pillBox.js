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

const title = _x('Pill Box', 'sticker name', 'web-stories');

function PillBox({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 56 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36 22.9427H17C15.8954 22.9427 15 23.8381 15 24.9427V41.9427C15 43.0473 15.8954 43.9427 17 43.9427H36C37.1046 43.9427 38 43.0473 38 41.9427V24.9427C38 23.8381 37.1046 22.9427 36 22.9427ZM17 20.9427C14.7909 20.9427 13 22.7336 13 24.9427V41.9427C13 44.1518 14.7909 45.9427 17 45.9427H36C38.2091 45.9427 40 44.1518 40 41.9427V24.9427C40 22.7336 38.2091 20.9427 36 20.9427H17Z"
        fill="#9F240F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43 2.91992H2L2 9.91992H43V2.91992ZM2 0.919922C0.895431 0.919922 0 1.81535 0 2.91992V9.91992C0 11.0245 0.89543 11.9199 2 11.9199H43C44.1046 11.9199 45 11.0245 45 9.91992V2.91992C45 1.81535 44.1046 0.919922 43 0.919922H2Z"
        fill="#9F240F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.797 59.2558L44.9531 64.9245C47.3549 65.5681 49.8237 64.1427 50.4673 61.7409C51.1108 59.3391 49.6855 56.8704 47.2837 56.2268L26.1276 50.558C23.7258 49.9145 21.257 51.3398 20.6134 53.7416C19.9699 56.1434 21.3952 58.6122 23.797 59.2558ZM52.3991 62.2586C53.3286 58.7898 51.2701 55.2244 47.8013 54.2949L26.6452 48.6262C23.1765 47.6967 19.611 49.7552 18.6816 53.224C17.7521 56.6927 19.8107 60.2582 23.2794 61.1876L44.4355 66.8563C47.9042 67.7858 51.4697 65.7273 52.3991 62.2586Z"
        fill="#9F240F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.1884 64.1107L37.5542 51.5493L39.486 52.0669L36.1202 64.6283L34.1884 64.1107Z"
        fill="#9F240F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.6611 54.9165L45.2414 52.1288L38.6332 46.0122L32.8123 52.3009L30.6248 51.7199L37.1654 44.6536L37.164 44.6524L38.5226 43.1846L38.524 43.1859L44.3722 36.8676C46.8116 34.2322 50.9255 34.0732 53.5609 36.5126C56.1964 38.952 56.3553 43.0659 53.9159 45.7013L44.8486 55.4975L42.6611 54.9165ZM46.6 50.661L52.4482 44.3428C54.1372 42.518 54.0272 39.6694 52.2024 37.9803C50.3776 36.2913 47.529 36.4013 45.8399 38.2262L39.9917 44.5444L46.6 50.661Z"
        fill="#9F240F"
      />
      <path
        d="M7 13.9423C7 12.8378 7.89543 11.9423 9 11.9423H36C37.1046 11.9423 38 12.8378 38 13.9423V45.956H40V13.9423C40 11.7332 38.2091 9.94232 36 9.94232H9C6.79086 9.94232 5 11.7332 5 13.9423V51.9423C5 54.1515 6.79086 55.9423 9 55.9423H19.5547V53.9423H9C7.89543 53.9423 7 53.0469 7 51.9423V13.9423Z"
        fill="#9F240F"
      />
    </svg>
  );
}

PillBox.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 56 / 68,
  svg: PillBox,
  title,
};
