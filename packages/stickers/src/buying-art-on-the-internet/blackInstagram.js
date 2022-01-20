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

const title = _x('Black Instagram', 'sticker name', 'web-stories');

const BlackInstagram = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 40 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.9091 4.59657C6.89247 4.59657 3.63636 7.85268 3.63636 11.8693V30.0511C3.63636 34.0677 6.89247 37.3238 10.9091 37.3238H29.0909C33.1075 37.3238 36.3636 34.0677 36.3636 30.0511V11.8693C36.3636 7.85268 33.1075 4.59657 29.0909 4.59657H10.9091ZM0 11.8693C0 5.84437 4.88417 0.960205 10.9091 0.960205H29.0909C35.1158 0.960205 40 5.84437 40 11.8693V30.0511C40 36.076 35.1158 40.9602 29.0909 40.9602H10.9091C4.88417 40.9602 0 36.076 0 30.0511V11.8693Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.8788 15.486C19.7439 15.3177 18.5848 15.5116 17.5665 16.04C16.5481 16.5684 15.7223 17.4044 15.2065 18.4292C14.6907 19.454 14.5111 20.6154 14.6934 21.7481C14.8757 22.8808 15.4105 23.9272 16.2217 24.7385C17.033 25.5497 18.0794 26.0845 19.2121 26.2668C20.3448 26.4491 21.5062 26.2695 22.531 25.7537C23.5558 25.2379 24.3918 24.4121 24.9202 23.3937C25.4487 22.3754 25.6425 21.2163 25.4742 20.0814C25.3026 18.9238 24.7631 17.8521 23.9356 17.0246C23.1081 16.1971 22.0364 15.6577 20.8788 15.486ZM15.8917 12.8122C17.5889 11.9316 19.5207 11.6085 21.4122 11.889C23.3415 12.1751 25.1277 13.0741 26.5069 14.4533C27.8861 15.8325 28.7851 17.6187 29.0712 19.5481C29.3517 21.4395 29.0286 23.3713 28.148 25.0685C27.2673 26.7658 25.8738 28.1422 24.1658 29.0019C22.4578 29.8615 20.5223 30.1608 18.6344 29.857C16.7465 29.5532 15.0025 28.6619 13.6504 27.3098C12.2983 25.9577 11.407 24.2137 11.1032 22.3258C10.7994 20.4379 11.0987 18.5024 11.9583 16.7944C12.818 15.0864 14.1944 13.6929 15.8917 12.8122Z"
      fill="black"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M28.1818 10.9602C28.1818 9.95605 28.9958 9.14202 30 9.14202H30.0182C31.0223 9.14202 31.8364 9.95605 31.8364 10.9602C31.8364 11.9644 31.0223 12.7784 30.0182 12.7784H30C28.9958 12.7784 28.1818 11.9644 28.1818 10.9602Z"
      fill="black"
    />
  </svg>
);
BlackInstagram.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 40 / 41,
  svg: BlackInstagram,
  title,
};
