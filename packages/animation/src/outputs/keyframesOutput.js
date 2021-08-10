/*
 * Copyright 2020 Google LLC
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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { GeneralAnimationPropTypes, KeyframesPropTypes } from './types';

function KeyframesOutput({ id, keyframes, ...options }) {
  return (
    <amp-animation id={id} layout="nodisplay">
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            keyframes,
            ...options,
          }),
        }}
      />
    </amp-animation>
  );
}

KeyframesOutput.propTypes = {
  id: PropTypes.string.isRequired,
  keyframes: KeyframesPropTypes.isRequired,
  ...GeneralAnimationPropTypes,
};

export default KeyframesOutput;
