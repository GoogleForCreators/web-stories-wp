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

const title = _x('Green Curved Line', 'sticker name', 'web-stories');

function GreenCurvedLine({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 58 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M1.08797 3.49363C19.6676 0.748202 38.4117 0.551989 56.7743 2.91001C57.2697 2.96143 57.488 2.22379 57.0021 2.1403C38.576 -0.233129 19.7588 -0.0202542 1.11573 2.70976C0.614194 2.79433 0.586433 3.5782 1.08797 3.49363Z"
        fill="#235524"
      />
    </svg>
  );
}

GreenCurvedLine.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 58 / 4,
  svg: GreenCurvedLine,
  title,
};
