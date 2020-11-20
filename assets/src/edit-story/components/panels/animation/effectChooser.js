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
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import loadStylesheet from '../../../utils/loadStylesheet';
import { GOOGLE_MENU_FONT_URL } from '../../../app/font';
import {
  ANIMATION_EFFECTS,
  BACKGROUND_ANIMATION_EFFECTS,
  DIRECTION,
} from '../../../../animation';
import useFocusOut from '../../../utils/useFocusOut';
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
  ZoomInAnimation,
  ZoomOutAnimation,
  BaseAnimationCell,
  PanTopAnimation,
  PanRightAnimation,
  PanBottomAnimation,
  PanLeftAnimation,
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
  line-height: 1;
  color: white;
  text-transform: uppercase;

  &:disabled {
    opacity: 0.6;
  }

  &:hover:not([disabled]) {
    cursor: pointer;
  }

  &:hover:not([disabled]),
  &:focus:not([disabled]) {
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

export default function EffectChooser({
  onAnimationSelected,
  onNoEffectSelected,
  onDismiss,
  isBackgroundEffects = false,
  disabledTypeOptionsMap,
}) {
  const ref = useRef();

  useEffect(() => {
    loadStylesheet(`${GOOGLE_MENU_FONT_URL}?family=Teko`).catch(function () {});
  }, []);

  useFocusOut(ref, () => onDismiss?.(), []);

  return (
    <Container ref={ref}>
      <Grid>
        <GridItemFullRow
          onClick={onNoEffectSelected}
          aria-label={__('No Effect', 'web-stories')}
        >
          <span>{__('No Effect', 'web-stories')}</span>
        </GridItemFullRow>
        {isBackgroundEffects ? (
          <>
            <GridItemFullRow
              aria-label={__('Zoom Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                })
              }
            >
              <ContentWrapper>{__('Zoom', 'web-stories')}</ContentWrapper>
              <ZoomOutAnimation>{__('Zoom', 'web-stories')}</ZoomOutAnimation>
            </GridItemFullRow>
            <GridItem
              aria-label={__('Pan Left Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.LEFT_TO_RIGHT,
                })
              }
              disabled={disabledTypeOptionsMap[
                BACKGROUND_ANIMATION_EFFECTS.PAN.value
              ]?.includes(DIRECTION.LEFT_TO_RIGHT)}
            >
              <ContentWrapper>{__('Pan Left', 'web-stories')}</ContentWrapper>
              <PanLeftAnimation>
                {__('Pan Left', 'web-stories')}
              </PanLeftAnimation>
            </GridItem>
            <GridItem
              aria-label={__('Pan Right Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.RIGHT_TO_LEFT,
                })
              }
              disabled={disabledTypeOptionsMap[
                BACKGROUND_ANIMATION_EFFECTS.PAN.value
              ]?.includes(DIRECTION.RIGHT_TO_LEFT)}
            >
              <ContentWrapper>{__('Pan Right', 'web-stories')}</ContentWrapper>
              <PanRightAnimation>
                {__('Pan Right', 'web-stories')}
              </PanRightAnimation>
            </GridItem>
            <GridItem
              aria-label={__('Pan Up Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.BOTTOM_TO_TOP,
                })
              }
              disabled={disabledTypeOptionsMap[
                BACKGROUND_ANIMATION_EFFECTS.PAN.value
              ]?.includes(DIRECTION.BOTTOM_TO_TOP)}
            >
              <ContentWrapper>{__('Pan Up', 'web-stories')}</ContentWrapper>
              <PanBottomAnimation>
                {__('Pan Up', 'web-stories')}
              </PanBottomAnimation>
            </GridItem>
            <GridItem
              aria-label={__('Pan Down Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.TOP_TO_BOTTOM,
                })
              }
              disabled={disabledTypeOptionsMap[
                BACKGROUND_ANIMATION_EFFECTS.PAN.value
              ]?.includes(DIRECTION.TOP_TO_BOTTOM)}
            >
              <ContentWrapper>{__('Pan Down', 'web-stories')}</ContentWrapper>
              <PanTopAnimation>{__('Pan Down', 'web-stories')}</PanTopAnimation>
            </GridItem>
          </>
        ) : (
          <>
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
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.FADE_IN.value,
                })
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
              <FlyInLeftAnimation>
                {__('Fly in', 'web-stories')}
              </FlyInLeftAnimation>
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
              <FlyInTopAnimation>
                {__('Fly in', 'web-stories')}
              </FlyInTopAnimation>
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
              aria-label={__('Rotate In Left Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.ROTATE_IN.value,
                  rotateInDir: DIRECTION.LEFT_TO_RIGHT,
                })
              }
            >
              <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
              <RotateInLeftAnimation>
                {__('Rotate', 'web-stories')}
              </RotateInLeftAnimation>
            </GridItemHalfRow>
            <GridItemHalfRow
              aria-label={__('Rotate In Right Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.ROTATE_IN.value,
                  rotateInDir: DIRECTION.RIGHT_TO_LEFT,
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
              <TwirlInAnimation>
                {__('Twirl In', 'web-stories')}
              </TwirlInAnimation>
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
              <ZoomOutAnimation>
                {__('Zoom Out', 'web-stories')}
              </ZoomOutAnimation>
              <ContentWrapper>{__('Zoom Out', 'web-stories')}</ContentWrapper>
            </GridItemHalfRow>
          </>
        )}
      </Grid>
    </Container>
  );
}

EffectChooser.propTypes = {
  onAnimationSelected: PropTypes.func.isRequired,
  onNoEffectSelected: PropTypes.func.isRequired,
  onDismiss: PropTypes.func,
  isBackgroundEffects: PropTypes.bool,
  disabledTypeOptionsMap: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string)
  ),
};
