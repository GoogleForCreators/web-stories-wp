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
 * Internal dependencies
 */
import { AnimatorOutput, AnimationOutput, WithAnimation } from '../animator';
import { ANIMATION_TYPE } from '../constants';
import getAnimationConfigs from '../configs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';

export default {
  title: 'Dashboard/Animations/Reveal',
};

export const _default = () => {
  const name = ANIMATION_TYPE.REVEAL;
  const label = 'Animate';

  const { keyframes, ...config } = getAnimationConfigs[name]();

  const words = ['More', 'Stories'];

  return (
    <>
      <button
        style={{ marginBottom: '10px' }}
        on={`tap:${name}-reveal.restart`}
      >
        {label}
      </button>
      <div style={{ padding: '20px', position: 'relative' }}>
        <AnimationOutput id={name} keyframes={keyframes} {...config} />
        <AnimatorOutput
          id={`${name}-reveal`}
          animation={name}
          config={words.map((word, index) => ({
            selector: `#anim-${word}`,
            easing: 'ease-in-out',
            duration: 600,
            delay: index * 50,
          }))}
        />
        {words.map((word, index) => (
          <WithAnimation
            key={index}
            id={`anim-${word}`}
            animationType={name}
            containerStyle={{
              width: '200px',
              height: '100px',
              fontSize: '48px',
              textTransform: 'uppercase',
              position: 'absolute',
              top: `${50 * index}px`,
              zIndex: index,
            }}
            animationStyle={{
              width: '100%',
              height: '100%',
              ...getInitialStyleFromKeyframes(keyframes),
            }}
          >
            {word}
          </WithAnimation>
        ))}
      </div>
    </>
  );
};

export const Vertical = () => {
  const name = ANIMATION_TYPE.REVEAL;
  const label = 'Animate';

  const { keyframes, ...config } = getAnimationConfigs[name]();

  const words = ['Fashion', 'On the Go'];

  return (
    <>
      <button
        style={{ marginBottom: '10px' }}
        on={`tap:${name}-reveal.restart`}
      >
        {label}
      </button>
      <div style={{ padding: '20px', position: 'relative' }}>
        <AnimationOutput id={name} keyframes={keyframes} {...config} />
        <AnimatorOutput
          id={`${name}-reveal`}
          animation={name}
          config={words.map((__, index) => ({
            selector: `#anim-el${index}`,
            easing: 'ease-in-out',
            duration: 800,
            delay: index * 100,
          }))}
        />
        {words.map((word, index) => (
          <WithAnimation
            key={index}
            id={`anim-el${index}`}
            animationType={name}
            containerStyle={{
              width: '300px',
              height: '100px',
              fontSize: '48px',
              textTransform: 'uppercase',
              position: 'absolute',
              top: '100px',
              left: `${-100 + 50 * index}px`,
              zIndex: index,
              transform: 'rotate(-90deg)',
            }}
            animationStyle={{
              width: '100%',
              height: '100%',
              ...getInitialStyleFromKeyframes(keyframes),
            }}
          >
            {word}
          </WithAnimation>
        ))}
      </div>
    </>
  );
};
