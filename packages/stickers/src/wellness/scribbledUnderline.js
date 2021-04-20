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
import PropTypes from 'prop-types';

function ScribbledUnderline({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 182 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.8339 2.72913C35.6434 2.29508 57.4477 1.85524 79.2624 1.75685C101.062 1.65847 122.871 1.90154 144.655 2.81594C156.864 3.33102 169.063 4.06022 181.247 5.05565C181.247 4.47691 181.247 3.89818 181.247 3.31944C157.613 3.50464 133.98 3.64932 110.347 3.88081C86.987 4.10652 63.6274 4.52321 40.2936 5.88903C27.0921 6.66454 13.901 7.74677 0.746074 9.26306C-0.225305 9.37302 -0.271807 11.0398 0.746074 10.9993C20.9022 10.1833 41.0583 9.58716 61.2248 9.1994C81.2672 8.81744 101.315 8.6496 121.362 8.6959C132.647 8.71905 143.931 8.81165 155.211 8.9737C156.208 8.98527 156.208 7.24906 155.211 7.23749C135.044 6.95391 114.878 6.87867 94.7115 7.02335C74.6639 7.16804 54.6214 7.52685 34.579 8.09402C23.2996 8.41811 12.0254 8.80586 0.746074 9.26306C0.746074 9.8418 0.746074 10.4205 0.746074 10.9993C24.0953 8.30815 47.5531 6.99442 71.0161 6.31151C94.4118 5.6286 117.818 5.54758 141.219 5.36238C154.565 5.25821 167.906 5.15404 181.252 5.04986C182.26 5.04408 182.239 3.39468 181.252 3.31365C159.505 1.54272 137.716 0.622529 115.922 0.234776C94.1173 -0.152978 72.3026 -0.0140809 50.4983 0.315799C38.2733 0.506782 26.0536 0.749851 13.8339 0.99292C12.8366 1.01028 12.8315 2.74649 13.8339 2.72913Z"
        fill="#E53616"
      />
    </svg>
  );
}

ScribbledUnderline.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 182 / 11,
  svg: ScribbledUnderline,
};
