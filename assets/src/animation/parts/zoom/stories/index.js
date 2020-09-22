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
import { ANIMATION_TYPES } from '../../../constants';
import { AMPStoryWrapper, PlayButton } from '../../../storybookUtils';

export default {
  title: 'Animations/Parts/Zoom',
};

const animations = [
  {
    targets: ['e1'],
    type: ANIMATION_TYPES.ZOOM,
    duration: 10000,
    zoomFrom: 1,
    zoomTo: 2,
  },
  {
    targets: ['e2'],
    type: ANIMATION_TYPES.ZOOM,
    duration: 10000,
    zoomFrom: 2,
    zoomTo: 1,
  },
];

const elements = [
  {
    id: 'e1',
    src:
      'https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y',
    transform: 'translate(0px, 100px) scale(2)',
  },
  {
    id: 'e2',
    src:
      'https://i.picsum.photos/id/1062/5092/3395.jpg?hmac=o9m7qeU51uOLfXvepXcTrk2ZPiSBJEkiiOp-Qvxja-k',
  },
];

const defaultStyles = {
  position: 'relative',
  width: '300px',
  height: '200px',
  overflow: 'hidden',
};

export const _default = () => {
  return (
    <StoryAnimation.Provider animations={animations}>
      <PlayButton />
      {elements.map(({ id, src, ...style }) => (
        <div
          key={id}
          style={{
            marginBottom: '20px',
            ...defaultStyles,
          }}
        >
          <StoryAnimation.WAAPIWrapper target={id}>
            <img
              alt=""
              style={{
                width: '100%',
                height: '100%',
                ...style,
              }}
              src={src}
            />
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
              {elements.map(({ id, src, ...style }) => (
                <div key={id} style={defaultStyles}>
                  <StoryAnimation.AMPWrapper target={id}>
                    <img
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        ...style,
                      }}
                      src={src}
                    />
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
