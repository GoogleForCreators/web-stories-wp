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
import { getBox } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import { StoryAnimation } from '../../../components';
import { ANIMATION_TYPES, DIRECTION } from '../../../constants';
import {
  AMPStoryWrapper,
  AMP_STORY_ASPECT_RATIO,
} from '../../../storybookUtils';

export default {
  title: 'Animations/Effects/Fly-In',
};

const animations = [
  {
    id: '1',
    targets: ['e1'],
    type: ANIMATION_TYPES.FLY_IN,
  },
  {
    id: '2',
    targets: ['e2'],
    type: ANIMATION_TYPES.FLY_IN,
    delay: 500,
    flyInDir: DIRECTION.LEFT_TO_RIGHT,
  },
  {
    id: '3',
    targets: ['e3'],
    type: ANIMATION_TYPES.FLY_IN,
    delay: 1000,
    flyInDir: DIRECTION.RIGHT_TO_LEFT,
  },
  {
    id: '4',
    targets: ['e4'],
    type: ANIMATION_TYPES.FLY_IN,
    delay: 1500,
    flyInDir: DIRECTION.BOTTOM_TO_TOP,
  },
];

const elements = [
  { id: 'e1', color: 'red', x: 50, y: 100, width: 50, height: 50 },
  { id: 'e2', color: 'orange', x: 50, y: 175, width: 50, height: 50 },
  { id: 'e3', color: 'blue', x: 50, y: 250, width: 50, height: 50 },
  { id: 'e4', color: 'yellow', x: 50, y: 325, width: 50, height: 50 },
];

const defaultStyles = {
  position: 'relative',
  width: '50px',
  height: '50px',
};

export const _default = () => {
  const elementBoxes = elements.map((element) => ({
    ...element,
    ...getBox(element, 100, 100),
  }));

  return (
    <AMPStoryWrapper>
      <amp-story-page id={`page-1`}>
        <p style={{ textAlign: 'center', color: '#fff' }}>{'AMP Fly In'}</p>

        <amp-story-grid-layer
          template="vertical"
          aspect-ratio={AMP_STORY_ASPECT_RATIO}
        >
          <div
            animate-in="fly-in-top"
            style={{
              backgroundColor: 'red',
              ...defaultStyles,
            }}
          />
          <div
            animate-in="fly-in-left"
            animate-in-delay="0.5s"
            style={{
              backgroundColor: 'orange',
              ...defaultStyles,
            }}
          />
          <div
            animate-in="fly-in-right"
            animate-in-delay="1.0s"
            style={{
              backgroundColor: 'blue',
              ...defaultStyles,
            }}
          />
          <div
            animate-in="fly-in-bottom"
            animate-in-delay="1.5s"
            style={{
              backgroundColor: 'yellow',
              ...defaultStyles,
            }}
          />
        </amp-story-grid-layer>
      </amp-story-page>
      <amp-story-page id={`page-2`}>
        <StoryAnimation.Provider animations={animations} elements={elements}>
          <StoryAnimation.AMPAnimations />
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {'Custom Fly In Effect'}
          </p>

          <amp-story-grid-layer
            template="vertical"
            aspect-ratio={AMP_STORY_ASPECT_RATIO}
          >
            <div className="page-fullbleed-area">
              <div className="page-safe-area">
                {elementBoxes.map(({ id, color, x, y, width, height }) => (
                  <div
                    key={id}
                    style={{
                      position: 'absolute',
                      top: `${y}%`,
                      left: `${x}%`,
                      width: `${width}%`,
                      height: `${height}%`,
                    }}
                  >
                    <StoryAnimation.AMPWrapper target={id}>
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: color,
                        }}
                      />
                    </StoryAnimation.AMPWrapper>
                  </div>
                ))}
              </div>
            </div>
          </amp-story-grid-layer>
        </StoryAnimation.Provider>
      </amp-story-page>
    </AMPStoryWrapper>
  );
};
