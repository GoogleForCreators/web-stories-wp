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
import { ANIMATION_EFFECTS } from '../../../constants';
import { AMPStoryWrapper } from '../../../storybookUtils';

export default {
  title: 'Animations/Effects/Twirl-In',
};

const animations = [
  {
    targets: ['e1'],
    type: ANIMATION_EFFECTS.TWIRL_IN,
  },
];

const element = {
  id: 'e1',
  color: 'red',
  width: 50,
  height: 50,
};

export const _default = () => {
  return (
    <AMPStoryWrapper>
      <amp-story-page id={`page-1`}>
        <p style={{ textAlign: 'center', color: '#fff' }}>{'AMP Twirl In'}</p>

        <amp-story-grid-layer template="vertical">
          <div
            animate-in="twirl-in"
            style={{
              position: 'absolute',
              top: `calc(50% - ${element.height / 2}px)`,
              left: `calc(50% - ${element.width / 2}px)`,
              width: element.width,
              height: element.height,
              backgroundColor: element.color,
            }}
          />
        </amp-story-grid-layer>
      </amp-story-page>
      <amp-story-page id={`page-2`}>
        <StoryAnimation.Provider animations={animations}>
          <StoryAnimation.AMPAnimations />
          <p style={{ textAlign: 'center', color: '#fff' }}>
            {'Custom Twirl In Effect'}
          </p>

          <amp-story-grid-layer template="vertical">
            <div className="page-fullbleed-area">
              <div className="page-safe-area">
                <div
                  key={element.id}
                  style={{
                    position: 'absolute',
                    top: `calc(50% - ${element.height / 2}px)`,
                    left: `calc(50% - ${element.width / 2}px)`,
                    width: element.width,
                    height: element.height,
                  }}
                >
                  <StoryAnimation.AMPWrapper target={element.id}>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: element.color,
                      }}
                    />
                  </StoryAnimation.AMPWrapper>
                </div>
              </div>
            </div>
          </amp-story-grid-layer>
        </StoryAnimation.Provider>
      </amp-story-page>
    </AMPStoryWrapper>
  );
};
