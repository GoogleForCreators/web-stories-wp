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
  title: 'Animations/Effects/Pan',
};

const SAMPLE_SRC_1 = 'https://picsum.photos/1120/746?image=1025';

const animations = [
  {
    id: '2',
    targets: ['e1'],
    type: AnimationType.EffectPan,
    panDir: AnimationDirection.TopToBottom,
    duration: 5000,
  },
  {
    id: '3',
    targets: ['e1'],
    type: AnimationType.EffectPan,
    panDir: AnimationDirection.BottomToTop,
    duration: 5000,
  },
  {
    id: '4',
    targets: ['e1'],
    type: AnimationType.EffectPan,
    panDir: AnimationDirection.LeftToRight,
    duration: 5000,
  },
  {
    id: '5',
    targets: ['e1'],
    type: AnimationType.EffectPan,
    panDir: AnimationDirection.RightToLeft,
    duration: 5000,
  },
];

const elements = [{ id: 'e1', x: 50, y: 100, width: 296, height: 198 }];

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
          <p style={{ textAlign: 'center', color: '#fff' }}>{'AMP PAN'}</p>

          <amp-story-grid-layer
            template="vertical"
            aspect-ratio={AMP_STORY_ASPECT_RATIO}
          >
            <amp-img
              animate-in="pan-left"
              animate-in-duration="5s"
              src={SAMPLE_SRC_1}
              width="296px"
              height="198px"
            />
          </amp-story-grid-layer>
        </amp-story-page>
        {animations.map((animation) => (
          <amp-story-page key={animation.id} id={`page-${animation.id}`}>
            <StoryAnimation.AnimationProvider
              animations={[animation]}
              elements={elements}
            >
              <StoryAnimation.AMPAnimations />
              <p style={{ textAlign: 'center', color: '#fff' }}>
                {'Custom Pan Effect'}
              </p>

              <amp-story-grid-layer
                template="vertical"
                aspect-ratio={AMP_STORY_ASPECT_RATIO}
              >
                <div className="page-fullbleed-area">
                  <div className="page-safe-area">
                    {elementBoxes.map(({ id, x, y, width, height }) => (
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
                          <img alt="" src={SAMPLE_SRC_1} width="100%" />
                        </StoryAnimation.AMPWrapper>
                      </div>
                    ))}
                  </div>
                </div>
              </amp-story-grid-layer>
            </StoryAnimation.AnimationProvider>
          </amp-story-page>
        ))}
      </AMPStoryWrapper>
    );
  },
};
