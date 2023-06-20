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
import * as StoryAnimation from '../../../components';
import { AnimationType, AnimationDirection } from '../../../types';
import {
  AMPStoryWrapper,
  AMP_STORY_ASPECT_RATIO,
} from '../../../storybookUtils';

export default {
  title: 'Animations/Effects/Rotate-In',
};

const animations = [
  {
    id: '1',
    targets: ['e1'],
    type: AnimationType.EffectRotateIn,
    delay: 500,
  },
  {
    id: '2',
    targets: ['e2'],
    type: AnimationType.EffectRotateIn,
    delay: 1000,
    rotateInDir: AnimationDirection.RightToLeft,
  },
];

const elements = [
  { id: 'e1', color: 'red', x: 315, y: 100, width: 50, height: 50 },
  { id: 'e2', color: 'orange', x: 50, y: 175, width: 50, height: 50 },
];

const defaultStyles = {
  position: 'relative',
  width: '50px',
  height: '50px',
};

export const _default = {
  render: function Render() {
    const elementBoxes = elements.map((element) => ({
      ...element,
      ...getBox(element, 100, 100),
    }));

    return (
      <AMPStoryWrapper>
        <amp-story-page id="page-0">
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {'Empty first page'}
          </p>
        </amp-story-page>
        <amp-story-page id={`page-1`}>
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {'AMP Rotate-In'}
          </p>

          <amp-story-grid-layer
            template="vertical"
            aspect-ratio={AMP_STORY_ASPECT_RATIO}
          >
            <div
              animate-in="rotate-in-left"
              animate-in-delay="0.5s"
              style={{
                backgroundColor: 'red',
                ...defaultStyles,
                left: '250px',
              }}
            />
            <div
              animate-in="rotate-in-right"
              animate-in-delay="1.0s"
              style={{
                backgroundColor: 'orange',
                ...defaultStyles,
              }}
            />
          </amp-story-grid-layer>
        </amp-story-page>
        <amp-story-page id={`page-2`}>
          <StoryAnimation.AnimationProvider
            animations={animations}
            elements={elements}
          >
            <StoryAnimation.AMPAnimations />
            <p style={{ textAlign: 'center', color: '#fff' }}>
              {'Custom Rotate-In Effect'}
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
          </StoryAnimation.AnimationProvider>
        </amp-story-page>
      </AMPStoryWrapper>
    );
  },
};
