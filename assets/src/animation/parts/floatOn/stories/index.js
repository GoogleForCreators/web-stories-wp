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
import { ANIMATION_TYPES, DIRECTION } from '../../../constants';
import { AMPStoryWrapper, PlayButton } from '../../../storybookUtils';

export default {
  title: 'Animations/Parts/FloatOn',
};

const duration = 600;

const animations = [
  {
    targets: ['e1'],
    type: ANIMATION_TYPES.FLOAT_ON,
    duration,
    floatOnDir: DIRECTION.TOP_TO_BOTTOM,
  },
  {
    targets: ['e2'],
    type: ANIMATION_TYPES.FLOAT_ON,
    duration,
    delay: duration,
    floatOnDir: DIRECTION.BOTTOM_TO_TOP,
  },
  {
    targets: ['e3'],
    type: ANIMATION_TYPES.FLOAT_ON,
    duration,
    delay: duration * 2,
    floatOnDir: DIRECTION.LEFT_TO_RIGHT,
  },
  {
    targets: ['e4'],
    type: ANIMATION_TYPES.FLOAT_ON,
    duration,
    delay: duration * 3,
    floatOnDir: DIRECTION.RIGHT_TO_LEFT,
  },
];

const elements = [
  { id: 'e1', text: 'TOP-TO-BOTTOM' },
  { id: 'e2', text: 'BOTTOM-TO-TOP' },
  { id: 'e3', text: 'LEFT-TO-RIGHT' },
  { id: 'e4', text: 'RIGHT-TO-LEFT' },
];

const defaultStyles = {
  position: 'relative',
  width: '200px',
  height: '100px',
};

export const _default = () => {
  return (
    <StoryAnimation.Provider animations={animations}>
      <PlayButton />
      {elements.map(({ id, text }) => (
        <div
          key={id}
          style={{
            position: 'relative',
            ...defaultStyles,
            marginBottom: '20px',
          }}
        >
          <StoryAnimation.WAAPIWrapper target={id}>
            {text}
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

            <amp-story-grid-layer template="vertical">
              {elements.map(({ id, text }) => (
                <div key={id} style={defaultStyles}>
                  <StoryAnimation.AMPWrapper target={id}>
                    {text}
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
