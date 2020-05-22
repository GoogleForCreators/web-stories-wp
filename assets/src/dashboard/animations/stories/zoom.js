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
  title: 'Dashboard/Animations/Zoom',
};

const Zoom = ({ from, to }) => {
  const name = ANIMATION_TYPES.ZOOM;
  const label = 'Animate';

  const { useContainer, keyframes, ...config } = getAnimationConfigs[name]({
    from,
    to,
  });

  return (
    <div style={{ padding: '20px' }}>
      <KeyframesOutput id={name} keyframes={keyframes} {...config} />
      <AnimationOutput
        id={`${name}-zoom`}
        config={[
          {
            selector: `#anim`,
            animation: name,
            duration: 4000,
          },
          {
            selector: `#anim-tree`,
            animation: name,
            duration: 4000,
          },
        ]}
      />
      <button style={{ marginBottom: '10px' }} on={`tap:${name}-zoom.restart`}>
        {label}
      </button>
      <div style={{ position: 'relative' }}>
        <WithAnimation
          id="anim"
          useContainer={useContainer}
          style={{
            position: 'absolute',
            width: '300px',
            height: '500px',
            zIndex: 1,
          }}
          animationStyle={getInitialStyleFromKeyframes(keyframes)}
        >
          <img
            alt="Nature"
            style={{ width: '100%', height: '100%' }}
            src="http://placeimg.com/225/400/nature"
          />
        </WithAnimation>
        <WithAnimation
          id="anim-tree"
          useContainer={useContainer}
          style={{
            position: 'absolute',
            width: '300px',
            height: '500px',
            clipPath: 'polygon(56% 61%, 79% 77%, 55% 94%, 31% 76%)',
            zIndex: 2,
          }}
          animationStyle={{
            transformOrigin: '55% 90%',
            ...getInitialStyleFromKeyframes(keyframes),
          }}
        >
          <img
            alt="Nature"
            style={{ width: '100%', height: '100%' }}
            src="http://placeimg.com/225/400/nature"
          />
        </WithAnimation>
      </div>
    </div>
  );
};

Zoom.propTypes = {
  from: PropTypes.number,
  to: PropTypes.number,
};

export const _default = () => {
  return <Zoom from={1} to={1.25} />;
};

export const ZoomOut = () => {
  return <Zoom from={1.25} to={1} />;
};
