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
import React, { forwardRef, useEffect } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

const GRID_ITEM_HEIGHT = 64;
const PANEL_WIDTH = 276;

/**
 * Internal dependencies
 */
import loadStylesheet from '../../../utils/loadStylesheet';
import { GOOGLE_MENU_FONT_URL } from '../../../app/font';
import {
  StoryAnimation,
  useStoryAnimationContext,
} from '../../../../animation/components';
import { ANIMATION_EFFECTS, DIRECTION } from '../../../../animation';

const Container = styled.div`
  background: black;
  font-family: 'Teko', sans-serif;
  color: white;
  width: ${PANEL_WIDTH}px;
`;

const GridItem = styled.div`
  background: #333;
  border-radius: 4px;
  height: ${GRID_ITEM_HEIGHT}px;
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  gap: 15px 3px;
  grid-template-columns: repeat(4, 58px);
  padding: 15px;
  position: relative;
`;

const GridItemFullRow = styled(GridItem)`
  grid-column-start: span 4;
`;

const GridItemHalfRow = styled(GridItem)`
  grid-column-start: span 2;
`;

const animations = [
  { targets: ['e1'], type: ANIMATION_EFFECTS.DROP },
  { targets: ['e2'], type: ANIMATION_EFFECTS.FADE_IN },
  {
    targets: ['e3'],
    type: ANIMATION_EFFECTS.FLY_IN,
    flyInDir: DIRECTION.LEFT_TO_RIGHT,
  },
  // { targets: ['e3'], type: ANIMATION_TYPES.BLINK_ON, duration: 3000 },
  // { targets: ['e4'], type: ANIMATION_TYPES.BLINK_ON, duration: 3000 },
];

function EffectChooser({ onAnimationSelected }) {
  const {
    actions: { WAAPIAnimationMethods },
  } = useStoryAnimationContext();

  useEffect(() => {
    loadStylesheet(`${GOOGLE_MENU_FONT_URL}?family=Teko`).catch(function () {});
    WAAPIAnimationMethods.play();
  });

  return (
    <Container>
      <Grid>
        <GridItemFullRow>
          <StoryAnimation.WAAPIWrapper target={'e1'}>
            <span>DROP</span>
          </StoryAnimation.WAAPIWrapper>
        </GridItemFullRow>
        <GridItemFullRow>
          <StoryAnimation.WAAPIWrapper target={'e2'}>
            <span>FADE IN</span>
          </StoryAnimation.WAAPIWrapper>
        </GridItemFullRow>
        <GridItem>
          <StoryAnimation.WAAPIWrapper target={'e3'}>
            <span>FI</span>
          </StoryAnimation.WAAPIWrapper>
        </GridItem>
        <GridItem>Fly In L</GridItem>
        <GridItem>Fly In R</GridItem>
        <GridItem>Fly In B</GridItem>
        <GridItemFullRow>Pulse</GridItemFullRow>
        <GridItemHalfRow>Rotate L</GridItemHalfRow>
        <GridItemHalfRow>Rotate R</GridItemHalfRow>
      </Grid>
    </Container>
  );
}

export default function WrappedEffectChooser(props) {
  return (
    <StoryAnimation.Provider
      animations={animations}
      elements={[
        {
          id: 'e1',
          x: 0,
          y: 0,
          height: GRID_ITEM_HEIGHT,
        },
        {
          id: 'e2',
          x: 0,
          y: 0,
          height: GRID_ITEM_HEIGHT,
        },
        {
          id: 'e3',
          x: 0,
          y: 0,
          height: GRID_ITEM_HEIGHT,
          width: 58,
        },
      ]}
    >
      <StoryAnimation.AMPAnimations />
      <EffectChooser {...props} />
    </StoryAnimation.Provider>
  );
}

EffectChooser.propTypes = {
  onAnimationSelected: propTypes.func.isRequired,
};
