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

function ScribbledUnderline2({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 241 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M185.253 2.91649C161.308 3.2373 137.356 3.5581 113.411 3.8789C89.4665 4.19971 65.5146 4.52051 41.5698 4.84132C28.0926 5.02602 14.6083 5.201 1.13106 5.38571C1.13106 4.41358 1.13106 3.44144 1.13106 2.46931C32.2475 2.75123 63.3639 2.97482 94.4803 3.32479C125.303 3.67476 156.141 4.31636 186.929 6.53282C204.344 7.80632 221.753 9.5756 239.113 12.074C240.44 12.2684 240.454 15.1848 239.113 14.9904C208.297 10.5672 177.341 8.4382 146.385 7.34942C115.527 6.26063 84.6552 6.15369 53.7901 5.87178C36.2348 5.71623 18.6794 5.55097 1.12408 5.39543C-0.223648 5.38571 -0.223648 2.49848 1.12408 2.47903C25.0689 2.15823 49.0207 1.83743 72.9656 1.51662C96.9104 1.19582 120.862 0.875016 144.807 0.554212C158.291 0.359786 171.776 0.184802 185.253 9.67822e-05C186.601 -0.0193459 186.601 2.89705 185.253 2.91649Z"
        fill="#E53616"
      />
    </svg>
  );
}

ScribbledUnderline2.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 241 / 15,
  svg: ScribbledUnderline2,
};
