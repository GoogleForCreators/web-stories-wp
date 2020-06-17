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
import { PlayButton, AMPStoryWrapper } from '../../../../storybookUtils';
import StoryAnimation from '../../../../components/storyAnimation';
import { ANIMATION_TYPES } from '../../../constants';

export default {
  title: 'Dashboard/Animations/BlinkOn',
};

const animations = [
  { targets: ['e1'], type: ANIMATION_TYPES.BLINK_ON, duration: 3000 },
  { targets: ['e2'], type: ANIMATION_TYPES.BLINK_ON, duration: 3000 },
  { targets: ['e3'], type: ANIMATION_TYPES.BLINK_ON, duration: 3000 },
  { targets: ['e4'], type: ANIMATION_TYPES.BLINK_ON, duration: 3000 },
];

const elements = [
  { id: 'e1', color: 'red' },
  { id: 'e2', color: 'orange' },
  { id: 'e3', color: 'blue' },
  { id: 'e4', color: 'green' },
];

export const _default = () => {
  return (
    <StoryAnimation.Provider animations={animations}>
      <PlayButton />
      <div
        style={{
          display: 'flex',
          width: '220px',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        {elements.map(({ id, color }) => (
          <div
            key={id}
            style={{ position: 'relative', width: '50px', height: '50px' }}
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
      </div>
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

            <amp-story-grid-layer template="horizontal">
              {elements.map(({ id, color }) => (
                <StoryAnimation.AMPWrapper
                  key={id}
                  target={id}
                  style={{ width: '50px', height: '50px' }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: color,
                    }}
                  />
                </StoryAnimation.AMPWrapper>
              ))}
            </amp-story-grid-layer>
          </StoryAnimation.Provider>
        </amp-story-page>
      ))}
    </AMPStoryWrapper>
  );
};
