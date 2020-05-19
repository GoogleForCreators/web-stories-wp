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
import {
  AnimatorOutput,
  KeyframesOutput,
  WithAnimation,
} from '../animationOutputs';
import { ANIMATION_TYPES } from '../constants';
import getAnimationConfigs from '../configs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';

export default {
  title: 'Dashboard/Animations/BlinkOn',
};

export const _default = () => {
  const name = ANIMATION_TYPES.BLINK_ON;
  const label = 'Animate';

  const elementConfigs = [
    { id: 'e1', color: 'red' },
    { id: 'e2', color: 'orange' },
    { id: 'e3', color: 'blue' },
    { id: 'e4', color: 'green' },
  ].map((config) => {
    const { keyframes, ...animationConfig } = getAnimationConfigs[name]();
    return {
      ...config,
      keyframes,
      animationConfig,
    };
  });

  return (
    <div style={{ padding: '20px' }}>
      {elementConfigs.map(({ id, keyframes, animationConfig }) => (
        <KeyframesOutput
          key={id}
          id={`${name}-${id}`}
          keyframes={keyframes}
          {...animationConfig}
        />
      ))}
      <AnimatorOutput
        id={`${name}-blink`}
        config={elementConfigs.map(({ id }) => ({
          selector: `#anim-${id}`,
          animation: `${name}-${id}`,
          duration: 3000,
        }))}
      />
      <button style={{ marginBottom: '10px' }} on={`tap:${name}-blink.restart`}>
        {label}
      </button>
      <div
        style={{
          display: 'flex',
          width: '220px',
          justifyContent: 'space-between',
        }}
      >
        {elementConfigs.map(({ id, color, keyframes }) => (
          <WithAnimation
            key={id}
            id={`anim-${id}`}
            style={{
              width: '50px',
              height: '50px',
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
