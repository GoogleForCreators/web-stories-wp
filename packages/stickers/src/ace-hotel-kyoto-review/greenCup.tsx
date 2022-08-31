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

const title = _x('Green Cup', 'sticker name', 'web-stories');

function GreenCup({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <circle cx="25" cy="25" r="25" fill="white" />
      <path
        d="M14.5833 20.8335H34.0651C35.0133 20.8335 35.8228 21.1381 36.4936 21.7472C37.1645 22.3564 37.4999 23.0915 37.4999 23.9524C37.4999 24.8134 37.1645 25.5484 36.4936 26.1576C35.8228 26.7667 35.0133 27.0713 34.0651 27.0713H32.616C32.3656 27.981 31.9541 28.8176 31.3817 29.5811C30.8271 30.3445 30.1607 31.0024 29.3825 31.5547C28.6043 32.1071 27.7411 32.5456 26.7929 32.8705C25.8269 33.1792 24.8161 33.3335 23.7607 33.3335C22.4905 33.3335 21.3008 33.1142 20.1917 32.6756C19.0825 32.237 18.112 31.64 17.2801 30.8847C16.4482 30.1293 15.7908 29.2481 15.3078 28.2409C14.8248 27.2338 14.5833 26.1535 14.5833 25.0002V20.8335ZM32.9112 25.0002H34.0651C34.3692 25.0002 34.6331 24.8986 34.8567 24.6956C35.0803 24.4925 35.1922 24.2448 35.1922 23.9524C35.1922 23.6762 35.0803 23.4366 34.8567 23.2336C34.6331 23.0305 34.3692 22.929 34.0651 22.929H32.9112V25.0002Z"
        fill="#19584D"
      />
    </svg>
  );
}

GreenCup.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 50,
  svg: GreenCup,
  title,
};
