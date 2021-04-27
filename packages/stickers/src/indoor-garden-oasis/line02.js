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
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('Line', 'sticker name', 'web-stories');
function HomeGardenLine02({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 58 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M0.976438 3.49363C19.6303 0.748202 38.4493 0.551989 56.8853 2.91001C57.3826 2.96143 57.6018 2.22379 57.114 2.1403C38.6142 -0.233128 19.7219 -0.0202538 1.00431 2.70976C0.500766 2.79433 0.472894 3.5782 0.976438 3.49363Z"
        fill="#65A867"
      />
    </svg>
  );
}

HomeGardenLine02.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 58 / 4,
  svg: HomeGardenLine02,
  title,
};
