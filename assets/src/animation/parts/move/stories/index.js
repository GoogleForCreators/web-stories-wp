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
import { StoryAnimation } from '../../../components';
import { PlayButton, AMPStoryWrapper } from '../../../storybookUtils';
import { ANIMATION_TYPES } from '../../../constants';

export default {
  title: 'Animations/Parts/Move',
};

const duration = 600;

const animations = [
  {
    targets: ['e1'],
    type: ANIMATION_TYPES.MOVE,
    duration,
    offsetX: -200,
    offsetY: 500,
  },
  {
    targets: ['e2'],
    type: ANIMATION_TYPES.MOVE,
    duration,
    offsetX: 200,
    offsetY: 500,
  },
];

const elements = [
  { id: 'e1', color: 'red', top: '20px', left: '250px' },
  { id: 'e2', color: 'green', top: '20px', left: '50px' },
];

const defaultStyles = {
  position: 'absolute',
  width: '50px',
  height: '50px',
};

export const _default = () => {
  return (
    <StoryAnimation.Provider animations={animations}>
      <PlayButton />
      {elements.map(({ id, color, ...styles }) => (
        <div
          key={id}
          style={{
            ...defaultStyles,
            ...styles,
          }}
        >
          <StoryAnimation.WAAPIWrapper target={id}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: color,
              }}
            />
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
            <StoryAnimation.AMPAnimations />
            {elements.map(({ id, color, ...styles }) => (
              <div
                key={id}
                style={{
                  ...defaultStyles,
                  ...styles,
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
          </StoryAnimation.Provider>
        </amp-story-page>
      ))}
    </AMPStoryWrapper>
  );
};
