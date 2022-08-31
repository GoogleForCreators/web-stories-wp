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

const title = _x('Plus', 'sticker name', 'web-stories');

function Plus({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 23 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M0.5 10.4H10.4V0.5L12.6 0.5V10.4H22.5V12.6H0.5L0.5 10.4Z"
        fill="white"
      />
      <path
        d="M12.6 23.0566L12.6 14.8591H10.4L10.4 23.0566H12.6Z"
        fill="white"
      />
    </svg>
  );
}

Plus.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 23 / 24,
  svg: Plus,
  title,
};
