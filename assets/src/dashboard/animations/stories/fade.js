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
import { ANIMATION_TYPES } from '../constants';
import getAnimationConfigs from '../configs';
import getInitialStyleFromKeyframes from '../utils/getInitialStyleFromKeyframes';

export default {
  title: 'Dashboard/Animations/Fade',
};

const Fade = ({ from, to, color }) => {
  const name = ANIMATION_TYPES.FADE;
  const label = 'Animate';

  const { keyframes, ...config } = getAnimationConfigs[name]({
    from,
    to,
  });

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput id={name} keyframes={keyframes} {...config} />
      <AnimationOutput
        id={`${name}-fade`}
        config={{
          selector: `#anim`,
          animation: name,
          duration: 2000,
        }}
      />
      <button style={{ marginBottom: '10px' }} on={`tap:${name}-fade.restart`}>
        {label}
      </button>
      <WithAnimation
        id="anim"
        style={{
          width: '200px',
          height: '200px',
        }}
        animationStyle={getInitialStyleFromKeyframes(keyframes)}
      >
        <div
          style={{ width: '100%', height: '100%', backgroundColor: color }}
        />
      </WithAnimation>
    </div>
  );
};

Fade.propTypes = {
  from: PropTypes.number,
  to: PropTypes.number,
  color: PropTypes.string,
};

export const _default = () => {
  return <Fade from={1} to={0} color="red" />;
};

export const FadeIn = () => {
  return <Fade from={0} to={1} color="orange" />;
};
