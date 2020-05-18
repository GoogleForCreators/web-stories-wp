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
import { useState } from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import StoryAnimation, { useStoryAnimationContext } from '../index.js';

export default {
  title: 'Dashboard/Components/StoryAnimation',
  component: StoryAnimation,
};

const PlayButton = () => {
  const {
    actions: { playWAAPIAnimations },
  } = useStoryAnimationContext();

  const label = 'play';
  return <button onClick={playWAAPIAnimations}>{label}</button>;
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
  { targets: ['some-id'], type: 'bounce', duration: 1000 },
  { targets: ['some-id'], type: 'bounce', delay: 1000 },
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
