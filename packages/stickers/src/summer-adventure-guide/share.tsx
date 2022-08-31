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

const title = _x('Share', 'sticker name', 'web-stories');

const Share = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 37 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M30.8971 28.2353C32.5284 28.2353 33.9088 28.8157 35.0382 29.9765C36.1677 31.1373 36.7324 32.502 36.7324 34.0706C36.7324 35.702 36.152 37.098 34.9912 38.2588C33.8304 39.4196 32.4657 40 30.8971 40C29.3284 40 27.9637 39.4196 26.803 38.2588C25.6422 37.098 25.0618 35.702 25.0618 34.0706C25.0618 33.4431 25.0931 33.0039 25.1559 32.7529L10.9441 24.4706C9.75196 25.5373 8.37158 26.0706 6.80295 26.0706C5.17157 26.0706 3.75982 25.4745 2.56765 24.2824C1.37549 23.0902 0.779419 21.6784 0.779419 20.0471C0.779419 18.4157 1.37549 17.0039 2.56765 15.8118C3.75982 14.6196 5.17157 14.0235 6.80295 14.0235C8.37158 14.0235 9.75196 14.5569 10.9441 15.6235L25.0618 7.43529C24.9363 6.80784 24.8735 6.33726 24.8735 6.02353C24.8735 4.39215 25.4696 2.9804 26.6618 1.78824C27.8539 0.596072 29.2657 0 30.8971 0C32.5284 0 33.9402 0.596072 35.1324 1.78824C36.3245 2.9804 36.9206 4.39215 36.9206 6.02353C36.9206 7.65491 36.3245 9.06666 35.1324 10.2588C33.9402 11.451 32.5284 12.0471 30.8971 12.0471C29.3912 12.0471 28.0108 11.4824 26.7559 10.3529L12.6382 18.6353C12.7637 19.2628 12.8265 19.7333 12.8265 20.0471C12.8265 20.3608 12.7637 20.8314 12.6382 21.4588L26.9441 29.7412C28.0735 28.7373 29.3912 28.2353 30.8971 28.2353Z"
      fill="white"
    />
  </svg>
);

Share.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 37 / 40,
  svg: Share,
  title,
};
