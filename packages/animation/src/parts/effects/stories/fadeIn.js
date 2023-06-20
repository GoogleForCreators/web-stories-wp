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
import { AnimationType } from '../../../types';
import { AMPStoryWrapper } from '../../../storybookUtils';

export default {
  title: 'Animations/Effects/Fade-In',
};

const animations = [
  { id: '1', targets: ['e1'], type: AnimationType.EffectFade, duration: 1000 },
  {
    id: '2',
    targets: ['e2'],
    type: AnimationType.Fade,
    duration: 2500,
  },
];

const elements = [
  { id: 'e1', color: 'red' },
  { id: 'e2', color: 'orange' },
];

const defaultStyles = {
  position: 'relative',
  width: '50px',
  height: '50px',
};

export const _default = {
  render: function Render() {
    return (
      <AMPStoryWrapper>
        <amp-story-page id="page-0">
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {'Empty first page'}
          </p>
        </amp-story-page>
        <amp-story-page id={`page-1`}>
          <p style={{ textAlign: 'center', color: '#fff' }}>{'AMP Fade In'}</p>

          <amp-story-grid-layer template="horizontal">
            <div
              animate-in="fade-in"
              animate-in-duration="1s"
              style={{
                backgroundColor: 'red',
                ...defaultStyles,
              }}
            />
            <div
              animate-in="fade-in"
              animate-in-duration="2.5s"
              style={{
                backgroundColor: 'orange',
                ...defaultStyles,
              }}
            />
          </amp-story-grid-layer>
        </amp-story-page>
        <amp-story-page id={`page-2`}>
          <StoryAnimation.AnimationProvider animations={animations}>
            <StoryAnimation.AMPAnimations />
            <p style={{ textAlign: 'center', color: '#fff' }}>
              {'Custom Fade In Effect'}
            </p>

            <amp-story-grid-layer template="horizontal">
              {elements.map(({ id, color }) => (
                <div key={id} style={defaultStyles}>
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
            </amp-story-grid-layer>
          </StoryAnimation.AnimationProvider>
        </amp-story-page>
      </AMPStoryWrapper>
    );
  },
};
