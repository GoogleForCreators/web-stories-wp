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

const title = _x('Dot', 'sticker name', 'web-stories');

function OrangeDot({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <rect opacity="0.2" width="64" height="64" rx="32" fill="#F96302" />
      <rect
        x="18.2861"
        y="18.2858"
        width="27.4286"
        height="27.4286"
        rx="13.7143"
        fill="#F96302"
      />
    </svg>
  );
}

OrangeDot.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 64 / 64,
  svg: OrangeDot,
  title,
};
