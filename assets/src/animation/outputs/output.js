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

function WithAnimation({
  id,
  className,
  style,
  animationStyle,
  useClippingContainer,
  children,
}) {
  return useClippingContainer ? (
    <div
      style={{
        clipPath: 'inset(0)',
        ...style,
      }}
    >
      <div
        id={id}
        className={className}
        style={{ width: '100%', height: '100%', ...animationStyle }}
      >
        {children}
      </div>
    </div>
  ) : (
    <div id={id} className={className} style={{ ...style, ...animationStyle }}>
      {children}
    </div>
  );
}

WithAnimation.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  animationStyle: PropTypes.object,
  useClippingContainer: PropTypes.bool,
  children: PropTypes.node,
};

WithAnimation.defaultProps = {
  style: {},
  animationStyle: {},
};

export default WithAnimation;
