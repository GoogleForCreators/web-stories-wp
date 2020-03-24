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
import { ANIMATION_TYPE } from '../constants';

function WithAnimation({
  id,
  animationType,
  animationStyle,
  containerStyle,
  children,
}) {
  return animationType === ANIMATION_TYPE.REVEAL ? (
    <div style={{ overflow: 'hidden', ...containerStyle }}>
      <div id={id} style={{ width: '100%', height: '100%', ...animationStyle }}>
        {children}
      </div>
    </div>
  ) : (
    <div id={id} style={{ ...containerStyle, ...animationStyle }}>
      {children}
    </div>
  );
}

WithAnimation.propTypes = {
  id: PropTypes.string,
  animationType: PropTypes.string.isRequired,
  animationStyle: PropTypes.object,
  containerStyle: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

WithAnimation.defaultProps = {
  animationStyle: {},
  containerStyle: {},
};

export default WithAnimation;
