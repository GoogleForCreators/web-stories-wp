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
import { ANIMATION_TYPES, ROTATION } from '../constants';
import getAnimationConfigs from '../configs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';

export default {
  title: 'Dashboard/Animations/Spin',
};

const SimpleStar = ({ color }) => {
  const style = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: color,
  };

  const rotations = [0, 45, 20, 70];

  return (
    <div>
      {rotations.map((rotation) => (
        <div
          key={rotation}
          style={{
            ...style,
            transform: `rotateZ(${rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

SimpleStar.propTypes = {
  color: PropTypes.string.isRequired,
};

const Spin = ({ name, color, keyframes, animationConfig, animatorConfig }) => {
  const label = 'Animate';

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput id={name} keyframes={keyframes} {...animationConfig} />
      <AnimationOutput
        id={`${name}-spin`}
        animation={name}
        config={animatorConfig}
      />
      <button style={{ marginBottom: '10px' }} on={`tap:${name}-spin.restart`}>
        {label}
      </button>

      <div>
        <h1
          style={{
            position: 'absolute',
            margin: '5px 0 0',
            zIndex: '10',
            textAlign: 'center',
            width: '50px',
            color: 'white',
          }}
        >
          {'A'}
        </h1>
        <WithAnimation
          id="anim-spin"
          style={{
            width: '50px',
            height: '50px',
          }}
          animationStyle={getInitialStyleFromKeyframes(keyframes)}
        >
          <SimpleStar color={color} />
        </WithAnimation>
      </div>
    </div>
  );
};

Spin.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string.isRequired,
  keyframes: PropTypes.object,
  animationConfig: PropTypes.object,
  animatorConfig: PropTypes.arrayOf(Object),
};

export const _default = () => {
  const name = ANIMATION_TYPES.SPIN;
  const { keyframes, ...config } = getAnimationConfigs[name]();

  return (
    <Spin
      color="red"
      name={name}
      keyframes={keyframes}
      animationConfig={config}
      animatorConfig={[
        {
          selector: `#anim-spin`,
          duration: 8000,
          iterations: 'infinity',
        },
      ]}
    />
  );
};

export const defaultCounterClockwise = () => {
  const name = ANIMATION_TYPES.SPIN;
  const { keyframes, ...config } = getAnimationConfigs[name](
    ROTATION.COUNTER_CLOCKWISE
  );

  return (
    <Spin
      color="red"
      name={name}
      keyframes={keyframes}
      animationConfig={config}
      animatorConfig={[
        {
          selector: `#anim-spin`,
          duration: 8000,
          iterations: 'infinity',
        },
      ]}
    />
  );
};

export const fastToSlowClockwise = () => {
  const name = ANIMATION_TYPES.SPIN;
  const { keyframes, ...config } = getAnimationConfigs[name]();

  return (
    <Spin
      color="green"
      name={name}
      keyframes={keyframes}
      animationConfig={config}
      animatorConfig={[
        {
          selector: `#anim-spin`,
          delay: 2000,
          duration: 8000,
          iterations: 'infinity',
        },
        {
          selector: `#anim-spin`,
          duration: 2000,
          easing: 'cubic-bezier(0.02, 0.49, 0.46, 0.84)',
        },
      ]}
    />
  );
};

export const fastToSlowCounterClockwise = () => {
  const name = ANIMATION_TYPES.SPIN;
  const { keyframes, ...config } = getAnimationConfigs[name](
    ROTATION.COUNTER_CLOCKWISE
  );

  return (
    <Spin
      color="green"
      name={name}
      keyframes={keyframes}
      animationConfig={config}
      animatorConfig={[
        {
          selector: `#anim-spin`,
          delay: 2000,
          duration: 8000,
          iterations: 'infinity',
        },
        {
          selector: `#anim-spin`,
          duration: 2000,
          easing: 'cubic-bezier(0.02, 0.49, 0.46, 0.84)',
        },
      ]}
    />
  );
};

export const pingPongSpin = () => {
  const name = ANIMATION_TYPES.SPIN;
  const { keyframes, ...config } = getAnimationConfigs[name](
    ROTATION.PING_PONG
  );

  return (
    <Spin
      color="green"
      name={name}
      keyframes={keyframes}
      animationConfig={config}
      animatorConfig={[
        {
          selector: `#anim-spin`,
          duration: 2000,
          iterations: 'infinity',
          direction: 'alternate',
        },
      ]}
    />
  );
};
