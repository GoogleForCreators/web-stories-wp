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
import {
  ANIMATION_EFFECTS,
  DIRECTION,
  ROTATION,
} from '../../../../animation/constants';
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

const GridItem = styled.button`
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

  &:hover {
    ${BaseAnimationCell} {
      display: inline-block;
    }

    ${ContentWrapper} {
      display: none;
    }
  }
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

export default function EffectChooser({ onAnimationSelected }) {
  useEffect(() => {
    loadStylesheet(`${GOOGLE_MENU_FONT_URL}?family=Teko`).catch(function () {});
  });

  return (
    <Container>
      <Grid>
        <GridItemFullRow
          onClick={() =>
            onAnimationSelected({ animation: ANIMATION_EFFECTS.DROP.value })
          }
        >
          <ContentWrapper>{__('Drop', 'web-stories')}</ContentWrapper>
          <DropAnimation>{__('Drop', 'web-stories')}</DropAnimation>
        </GridItemFullRow>
        <GridItemFullRow
          onClick={() =>
            onAnimationSelected({ animation: ANIMATION_EFFECTS.FADE_IN.value })
          }
        >
          <ContentWrapper>{__('Fade in', 'web-stories')}</ContentWrapper>
          <FadeInAnimation>{__('Fade in', 'web-stories')}</FadeInAnimation>
        </GridItemFullRow>
        <GridItem
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              direction: DIRECTION.LEFT_TO_RIGHT,
            })
          }
        >
          <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          <FlyInLeftAnimation>{__('Fly in', 'web-stories')}</FlyInLeftAnimation>
        </GridItem>
        <GridItem
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              direction: DIRECTION.TOP_TO_BOTTOM,
            })
          }
        >
          <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          <FlyInTopAnimation>{__('Fly in', 'web-stories')}</FlyInTopAnimation>
        </GridItem>
        <GridItem
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              direction: DIRECTION.BOTTOM_TO_TOP,
            })
          }
        >
          <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          <FlyInBottomAnimation>
            {__('Fly in', 'web-stories')}
          </FlyInBottomAnimation>
        </GridItem>
        <GridItem
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              direction: DIRECTION.RIGHT_TO_LEFT,
            })
          }
        >
          <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
          <FlyInRightAnimation>
            {__('Fly in', 'web-stories')}
          </FlyInRightAnimation>
        </GridItem>
        <GridItemFullRow
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
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              rotation: ROTATION.COUNTER_CLOCKWISE,
            })
          }
        >
          <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
          <RotateInLeftAnimation>
            {__('Rotate', 'web-stories')}
          </RotateInLeftAnimation>
        </GridItemHalfRow>
        <GridItemHalfRow
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.FLY_IN.value,
              rotation: ROTATION.CLOCKWISE,
            })
          }
        >
          <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
          <RotateInRightAnimation>
            {__('Rotate', 'web-stories')}
          </RotateInRightAnimation>
        </GridItemHalfRow>
        <GridItemFullRow
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
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.WHOOSH_IN.value,
              direction: DIRECTION.LEFT_TO_RIGHT,
            })
          }
        >
          <ContentWrapper>{__('Woosh In', 'web-stories')}</ContentWrapper>
          <WhooshInLeftAnimation>
            {__('Woosh In', 'web-stories')}
          </WhooshInLeftAnimation>
        </GridItemHalfRow>
        <GridItemHalfRow
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.WHOOSH_IN.value,
              direction: DIRECTION.RIGHT_TO_LEFT,
            })
          }
        >
          <WhooshInRightAnimation>
            {__('Woosh In', 'web-stories')}
          </WhooshInRightAnimation>
          <ContentWrapper>{__('Woosh In', 'web-stories')}</ContentWrapper>
        </GridItemHalfRow>
        <GridItem
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PAN.value,
              direction: DIRECTION.LEFT_TO_RIGHT,
            })
          }
        >
          <ContentWrapper>{__('Pan', 'web-stories')}</ContentWrapper>
          <PanLeftAnimation>{__('Pan', 'web-stories')}</PanLeftAnimation>
        </GridItem>
        <GridItem
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PAN.value,
              direction: DIRECTION.TOP_TO_BOTTOM,
            })
          }
        >
          <ContentWrapper>{__('Pan', 'web-stories')}</ContentWrapper>
          <PanTopAnimation>{__('Pan', 'web-stories')}</PanTopAnimation>
        </GridItem>
        <GridItem
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PAN.value,
              direction: DIRECTION.BOTTOM_TO_TOP,
            })
          }
        >
          <ContentWrapper>{__('Pan', 'web-stories')}</ContentWrapper>{' '}
          <PanBottomAnimation>{__('Pan', 'web-stories')}</PanBottomAnimation>
        </GridItem>
        <GridItem
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.PAN.value,
              direction: DIRECTION.RIGHT_TO_LEFT,
            })
          }
        >
          <ContentWrapper>{__('Pan', 'web-stories')}</ContentWrapper>
          <PanRightAnimation>{__('Pan', 'web-stories')}</PanRightAnimation>
        </GridItem>
        <GridItemHalfRow
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.ZOOM.value,
              defaultValue: 0,
            })
          }
        >
          <ContentWrapper>{__('Zoom In', 'web-stories')}</ContentWrapper>
          <ZoomInAnimation>{__('Zoom In', 'web-stories')}</ZoomInAnimation>
        </GridItemHalfRow>
        <GridItemHalfRow
          onClick={() =>
            onAnimationSelected({
              animation: ANIMATION_EFFECTS.ZOOM.value,
              defaultValue: 1,
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
