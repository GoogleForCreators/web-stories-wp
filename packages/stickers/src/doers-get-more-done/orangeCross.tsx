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

const title = _x('Cross', 'sticker name', 'web-stories');

function OrangeCross({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M3.17925e-05 16.3241L15.5375 0.786638L17.0913 2.34039L1.55378 17.8779L3.17925e-05 16.3241Z"
        fill="#FF7324"
      />
      <path
        d="M1.55375 0.786621L9.79375 9.02662L8.24 10.5804L0 2.34037L1.55375 0.786621Z"
        fill="#FF7324"
      />
      <path
        d="M11.6948 10.9278L17.4843 16.7174L15.9306 18.2711L10.1411 12.4816L11.6948 10.9278Z"
        fill="#FF7324"
      />
    </svg>
  );
}

OrangeCross.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 18 / 19,
  svg: OrangeCross,
  title,
};
