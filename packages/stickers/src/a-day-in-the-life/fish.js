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

const title = _x('Fish', 'sticker name', 'web-stories');

function Fish({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 50 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5223 14.7C12.5274 14.6906 12.5326 14.681 12.538 14.6713C12.7495 14.2854 13.0845 13.7476 13.5397 13.1023C14.4483 11.8146 15.7886 10.1657 17.4698 8.52761C20.8716 5.21291 25.4514 2.15098 30.5182 1.87193C41.3448 1.27565 47.6896 6.61238 48.0273 12.7446C48.3651 18.8768 42.6447 24.878 31.8181 25.4743C26.7513 25.7533 21.863 23.2128 18.1177 20.2918C16.2668 18.8482 14.7535 17.3565 13.709 16.1763C13.1857 15.5849 12.7937 15.0872 12.541 14.7268C12.5347 14.7178 12.5284 14.7088 12.5223 14.7ZM30.4302 0.274346C19.1638 0.894839 10.7118 13.7659 10.7685 14.7966C10.8253 15.8273 20.6397 27.6923 31.9061 27.0719C43.1725 26.4514 50.0325 20.0565 49.6249 12.6566C49.2174 5.25667 41.6966 -0.346147 30.4302 0.274346Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40.9366 12.6866L49.5519 11.3171L49.8031 12.8973L41.1878 14.2668L40.9366 12.6866Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7224 14.4702L2.97357 4.60783L6.60492 15.5006L4.40468 21.7856L10.7224 14.4702ZM2.86412 26.0173L1.50359 25.2301L4.91413 15.488L0 0.747258L1.388 0L12.7949 14.5183L2.86412 26.0173Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.8585 11.9945C36.8585 13.9827 35.2467 15.5945 33.2585 15.5945C31.2703 15.5945 29.6585 13.9827 29.6585 11.9945C29.6585 10.0063 31.2703 8.39451 33.2585 8.39451C35.2467 8.39451 36.8585 10.0063 36.8585 11.9945ZM33.2585 13.9945C34.3631 13.9945 35.2585 13.0991 35.2585 11.9945C35.2585 10.8899 34.3631 9.99451 33.2585 9.99451C32.1539 9.99451 31.2585 10.8899 31.2585 11.9945C31.2585 13.0991 32.1539 13.9945 33.2585 13.9945Z"
        fill="#FFC864"
      />
    </svg>
  );
}

Fish.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 50 / 28,
  svg: Fish,
  title,
};
