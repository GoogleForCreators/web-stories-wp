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
import { getBox } from '../../../../edit-story/units/dimensions';
import { StoryAnimation } from '../../../components';
import { ANIMATION_EFFECTS, DIRECTION } from '../../../constants';
import {
  AMPStoryWrapper,
  AMP_STORY_ASPECT_RATIO,
} from '../../../storybookUtils';

const EFFECT_NAME = 'Pan';

export default {
  title: `Animations/Effects/${EFFECT_NAME}`,
};

const SAMPLE_SRC_1 = 'https://picsum.photos/1120/746?image=1025';

const animations = [
  {
    id: '2',
    targets: ['e1'],
    type: ANIMATION_EFFECTS.PAN,
    panDir: DIRECTION.TOP_TO_BOTTOM,
    duration: 5000,
  },
  {
    id: '3',
    targets: ['e1'],
    type: ANIMATION_EFFECTS.PAN,
    panDir: DIRECTION.BOTTOM_TO_TOP,
    duration: 5000,
  },
  {
    id: '4',
    targets: ['e1'],
    type: ANIMATION_EFFECTS.PAN,
    panDir: DIRECTION.LEFT_TO_RIGHT,
    duration: 5000,
  },
  {
    id: '5',
    targets: ['e1'],
    type: ANIMATION_EFFECTS.PAN,
    panDir: DIRECTION.RIGHT_TO_LEFT,
    duration: 5000,
  },
];

const elements = [{ id: 'e1', x: 50, y: 100, width: 296, height: 198 }];

export const _default = () => {
  const elementBoxes = elements.map((element) => ({
    ...element,
    ...getBox(element, 100, 100),
  }));

  return (
    <AMPStoryWrapper>
      <amp-story-page id={`page-1`}>
        <p style={{ textAlign: 'center', color: '#fff' }}>
          {`AMP ${EFFECT_NAME}`}
        </p>

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
          <StoryAnimation.Provider animations={[animation]} elements={elements}>
            <StoryAnimation.AMPAnimations />
            <p style={{ textAlign: 'center', color: '#fff' }}>
              {`Custom ${EFFECT_NAME} Effect`}
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
          </StoryAnimation.Provider>
        </amp-story-page>
      ))}
    </AMPStoryWrapper>
  );
};
