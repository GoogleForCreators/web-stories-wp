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
import { AnimationOutput, KeyframesOutput, WithAnimation } from '../outputs';
import { ANIMATION_TYPES, DIRECTION } from '../constants';
import getAnimationConfigs from '../configs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';

export default {
  title: 'Dashboard/Animations/FloatOn',
};

const FloatOn = ({ direction }) => {
  const name = ANIMATION_TYPES.FLOAT_ON;
  const { keyframes, ...config } = getAnimationConfigs[name](direction);

  const label = 'Animate';
  const text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel dui erat. Curabitur sit amet venenatis felis. In ac ornare lacus. Integer vitae lacus a lectus eleifend finibus.';

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput id={name} keyframes={keyframes} {...config} />
      <AnimationOutput
        id={`${name}-anim`}
        animation={name}
        config={{
          selector: `#anim`,
          duration: 650,
          easing: 'ease-out',
        }}
      />
      <button on={`tap:${name}-anim.restart`}>{label}</button>
      <WithAnimation
        id="anim"
        style={{
          position: 'absolute',
          top: '50px',
          left: '100px',
          width: '200px',
        }}
        animationStyle={getInitialStyleFromKeyframes(keyframes)}
      >
        <div>{text}</div>
      </WithAnimation>
    </div>
  );
};

FloatOn.propTypes = {
  direction: PropTypes.string,
};

export const _default = () => {
  return <FloatOn />;
};

export const TopToBottom = () => {
  return <FloatOn direction={DIRECTION.TOP_TO_BOTTOM} />;
};

export const LeftToRight = () => {
  return <FloatOn direction={DIRECTION.LEFT_TO_RIGHT} />;
};

export const RightToLeft = () => {
  return <FloatOn direction={DIRECTION.RIGHT_TO_LEFT} />;
};
