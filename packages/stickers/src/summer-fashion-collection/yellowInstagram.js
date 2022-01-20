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

const title = _x('Yellow Instagram', 'sticker name', 'web-stories');

const YellowInstagramIcon = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 40 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M20 4.28518C25.34 4.28518 25.9733 4.30518 28.0833 4.40184C33.5033 4.64851 36.035 7.22018 36.2817 12.6002C36.3783 14.7085 36.3967 15.3418 36.3967 20.6818C36.3967 26.0235 36.3767 26.6552 36.2817 28.7635C36.0333 34.1385 33.5083 36.7152 28.0833 36.9618C25.9733 37.0585 25.3433 37.0785 20 37.0785C14.66 37.0785 14.0267 37.0585 11.9183 36.9618C6.485 36.7135 3.96667 34.1302 3.72 28.7618C3.62333 26.6535 3.60333 26.0218 3.60333 20.6802C3.60333 15.3402 3.625 14.7085 3.72 12.5985C3.96833 7.22018 6.49333 4.64684 11.9183 4.40018C14.0283 4.30518 14.66 4.28518 20 4.28518ZM20 0.680176C14.5683 0.680176 13.8883 0.703509 11.755 0.800176C4.49167 1.13351 0.455 5.16351 0.121667 12.4335C0.0233333 14.5685 0 15.2485 0 20.6802C0 26.1118 0.0233333 26.7935 0.12 28.9268C0.453333 36.1902 4.48333 40.2268 11.7533 40.5602C13.8883 40.6568 14.5683 40.6802 20 40.6802C25.4317 40.6802 26.1133 40.6568 28.2467 40.5602C35.5033 40.2268 39.55 36.1968 39.8783 28.9268C39.9767 26.7935 40 26.1118 40 20.6802C40 15.2485 39.9767 14.5685 39.88 12.4352C39.5533 5.17851 35.5183 1.13518 28.2483 0.801842C26.1133 0.703509 25.4317 0.680176 20 0.680176ZM20 10.4102C14.3283 10.4102 9.73 15.0085 9.73 20.6802C9.73 26.3518 14.3283 30.9518 20 30.9518C25.6717 30.9518 30.27 26.3535 30.27 20.6802C30.27 15.0085 25.6717 10.4102 20 10.4102ZM20 27.3468C16.3183 27.3468 13.3333 24.3635 13.3333 20.6802C13.3333 16.9985 16.3183 14.0135 20 14.0135C23.6817 14.0135 26.6667 16.9985 26.6667 20.6802C26.6667 24.3635 23.6817 27.3468 20 27.3468ZM30.6767 7.60518C29.35 7.60518 28.275 8.68018 28.275 10.0052C28.275 11.3302 29.35 12.4052 30.6767 12.4052C32.0017 12.4052 33.075 11.3302 33.075 10.0052C33.075 8.68018 32.0017 7.60518 30.6767 7.60518Z"
      fill="#FFF7CE"
    />
  </svg>
);
YellowInstagramIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 40 / 41,
  svg: YellowInstagramIcon,
  title,
};
