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
import { AnimationType, ScaleDirection } from '../../../types';
import { AMPStoryWrapper } from '../../../storybookUtils';

export default {
  title: 'Animations/Effects/Zoom',
};

const animations = [
  {
    id: '1',
    targets: ['e1'],
    type: AnimationType.EffectZoom,
    scaleDirection: ScaleDirection.ScaleIn,
    duration: 4000,
  },
  {
    id: '2',
    targets: ['e2'],
    type: AnimationType.EffectZoom,
    scaleDirection: ScaleDirection.ScaleOut,
    duration: 4000,
  },
];

const elements = [
  {
    id: 'e1',
  },
  {
    id: 'e2',
  },
];

const defaultStyles = {
  position: 'absolute',
  left: `0%`,
  top: `0%`,
  width: '720px',
  height: '320px',
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
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {'AMP Zoom In/Out'}
          </p>

          <amp-story-grid-layer template="vertical">
            <div style={defaultStyles}>
              <amp-img
                animate-in="zoom-in"
                scale-start="0.25"
                scale-end="1"
                animate-in-duration="4s"
                layout="fixed"
                src="https://picsum.photos/720/320?image=1026"
                width="720"
                height="320"
              />
            </div>

            <div
              style={{
                ...defaultStyles,
                top: '50%',
              }}
            >
              <amp-img
                animate-in="zoom-out"
                scale-start="1"
                scale-end="0.25"
                animate-in-duration="4s"
                src="https://picsum.photos/720/320?image=1026"
                width="720"
                height="320"
              />
            </div>
          </amp-story-grid-layer>
        </amp-story-page>
        <amp-story-page id={`page-2`}>
          <StoryAnimation.AnimationProvider animations={animations}>
            <StoryAnimation.AMPAnimations />
            <p style={{ textAlign: 'center', color: '#fff' }}>
              {'Custom Zoom In/Out Effect'}
            </p>

            <amp-story-grid-layer template="vertical">
              {elements.map(({ id }, index) => (
                <div
                  key={id}
                  style={{
                    ...defaultStyles,
                    top: `${index * 50}%`,
                  }}
                >
                  <StoryAnimation.AMPWrapper target={id}>
                    <amp-img
                      src="https://picsum.photos/720/320?image=1026"
                      width="720"
                      height="320"
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
