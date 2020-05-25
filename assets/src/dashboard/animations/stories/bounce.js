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
  title: 'Dashboard/Animations/Bounce',
};

export const _default = () => {
  const name = ANIMATION_TYPES.BOUNCE;
  const { keyframes, ...config } = getAnimationConfigs[name]();
  const label = 'Animate';

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput id={name} keyframes={keyframes} {...config} />
      <AnimationOutput
        id={`${name}-solo`}
        animation={name}
        config={{
          selector: `#anim-solo`,
        }}
      />
      <button style={{ marginBottom: '10px' }} on={`tap:${name}-solo.restart`}>
        {label}
      </button>
      <WithAnimation
        id={`anim-solo`}
        style={{
          width: '50px',
          height: '50px',
        }}
        animationStyle={getInitialStyleFromKeyframes(keyframes)}
      >
        <div
          style={{ width: '100%', height: '100%', backgroundColor: 'red' }}
        />
      </WithAnimation>
    </div>
  );
};

export const Cascading = () => {
  const name = ANIMATION_TYPES.BOUNCE;
  const { keyframes, ...config } = getAnimationConfigs[name]();
  const elementConfigs = [
    { id: 'e1', color: 'red', width: '50px' },
    { id: 'e2', color: 'orange', width: '100px' },
    { id: 'e3', color: 'blue', width: '200px' },
    { id: 'e4', color: 'green', width: '150px' },
  ];

  const increment = 200;
  const delay = 100;
  const label = 'Animate';

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput id={name} keyframes={keyframes} {...config} />
      <AnimationOutput
        id={`${name}-group`}
        animation={name}
        config={elementConfigs.map(({ id }, index) => ({
          selector: `#anim-${id}`,
          delay: delay + increment * index,
        }))}
      />
      <button on={`tap:${name}-group.restart`}>{label}</button>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '200px',
        }}
      >
        {elementConfigs.map(({ id, color, width }, index) => (
          <WithAnimation
            id={`anim-${id}`}
            key={index}
            style={{
              width,
              height: '50px',
              marginBottom: '10px',
            }}
            animationStyle={getInitialStyleFromKeyframes(keyframes)}
          >
            <div
              style={{ width: '100%', height: '100%', backgroundColor: color }}
            />
          </WithAnimation>
        ))}
      </div>
    </div>
  );
};
