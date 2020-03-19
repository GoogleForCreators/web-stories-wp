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
import { number } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { AnimatorOutput, AnimationOutput, WithAnimation } from '../animator';
import { ANIMATION_TYPE } from '../constants';
import AnimationConfigs from '../configs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';

export default {
  title: 'Dashboard/Animations/Bounce',
};

export const _default = () => {
  const { keyframes, ...config } = AnimationConfigs[ANIMATION_TYPE.Bounce];
  const name = ANIMATION_TYPE.Bounce;
  const label = 'Animate';

  return (
    <>
      <AnimationOutput id={name} keyframes={keyframes} {...config} />
      <AnimatorOutput
        id={`${name}-solo`}
        animation={name}
        config={{
          selector: `#anim-solo`,
          animation: name,
        }}
      />
      <button style={{ marginBottom: '10px' }} on={`tap:${name}-solo.restart`}>
        {label}
      </button>
      <WithAnimation
        id={`anim-solo`}
        animation={name}
        style={{
          width: '50px',
          height: '50px',
          ...getInitialStyleFromKeyframes(keyframes),
        }}
      >
        <div
          style={{ width: '100%', height: '100%', backgroundColor: 'red' }}
        />
      </WithAnimation>
    </>
  );
};

export const Cascading = () => {
  const { keyframes, ...config } = AnimationConfigs[ANIMATION_TYPE.Bounce];
  const elementConfigs = [
    { id: 'e1', color: 'red', width: '50px' },
    { id: 'e2', color: 'orange', width: '100px' },
    { id: 'e3', color: 'blue', width: '200px' },
    { id: 'e4', color: 'green', width: '150px' },
  ];

  const name = ANIMATION_TYPE.Bounce;
  const increment = number('Delay (ms)', 200);
  const delay = 100;
  const label = 'Animate';

  return (
    <>
      <AnimationOutput id={name} keyframes={keyframes} {...config} />
      <AnimatorOutput
        id={`${name}-group`}
        animation={name}
        config={elementConfigs.map(({ id }, index) => ({
          selector: `#anim-${id}`,
          animation: name,
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
            animation={name}
            style={{
              width,
              height: '50px',
              marginBottom: '10px',
              ...getInitialStyleFromKeyframes(keyframes),
            }}
          >
            <div
              style={{ width: '100%', height: '100%', backgroundColor: color }}
            />
          </WithAnimation>
        ))}
      </div>
    </>
  );
};
