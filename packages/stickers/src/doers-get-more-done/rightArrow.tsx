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

const title = _x('Arrow', 'sticker name', 'web-stories');

function RightArrow({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 18 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M16.8371 7.04675L10.4371 0.24707L8.83708 1.75308L13.4942 6.70109H0.0371094V8.89842H16.0371C16.4754 8.89842 16.8718 8.63788 17.0457 8.23551C17.2195 7.83314 17.1376 7.36593 16.8371 7.04675Z"
        fill="#F9F3E9"
      />
      <path
        d="M14.1383 9.78401L8.85498 15.3973L10.3635 17L15.6468 11.3867L14.1383 9.78401Z"
        fill="#F9F3E9"
      />
    </svg>
  );
}

RightArrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 18 / 17,
  svg: RightArrow,
  title,
};
