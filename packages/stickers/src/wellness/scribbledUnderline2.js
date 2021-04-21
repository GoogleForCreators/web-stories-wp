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
        d="M185.725 2.91649C161.781 3.2373 137.829 3.5581 113.884 3.8789C89.9391 4.19971 65.9873 4.52051 42.0425 4.84132C28.5652 5.02602 15.081 5.201 1.60371 5.38571C1.60371 4.41358 1.60371 3.44144 1.60371 2.46931C32.7201 2.75123 63.8365 2.97482 94.953 3.32479C125.776 3.67476 156.613 4.31636 187.401 6.53282C204.817 7.80632 222.226 9.5756 239.586 12.074C240.912 12.2684 240.926 15.1848 239.586 14.9904C208.769 10.5672 177.814 8.4382 146.858 7.34942C116 6.26063 85.1278 6.15369 54.2628 5.87178C36.7074 5.71623 19.1521 5.55097 1.59674 5.39543C0.249004 5.38571 0.249004 2.49848 1.59674 2.47903C25.5416 2.15823 49.4934 1.83743 73.4382 1.51662C97.3831 1.19582 121.335 0.875016 145.28 0.554212C158.764 0.359786 172.248 0.184802 185.725 9.67822e-05C187.073 -0.0193459 187.073 2.89705 185.725 2.91649Z"
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
