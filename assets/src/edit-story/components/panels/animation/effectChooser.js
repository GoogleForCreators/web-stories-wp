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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import loadStylesheet from '../../../utils/loadStylesheet';
import { GOOGLE_MENU_FONT_URL } from '../../../app/font';
import { ANIMATION_EFFECTS, DIRECTION, ROTATION } from '../../../../animation';
import {
  GRID_ITEM_HEIGHT,
  PANEL_WIDTH,
  DropAnimation,
  FadeInAnimation,
  FlyInLeftAnimation,
  FlyInRightAnimation,
  FlyInTopAnimation,
  FlyInBottomAnimation,
  PulseAnimation,
  RotateInLeftAnimation,
  RotateInRightAnimation,
  TwirlInAnimation,
  WhooshInLeftAnimation,
  WhooshInRightAnimation,
  PanRightAnimation,
  PanBottomAnimation,
  PanTopAnimation,
  PanLeftAnimation,
  ZoomInAnimation,
  ZoomOutAnimation,
  BaseAnimationCell,
} from './effectChooserElements';

const Container = styled.div`
  background: black;
  width: ${PANEL_WIDTH}px;
`;

const ContentWrapper = styled.div`
  display: inline-block;
`;

const GridItem = styled.button.attrs({ role: 'listitem' })`
  border: none;
  background: #333;
  border-radius: 4px;
  height: ${GRID_ITEM_HEIGHT}px;
  position: relative;
  overflow: hidden;
  font-family: 'Teko', sans-serif;
  font-size: 20px;
  color: white;
  text-transform: uppercase;

  &:hover,
  &:focus {
    ${BaseAnimationCell} {
      display: inline-block;
    }

    ${ContentWrapper} {
      display: none;
    }
  }
`;

const Grid = styled.div.attrs({ role: 'list' })`
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

export default function EffectChooser({ onAnimationSelected }) {
  useEffect(() => {
    loadStylesheet(`${GOOGLE_MENU_FONT_URL}?family=Teko`).catch(function () {});
  });

  return (
    <Container>
      <Grid>
        <GridItemFullRow
          aria-label={__('Drop Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({ animation: ANIMATION_EFFECTS.DROP.value })
          }
        >
          <ContentWrapper>{__('Drop', 'web-stories')}</ContentWrapper>
          <DropAnimation>{__('Drop', 'web-stories')}</DropAnimation>
        </GridItemFullRow>
        <GridItemFullRow
          aria-label={__('Fade In Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({ animation: ANIMATION_EFFECTS.FADE_IN.value })
          }
        >
          <ContentWrapper>{__('Fade in', 'web-stories')}</ContentWrapper>
          <FadeInAnimation>{__('Fade in', 'web-stories')}</FadeInAnimation>
        </GridItemFullRow>
        <GridItem
          aria-label={__('Fly In from Left Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              flyInDir: DIRECTION.LEFT_TO_RIGHT,
            })
          }
        >
          <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          <FlyInLeftAnimation>{__('Fly in', 'web-stories')}</FlyInLeftAnimation>
        </GridItem>
        <GridItem
          aria-label={__('Fly In from Top Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              flyInDir: DIRECTION.TOP_TO_BOTTOM,
            })
          }
        >
          <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          <FlyInTopAnimation>{__('Fly in', 'web-stories')}</FlyInTopAnimation>
        </GridItem>
        <GridItem
          aria-label={__('Fly In from Bottom Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              flyInDir: DIRECTION.BOTTOM_TO_TOP,
            })
          }
        >
          <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          <FlyInBottomAnimation>
            {__('Fly in', 'web-stories')}
          </FlyInBottomAnimation>
        </GridItem>
        <GridItem
          aria-label={__('Fly In from Right Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              flyInDir: DIRECTION.RIGHT_TO_LEFT,
            })
          }
        >
          <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          <FlyInRightAnimation>
            {__('Fly in', 'web-stories')}
          </FlyInRightAnimation>
        </GridItem>
        <GridItemFullRow
          aria-label={__('Pulse Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PULSE.value,
            })
          }
        >
          <ContentWrapper>{__('Pulse', 'web-stories')}</ContentWrapper>
          <PulseAnimation>{__('Pulse', 'web-stories')}</PulseAnimation>
        </GridItemFullRow>
        <GridItemHalfRow
          aria-label={__('Rotate In Counter Clockwise Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.ROTATE_IN.value,
              rotateInDir: ROTATION.COUNTER_CLOCKWISE,
            })
          }
        >
          <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
          <RotateInLeftAnimation>
            {__('Rotate', 'web-stories')}
          </RotateInLeftAnimation>
        </GridItemHalfRow>
        <GridItemHalfRow
          aria-label={__('Rotate In Clockwise Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.ROTATE_IN.value,
              rotateInDir: ROTATION.CLOCKWISE,
            })
          }
        >
          <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
          <RotateInRightAnimation>
            {__('Rotate', 'web-stories')}
          </RotateInRightAnimation>
        </GridItemHalfRow>
        <GridItemFullRow
          aria-label={__('Twirl In Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.TWIRL_IN.value,
            })
          }
        >
          <ContentWrapper>{__('Twirl In', 'web-stories')}</ContentWrapper>
          <TwirlInAnimation>{__('Twirl In', 'web-stories')}</TwirlInAnimation>
        </GridItemFullRow>
        <GridItemHalfRow
          aria-label={__('Whoosh In from Left Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.WHOOSH_IN.value,
              whooshInDir: DIRECTION.LEFT_TO_RIGHT,
            })
          }
        >
          <ContentWrapper>{__('Whoosh In', 'web-stories')}</ContentWrapper>
          <WhooshInLeftAnimation>
            {__('Whoosh In', 'web-stories')}
          </WhooshInLeftAnimation>
        </GridItemHalfRow>
        <GridItemHalfRow
          aria-label={__('Whoosh In from Right Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.WHOOSH_IN.value,
              whooshInDir: DIRECTION.RIGHT_TO_LEFT,
            })
          }
        >
          <WhooshInRightAnimation>
            {__('Whoosh In', 'web-stories')}
          </WhooshInRightAnimation>
          <ContentWrapper>{__('Whoosh In', 'web-stories')}</ContentWrapper>
        </GridItemHalfRow>
        <GridItem
          aria-label={__('Pan from Left Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PAN.value,
              panDir: DIRECTION.LEFT_TO_RIGHT,
            })
          }
        >
          <ContentWrapper>{__('Pan', 'web-stories')}</ContentWrapper>
          <PanLeftAnimation>{__('Pan', 'web-stories')}</PanLeftAnimation>
        </GridItem>
        <GridItem
          aria-label={__('Pan from Top Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PAN.value,
              panDir: DIRECTION.TOP_TO_BOTTOM,
            })
          }
        >
          <ContentWrapper>{__('Pan', 'web-stories')}</ContentWrapper>
          <PanTopAnimation>{__('Pan', 'web-stories')}</PanTopAnimation>
        </GridItem>
        <GridItem
          aria-label={__('Pan from Bottom Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PAN.value,
              panDir: DIRECTION.BOTTOM_TO_TOP,
            })
          }
        >
          <ContentWrapper>{__('Pan', 'web-stories')}</ContentWrapper>{' '}
          <PanBottomAnimation>{__('Pan', 'web-stories')}</PanBottomAnimation>
        </GridItem>
        <GridItem
          aria-label={__('Pan from Right Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PAN.value,
              panDir: DIRECTION.RIGHT_TO_LEFT,
            })
          }
        >
          <ContentWrapper>{__('Pan', 'web-stories')}</ContentWrapper>
          <PanRightAnimation>{__('Pan', 'web-stories')}</PanRightAnimation>
        </GridItem>
        <GridItemHalfRow
          aria-label={__('Zoom In Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.ZOOM.value,
              zoomFrom: 0,
              zoomTo: 1,
            })
          }
        >
          <ContentWrapper>{__('Zoom In', 'web-stories')}</ContentWrapper>
          <ZoomInAnimation>{__('Zoom In', 'web-stories')}</ZoomInAnimation>
        </GridItemHalfRow>
        <GridItemHalfRow
          aria-label={__('Zoom Out Effect', 'web-stories')}
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.ZOOM.value,
              zoomFrom: 2,
              zoomTo: 1,
            })
          }
        >
          <ZoomOutAnimation>{__('Zoom Out', 'web-stories')}</ZoomOutAnimation>
          <ContentWrapper>{__('Zoom Out', 'web-stories')}</ContentWrapper>
        </GridItemHalfRow>
      </Grid>
    </Container>
  );
}

EffectChooser.propTypes = {
  onAnimationSelected: propTypes.func.isRequired,
};
