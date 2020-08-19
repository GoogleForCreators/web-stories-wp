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
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../../edit-story/constants';
import { getBox } from '../../../../edit-story/units/dimensions';
import { StoryAnimation } from '../../../components';
import { ANIMATION_EFFECTS } from '../../../constants';
import {
  AMPStoryWrapper,
  AMP_STORY_ASPECT_RATIO,
} from '../../../storybookUtils';

export default {
  title: 'Animations/Effects/Drop',
};

const elements = [
  {
    id: 'e1',
    color: 'red',
    x: (PAGE_WIDTH - 50) / 2,
    y: PAGE_HEIGHT - 50,
    width: 50,
    height: 50,
  },
];

const animations = [{ targets: ['e1'], type: ANIMATION_EFFECTS.DROP }];

export const _default = () => {
  const elementBoxes = elements.map((element) => ({
    ...element,
    ...getBox(element, 100, 100),
  }));

  return (
    <AMPStoryWrapper>
      <amp-story-page id="page-1">
        <p style={{ textAlign: 'center', color: '#fff' }}>
          {'AMP Drop Effect'}
        </p>
        <amp-story-grid-layer
          template="vertical"
          aspect-ration={AMP_STORY_ASPECT_RATIO}
        >
          <div
            animate-in="drop"
            style={{
              position: 'absolute',
              height: '50px',
              width: '50px',
              top: 'calc(100% - 50px)',
              left: 'calc(50% - 25px)',
              backgroundColor: 'red',
            }}
          />
        </amp-story-grid-layer>
      </amp-story-page>
      <amp-story-page id="page-2">
        <StoryAnimation.Provider animations={animations} elements={elements}>
          <StoryAnimation.AMPAnimations />
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {'Custom Drop Effect'}
          </p>

          <amp-story-grid-layer
            template="vertical"
            aspect-ration={AMP_STORY_ASPECT_RATIO}
          >
            <div className="page-fullbleed-area">
              <div className="page-safe-area">
                {elementBoxes.map((elem) => (
                  <div
                    key={elem.id}
                    style={{
                      position: 'absolute',
                      top: `${elem.y}%`,
                      left: `${elem.x}%`,
                      width: `${elem.width}%`,
                      height: `${elem.height}%`,
                    }}
                  >
                    <StoryAnimation.AMPWrapper target={elem.id}>
                      <div
                        style={{
                          height: '100%',
                          width: '100%',
                          backgroundColor: elem.color,
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
