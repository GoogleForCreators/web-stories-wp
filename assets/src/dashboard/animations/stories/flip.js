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
import { ANIMATION_TYPES, ROTATION, AXIS, DIRECTION } from '../constants';
import theme from '../../theme';
import getAnimationConfigs from '../configs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';

export default {
  title: 'Dashboard/Animations/Flip',
};

const Flip = ({ name, duration, content, containerStyle, direction }) => {
  const increment = 100;
  const delay = 100;
  const label = 'Animate';

  const floatOnName = ANIMATION_TYPES.FLOAT_ON;
  const { keyframes: floatKeyframes, ...floatConfig } = getAnimationConfigs[
    floatOnName
  ](direction);
  const animatorConfig = content.map(({ id }, index) => ({
    animation: `${id}-${name}`,
    selector: `#anim-${id}`,
    duration: duration || 600,
    easing: 'ease-in',
    delay: delay + increment * index,
  }));

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput
        id={floatOnName}
        keyframes={floatKeyframes}
        {...floatConfig}
      />
      {content.map(({ id, keyframes, animationConfig }) => (
        <KeyframesOutput
          key={id}
          id={`${id}-${name}`}
          keyframes={keyframes}
          {...animationConfig}
        />
      ))}

      <AnimationOutput
        id={`${name}-anim`}
        config={[
          ...animatorConfig,
          {
            animation: floatOnName,
            selector: `#anim-${floatOnName}`,
            duration: duration || 600,
            easing: 'ease-in-out',
          },
        ]}
      />

      <button style={{ marginBottom: '10px' }} on={`tap:${name}-anim.restart`}>
        {label}
      </button>

      <div
        style={{
          position: 'relative',
          width: '250px',
          height: '400px',
          padding: '20px',
          borderRadius: '20px',
          backgroundColor: '#333',
        }}
      >
        {content.map(({ id, text, color, keyframes, rotation }) => (
          <WithAnimation key={id} id={`anim-${floatOnName}`}>
            <div
              style={{
                width: '100%',
                ...containerStyle,
                textAlign:
                  rotation === ROTATION.COUNTER_CLOCKWISE ? 'right' : 'left',
              }}
            >
              <WithAnimation
                id={`anim-${id}`}
                style={{
                  display: 'inline-block',
                  fontSize: '48px',
                  fontFamily: theme.typography.family.primary,
                  fontWeight: 600,
                  color,
                  textTransform: 'uppercase',
                }}
                animationStyle={getInitialStyleFromKeyframes(keyframes)}
              >
                {text}
              </WithAnimation>
            </div>
          </WithAnimation>
        ))}
      </div>
    </div>
  );
};

Flip.propTypes = {
  name: PropTypes.string,
  duration: PropTypes.number,
  content: PropTypes.arrayOf(Object),
  containerStyle: PropTypes.object,
  direction: PropTypes.string,
};

export const _default = () => {
  const name = ANIMATION_TYPES.FLIP;
  const content = [
    {
      id: 'el1',
      text: 'Start',
      color: 'white',
      rotation: ROTATION.CLOCKWISE,
      axis: AXIS.Y,
    },
    {
      id: 'el2',
      text: 'with',
      color: 'white',
      rotation: ROTATION.CLOCKWISE,
      axis: AXIS.Y,
    },
    {
      id: 'el3',
      text: 'The',
      color: '#ef8341',
      rotation: ROTATION.COUNTER_CLOCKWISE,
      axis: AXIS.Y,
    },
    {
      id: 'el4',
      text: 'Founda',
      color: '#ef8341',
      rotation: ROTATION.COUNTER_CLOCKWISE,
      axis: AXIS.Y,
    },
    {
      id: 'el5',
      text: 'tion',
      color: '#ef8341',
      rotation: ROTATION.COUNTER_CLOCKWISE,
      axis: AXIS.Y,
    },
  ].map((config) => {
    const { keyframes, ...animationConfig } = getAnimationConfigs[name]({
      rotation: config.rotation,
      axis: config.axis,
    });

    return {
      ...config,
      keyframes,
      animationConfig,
    };
  });

  return <Flip name={name} content={content} />;
};

export const Vertical = () => {
  const name = ANIMATION_TYPES.FLIP;
  const content = [
    {
      id: 'el1',
      text: 'Ready set go',
      color: 'white',
      rotation: ROTATION.CLOCKWISE,
      axis: AXIS.X,
    },
  ].map((config) => {
    const { keyframes, ...animationConfig } = getAnimationConfigs[name]({
      rotation: config.rotation,
      axis: config.axis,
    });

    return {
      ...config,
      keyframes,
      animationConfig,
    };
  });

  return (
    <Flip
      name={name}
      content={content}
      duration={400}
      containerStyle={{
        position: 'absolute',
        top: '85px',
        left: '-40px',
        width: '100%',
        transform: 'rotateZ(90deg)',
        whiteSpace: 'nowrap',
      }}
      direction={DIRECTION.LEFT_TO_RIGHT}
    />
  );
};
