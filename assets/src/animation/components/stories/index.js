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
import PropTypes from 'prop-types';
import { useState } from 'react';
/**
 * Internal dependencies
 */
import { StoryAnimation } from '..';
import { ANIMATION_TYPES } from '../../constants';
import { PlayButton } from '../../storybookUtils';

export default {
  title: 'Dashboard/Components/StoryAnimation',
  component: StoryAnimation,
};

function ColorSquare({ color }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: color,
      }}
    />
  );
}
ColorSquare.propTypes = {
  color: PropTypes.string,
};

function SquareWrapper({ children }) {
  return (
    <div
      style={{
        position: 'relative',
        marginTop: 20,
        height: 50,
        width: 50,
      }}
    >
      {children}
    </div>
  );
}
SquareWrapper.propTypes = {
  children: PropTypes.node,
};

const animations = [
  { targets: ['some-id'], type: ANIMATION_TYPES.FADE },
  { targets: ['some-id'], type: ANIMATION_TYPES.FLIP },
  { targets: ['some-id'], type: ANIMATION_TYPES.SPIN },
  { targets: ['some-id'], type: ANIMATION_TYPES.FLOAT_ON, duration: 1000 },
];

export function _default() {
  const [state, setState] = useState(0);
  return (
    <StoryAnimation.Provider
      animations={animations}
      onWAAPIFinish={() => {
        setState((v) => v + 1);
      }}
    >
      <PlayButton />
      <SquareWrapper>
        <StoryAnimation.WAAPIWrapper target="some-id">
          <ColorSquare color={state % 2 ? 'tomato' : 'green'} />
        </StoryAnimation.WAAPIWrapper>
      </SquareWrapper>
    </StoryAnimation.Provider>
  );
}

export function AMPStory() {
  const pages = [
    {
      id: 'first-page',
      animations: [
        {
          id: 'ir',
          targets: ['el1'],
          type: ANIMATION_TYPES.BOUNCE,
          duration: 1000,
        },
      ],
    },
    {
      id: 'second-page',
      animations: [
        {
          id: 'a5',
          targets: ['el2'],
          type: ANIMATION_TYPES.BOUNCE,
          duration: 2000,
        },
      ],
    },
    {
      id: 'third-page',
      animations: [
        { id: 'a1', targets: ['el3'], type: ANIMATION_TYPES.BOUNCE },
        {
          id: 'a2',
          targets: ['el4'],
          type: ANIMATION_TYPES.BOUNCE,
          delay: 100,
        },
        {
          id: 'a3',
          targets: ['el5'],
          type: ANIMATION_TYPES.BOUNCE,
          delay: 300,
        },
        {
          id: 'a4',
          targets: ['el6'],
          type: ANIMATION_TYPES.BOUNCE,
          delay: 500,
        },
      ],
      elements: [
        { id: 'el3', color: 'red', width: '50px' },
        { id: 'el4', color: 'orange', width: '100px' },
        { id: 'el5', color: 'blue', width: '200px' },
        { id: 'el6', color: 'green', width: '150px' },
      ],
    },
  ];

  return (
    <div style={{ width: '100%', height: '640px' }}>
      <amp-story
        standalone
        title="My Story"
        publisher="The AMP Team"
        publisher-logo-src="https://example.com/logo/1x1.png"
        poster-portrait-src="https://example.com/my-story/poster/3x4.jpg"
      >
        <amp-story-page id={pages[0].id}>
          <StoryAnimation.Provider animations={pages[0].animations}>
            <StoryAnimation.AMPKeyframes />
            <StoryAnimation.AMPAnimations />

            <StoryAnimation.AMPWrapper
              target="el1"
              style={{ width: '300px', height: '300px' }}
            >
              <amp-img
                src="https://i.picsum.photos/id/1069/300/300.jpg"
                width="300"
                height="300"
              />
            </StoryAnimation.AMPWrapper>
          </StoryAnimation.Provider>
        </amp-story-page>
        <amp-story-page id={pages[1].id}>
          <StoryAnimation.Provider animations={pages[1].animations}>
            <StoryAnimation.AMPKeyframes />
            <StoryAnimation.AMPAnimations />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <StoryAnimation.AMPWrapper
                target="el2"
                style={{ width: '300px', height: '300px' }}
              >
                <amp-img
                  src="https://i.picsum.photos/id/96/300/300.jpg"
                  width="300"
                  height="300"
                />
              </StoryAnimation.AMPWrapper>
            </div>
          </StoryAnimation.Provider>
        </amp-story-page>
        <amp-story-page id={pages[2].id}>
          <StoryAnimation.Provider animations={pages[2].animations}>
            <StoryAnimation.AMPKeyframes />
            <StoryAnimation.AMPAnimations />

            <amp-story-grid-layer template="vertical">
              {pages[2].elements.map((element) => (
                <StoryAnimation.AMPWrapper
                  key={element.id}
                  target={element.id}
                  style={{
                    width: element.width,
                    height: '50px',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: element.color,
                    }}
                  />
                </StoryAnimation.AMPWrapper>
              ))}
            </amp-story-grid-layer>
          </StoryAnimation.Provider>
        </amp-story-page>
      </amp-story>
    </div>
  );
}
