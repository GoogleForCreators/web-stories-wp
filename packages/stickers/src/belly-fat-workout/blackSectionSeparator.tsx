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

const title = _x('Black Section Separator', 'sticker name', 'web-stories');

function BlackSectionSeparator({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 58 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M0.385451 0H0.347076V40H57.4701V0H57.2931C48.5117 3.57576 38.9056 5.54593 28.8393 5.54593C18.773 5.54593 9.16686 3.57576 0.385451 0Z"
        fill="black"
      />
    </svg>
  );
}

BlackSectionSeparator.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 58 / 40,
  svg: BlackSectionSeparator,
  title,
};
