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
import { GeneralAnimationPropTypes } from './types';

function Animator({ id, animation, config, trigger }) {
  const configs = Array.isArray(config) ? config : [config];

  return (
    <amp-animation id={id} layout="nodisplay" trigger={trigger}>
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            configs.map((conf) => ({
              animation,
              ...conf,
            }))
          ),
        }}
      />
    </amp-animation>
  );
}

const AnimationConfigPropTypes = PropTypes.shape({
  selector: PropTypes.string.isRequired,
  ...GeneralAnimationPropTypes,
});

Animator.propTypes = {
  id: PropTypes.string.isRequired,
  animation: PropTypes.string.isRequired,
  config: PropTypes.oneOfType([
    AnimationConfigPropTypes,
    PropTypes.arrayOf(AnimationConfigPropTypes),
  ]).isRequired,
  trigger: PropTypes.oneOf(['visibility']),
};

export default Animator;
