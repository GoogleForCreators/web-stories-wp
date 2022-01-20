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

const title = _x('Pink Blob', 'sticker name', 'web-stories');

function PinkBlob({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 49 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M16.0652 0.528706C24.6408 -0.081876 34.6577 -0.149955 40.1223 2.15848C46.4654 4.83803 47.6275 10.4172 48.2976 17.3001C49.545 30.1126 45.3465 26.536 31.4192 31.9788C17.4918 37.4215 1.86799 36.9415 0.620611 24.129C-0.62677 11.3166 -1.70881 2.63983 16.0652 0.528706Z"
        fill="#F8DFDC"
      />
    </svg>
  );
}

PinkBlob.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 49 / 36,
  svg: PinkBlob,
  title,
};
