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

const title = _x('Running', 'sticker name', 'web-stories');

function RunningFigure({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 48 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M41.8398 5.21845C41.8398 6.63431 41.3341 7.84789 40.3228 8.85922C39.3115 9.87055 38.0777 10.3762 36.6214 10.3762C35.2055 10.3762 33.9919 9.87055 32.9806 8.85922C31.9692 7.84789 31.4636 6.63431 31.4636 5.21845C31.4636 3.76213 31.9692 2.52832 32.9806 1.51699C33.9919 0.505657 35.2055 0 36.6214 0C38.0777 0 39.3115 0.505657 40.3228 1.51699C41.3341 2.52832 41.8398 3.76213 41.8398 5.21845ZM32.3738 21.6019L27.8228 29.2476L35.6505 30.8252C36.5809 31.0275 37.39 31.432 38.0777 32.0388C38.7654 32.6456 39.271 33.394 39.5947 34.284L44.267 48.3617L39.3519 50L34.6796 35.9223L21.2694 33.2524L16.2937 41.5049C15.8487 42.2735 15.2318 42.8904 14.443 43.3556C13.6541 43.8208 12.7945 44.0534 11.8641 44.0534H0.39563V38.835H11.8641L25.0316 16.9296L19.9345 15.8981L15.6869 24.4539L11.0146 22.1481L15.3228 13.5922C15.8487 12.5404 16.6375 11.7516 17.6893 11.2257C18.7411 10.6998 19.8333 10.5583 20.966 10.801L30.9175 12.8034C31.6052 12.9248 32.2322 13.1776 32.7985 13.5619C33.3649 13.9462 33.8301 14.4215 34.1942 14.9879L37.7743 20.3883L46.3908 18.2039L47.6044 23.2403L39.0485 25.3641C38.8463 25.445 38.6339 25.4955 38.4114 25.5158C38.1889 25.536 37.9765 25.5461 37.7743 25.5461C36.9248 25.5461 36.1157 25.3439 35.3471 24.9393C34.5785 24.5348 33.9515 23.9685 33.466 23.2403L32.3738 21.6019Z"
        fill="white"
      />
    </svg>
  );
}

RunningFigure.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 48 / 50,
  svg: RunningFigure,
  title,
};
