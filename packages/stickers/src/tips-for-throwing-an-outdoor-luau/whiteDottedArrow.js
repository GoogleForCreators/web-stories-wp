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

const title = _x('White Dotted Arrow', 'sticker name', 'web-stories');

const WhiteDottedArrow = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 52 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M2.887 18.467c1.474-.298 2.943-.625 4.417-.922 2.264-.488 1.556-3.995-.708-3.507-1.474.298-2.943.625-4.417.923-2.264.487-1.556 3.994.708 3.506zM13.348 16.63c1.326-.267 2.629-.653 3.89-1.091.914-.338 1.177-1.618.804-2.402-.467-.948-1.482-1.11-2.402-.803-.972.35-1.969.582-2.971.784-2.3.465-1.591 3.971.678 3.513zM22.35 14.72c1.415-.285 2.825-.6 4.21-.88 2.264-.488 1.556-3.994-.708-3.507-1.415.286-2.824.601-4.21.881-2.24.452-1.532 3.959.708 3.506zM32.462 12.526a72.276 72.276 0 014.328-.905c2.281-.399 1.574-3.905-.708-3.506-1.45.262-2.895.554-4.328.905-2.252.546-1.544 4.053.708 3.506z"
      fill="#fff"
    />
    <path
      d="M34.93 3.933a2479.52 2479.52 0 0113.902 3.204l-.907-2.67a2664.914 2664.914 0 00-8.9 10.477c-1.489 1.742 1.517 3.71 2.976 1.975 2.979-3.485 5.928-6.963 8.9-10.476.694-.815.12-2.447-.907-2.669C45.362 2.716 40.73 1.658 36.092.57c-2.224-.532-3.416 2.837-1.162 3.363z"
      fill="#fff"
    />
  </svg>
);

WhiteDottedArrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 52 / 19,
  svg: WhiteDottedArrow,
  title,
};
