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
import { AnimationOutput, KeyframesOutput, WithAnimation } from '../outputs';
import { ANIMATION_TYPES } from '../constants';
import getAnimationConfigs from '../configs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';

export default {
  title: 'Dashboard/Animations/Move',
};

export const _default = () => {
  const name = ANIMATION_TYPES.MOVE;
  const label = 'Animate';

  const { keyframes, ...config } = getAnimationConfigs[name]({
    offsetX: -100,
    offsetY: 200,
  });

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput id={name} keyframes={keyframes} {...config} />
      <AnimationOutput
        id={`${name}-anim`}
        config={{
          selector: `#anim`,
          animation: name,
          duration: 800,
          easing: 'ease-in-out',
        }}
      />
      <button style={{ marginBottom: '10px' }} on={`tap:${name}-anim.restart`}>
        {label}
      </button>
      <WithAnimation
        id="anim"
        style={{
          width: '50px',
          height: '50px',
          position: 'absolute',
          top: '50px',
          left: '100px',
        }}
        animationStyle={getInitialStyleFromKeyframes(keyframes)}
      >
        <div
          style={{ width: '100%', height: '100%', backgroundColor: 'orange' }}
        />
      </WithAnimation>
    </div>
  );
};

export const Repeater = () => {
  const name = ANIMATION_TYPES.MOVE;
  const label = 'Animate';
  const delay = 100;
  const increment = 200;

  const { keyframes, ...config } = getAnimationConfigs[name]({
    offsetX: -100,
    offsetY: -100,
  });

  const elements = [
    { id: 'el1', color: 'red' },
    { id: 'el2', color: 'orange' },
    { id: 'el3', color: 'green' },
    { id: 'el4', color: 'blue' },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput id={name} keyframes={keyframes} {...config} />
      <AnimationOutput
        id={`${name}-anim`}
        config={elements.map(({ id }, index) => ({
          selector: `#anim-${id}`,
          animation: name,
          duration: 800,
          delay: delay + increment * index,
          easing: 'ease-in-out',
        }))}
      />
      <button style={{ marginBottom: '10px' }} on={`tap:${name}-anim.restart`}>
        {label}
      </button>
      {elements.map(({ id, color }, index) => (
        <WithAnimation
          key={id}
          id={`anim-${id}`}
          style={{
            width: '100px',
            height: '200px',
            position: 'absolute',
            top: '150px',
            left: '100px',
            zIndex: 10 - index,
          }}
          animationStyle={getInitialStyleFromKeyframes(keyframes)}
        >
          <div
            style={{ width: '100%', height: '100%', backgroundColor: color }}
          />
        </WithAnimation>
      ))}
    </div>
  );
};
