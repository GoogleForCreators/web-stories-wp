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
import StoryAnimation from '../../../../components/storyAnimation';
import { PlayButton, AMPStoryWrapper } from '../../../../storybookUtils';
import { ANIMATION_TYPES, ROTATION } from '../../../constants';

export default {
  title: 'Dashboard/Animations/Spin',
};

const animations = [
  {
    targets: ['e1'],
    type: ANIMATION_TYPES.SPIN,
    delay: 2000,
    duration: 8000,
    iterations: 'infinity',
    rotation: ROTATION.CLOCKWISE,
  },
  {
    targets: ['e1'],
    type: ANIMATION_TYPES.SPIN,
    duration: 2000,
    easing: 'cubic-bezier(0.02, 0.49, 0.46, 0.84)',
    rotation: ROTATION.CLOCKWISE,
  },
  {
    targets: ['e2'],
    type: ANIMATION_TYPES.SPIN,
    duration: 8000,
    iterations: 'infinity',
    rotation: ROTATION.CLOCKWISE,
  },
  {
    targets: ['e3'],
    type: ANIMATION_TYPES.SPIN,
    duration: 8000,
    iterations: 'infinity',
    rotation: ROTATION.COUNTER_CLOCKWISE,
  },
  {
    targets: ['e4'],
    type: ANIMATION_TYPES.SPIN,
    duration: 2000,
    iterations: 'infinity',
    direction: 'alternate',
    rotation: ROTATION.PING_PONG,
  },
];

const elements = [
  { id: 'e1', color: 'red' },
  { id: 'e2', color: 'orange' },
  { id: 'e3', color: 'green' },
  { id: 'e4', color: 'blue' },
];

const defaultStyles = {
  width: '50px',
  height: '50px',
};

const SimpleStar = ({ color }) => {
  const rotations = [0, 45, 20, 70];
  return (
    <div>
      {rotations.map((rotation) => (
        <div
          key={rotation}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: color,
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

export const _default = () => {
  return (
    <StoryAnimation.Provider animations={animations}>
      <PlayButton />
      {elements.map(({ id, color }) => (
        <div
          key={id}
          style={{
            position: 'relative',
            margin: '20px',
            ...defaultStyles,
          }}
        >
          <StoryAnimation.WAAPIWrapper target={id}>
            <SimpleStar color={color} />
          </StoryAnimation.WAAPIWrapper>
        </div>
      ))}
    </StoryAnimation.Provider>
  );
};

export const AMPStory = () => {
  return (
    <AMPStoryWrapper>
      {[1, 2].map((pageId) => (
        <amp-story-page key={pageId} id={`page-${pageId}`}>
          <StoryAnimation.Provider animations={animations}>
            <StoryAnimation.AMPKeyframes />
            <StoryAnimation.AMPAnimations />
            <amp-story-grid-layer template="vertical">
              {elements.map(({ id, color }) => (
                <div key={id} style={{ marginBottom: '20px' }}>
                  <StoryAnimation.AMPWrapper target={id} style={defaultStyles}>
                    <SimpleStar color={color} />
                  </StoryAnimation.AMPWrapper>
                </div>
              ))}
            </amp-story-grid-layer>
          </StoryAnimation.Provider>
        </amp-story-page>
      ))}
    </AMPStoryWrapper>
  );
};
