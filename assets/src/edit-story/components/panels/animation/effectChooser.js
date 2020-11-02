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
import React, { useEffect } from 'react';
// import propTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import loadStylesheet from '../../../utils/loadStylesheet';
import { GOOGLE_MENU_FONT_URL } from '../../../app/font';
import {
  StoryAnimation,
  useStoryAnimationContext,
} from '../../../../animation/components';
import {
  animations,
  elements,
  GRID_ITEM_HEIGHT,
  PANEL_WIDTH,
} from './effectChooserElements';

const Container = styled.div`
  background: black;
  width: ${PANEL_WIDTH}px;
`;

const GridItem = styled.button`
  border: none;
  background: #333;
  border-radius: 4px;
  height: ${GRID_ITEM_HEIGHT}px;
  position: relative;
`;

const Grid = styled.div`
  display: grid;
  justify-content: center;
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

const ContentWrapper = styled.span`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  font-family: 'Teko', sans-serif;
  font-size: 20px;
  color: white;
  text-transform: uppercase;
`;

function EffectChooser() {
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
          <StoryAnimation.WAAPIWrapper target={'drop'}>
            <ContentWrapper>{__('Drop', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItemFullRow>
        <GridItemFullRow>
          <StoryAnimation.WAAPIWrapper target={'fade-in'}>
            <ContentWrapper>{__('Fade in', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItemFullRow>
        <GridItem>
          <StoryAnimation.WAAPIWrapper target={'fly-in-bottom'}>
            <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItem>
        <GridItem>
          <StoryAnimation.WAAPIWrapper target={'fly-in-top'}>
            <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItem>
        <GridItem>
          <StoryAnimation.WAAPIWrapper target={'fly-in-left'}>
            <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItem>
        <GridItem>
          <StoryAnimation.WAAPIWrapper target={'fly-in-right'}>
            <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItem>
        <GridItemFullRow>
          <StoryAnimation.WAAPIWrapper target={'pulse'}>
            <ContentWrapper>{__('Pulse', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItemFullRow>
        <GridItemHalfRow>
          <StoryAnimation.WAAPIWrapper target={'rotate-left'}>
            <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItemHalfRow>
        <GridItemHalfRow>
          <StoryAnimation.WAAPIWrapper target={'rotate-right'}>
            <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
          </StoryAnimation.WAAPIWrapper>
        </GridItemHalfRow>
      </Grid>
    </Container>
  );
}

export default function WrappedEffectChooser(props) {
  return (
    <StoryAnimation.Provider animations={animations} elements={elements}>
      <StoryAnimation.AMPAnimations />
      <EffectChooser {...props} />
    </StoryAnimation.Provider>
  );
}

EffectChooser.propTypes = {
  // onAnimationSelected: propTypes.func.isRequired,
};
