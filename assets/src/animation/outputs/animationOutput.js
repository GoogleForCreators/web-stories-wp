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

function AnimationOutput({ config }) {
  const configs = Array.isArray(config) ? config : [config];

  return (
    <amp-story-animation layout="nodisplay" trigger="visibility">
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            // Only print the actual items needed for the animations,
            // as defined by the prop types.
            // Prevents printing the `element` prop which `config` can have.
            configs.map(
              ({
                selector,
                animation,
                keyframes,
                delay,
                direction,
                duration,
                easing,
                endDelay,
                fill,
                iterationStart,
                iterations,
              }) => ({
                selector,
                animation,
                keyframes,
                delay,
                direction,
                duration,
                easing,
                endDelay,
                fill,
                iterationStart,
                iterations,
              })
            )
          ),
        }}
      />
    </amp-story-animation>
  );
}

const AnimationConfigPropTypes = PropTypes.shape({
  selector: PropTypes.string.isRequired,
  animation: PropTypes.string,
  keyframes: KeyframesPropTypes,
  ...GeneralAnimationPropTypes,
});

AnimationOutput.propTypes = {
  config: PropTypes.oneOfType([
    AnimationConfigPropTypes,
    PropTypes.arrayOf(AnimationConfigPropTypes),
  ]).isRequired,
};

export default AnimationOutput;
