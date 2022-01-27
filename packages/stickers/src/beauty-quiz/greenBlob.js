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

const title = _x('Green Blob', 'sticker name', 'web-stories');

function GreenBlob({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 56 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M18.6648 0.413819C28.4376 -0.281989 39.8526 -0.359574 46.08 2.27109C53.3085 5.32466 54.6329 11.6826 55.3965 19.5262C56.818 34.1272 52.0334 30.0514 36.162 36.2538C20.2906 42.4563 2.48594 41.9093 1.06444 27.3084C-0.357053 12.7075 -1.59013 2.81963 18.6648 0.413819Z"
        fill="#397165"
      />
    </svg>
  );
}

GreenBlob.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 56 / 40,
  svg: GreenBlob,
  title,
};
