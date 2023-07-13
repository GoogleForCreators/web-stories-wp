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
import * as StoryAnimation from '../../../components';
import { AnimationType, AnimationDirection } from '../../../types';
import { AMPStoryWrapper, PlayButton } from '../../../storybookUtils';

export default {
  title: 'Animations/Parts/FloatOn',
};

const duration = 600;

const animations = [
  {
    id: '1',
    targets: ['e1'],
    type: AnimationType.FloatOn,
    duration,
    floatOnDir: AnimationDirection.TopToBottom,
  },
  {
    id: '2',
    targets: ['e2'],
    type: AnimationType.FloatOn,
    duration,
    delay: duration,
    floatOnDir: AnimationDirection.BottomToTop,
  },
  {
    id: '3',
    targets: ['e3'],
    type: AnimationType.FloatOn,
    duration,
    delay: duration * 2,
    floatOnDir: AnimationDirection.LeftToRight,
  },
  {
    id: '4',
    targets: ['e4'],
    type: AnimationType.FloatOn,
    duration,
    delay: duration * 3,
    floatOnDir: AnimationDirection.RightToLeft,
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

export const _default = {
  render: function Render() {
    return (
      <StoryAnimation.AnimationProvider animations={animations}>
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
      </StoryAnimation.AnimationProvider>
    );
  },
};

export const _AMPStory = {
  render: function Render() {
    return (
      <AMPStoryWrapper>
        <amp-story-page id="page-0">
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {'Empty first page'}
          </p>
        </amp-story-page>
        {[1, 2].map((pageId) => (
          <amp-story-page key={pageId} id={`page-${pageId}`}>
            <StoryAnimation.AnimationProvider animations={animations}>
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
            </StoryAnimation.AnimationProvider>
          </amp-story-page>
        ))}
      </AMPStoryWrapper>
    );
  },
};
