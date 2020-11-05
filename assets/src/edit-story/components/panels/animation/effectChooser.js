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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import loadStylesheet from '../../../utils/loadStylesheet';
import { GOOGLE_MENU_FONT_URL } from '../../../app/font';
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
  overflow: hidden;
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

export default function EffectChooser() {
  useEffect(() => {
    loadStylesheet(`${GOOGLE_MENU_FONT_URL}?family=Teko`).catch(function () {});
  });

  return (
    <Container>
      <Grid>
        <GridItemFullRow>
          <DropAnimation>
            <ContentWrapper>{__('Drop', 'web-stories')}</ContentWrapper>
          </DropAnimation>
        </GridItemFullRow>
        <GridItemFullRow>
          <FadeInAnimation>
            <ContentWrapper>{__('Fade in', 'web-stories')}</ContentWrapper>
          </FadeInAnimation>
        </GridItemFullRow>
        <GridItem>
          <ContentWrapper>
            <FlyInLeftAnimation>
              {__('Fly in', 'web-stories')}
            </FlyInLeftAnimation>
          </ContentWrapper>
        </GridItem>
        <GridItem>
          <ContentWrapper>
            <FlyInTopAnimation>{__('Fly in', 'web-stories')}</FlyInTopAnimation>
          </ContentWrapper>
        </GridItem>
        <GridItem>
          <ContentWrapper>
            <FlyInBottomAnimation>
              {__('Fly in', 'web-stories')}
            </FlyInBottomAnimation>
          </ContentWrapper>
        </GridItem>
        <GridItem>
          <ContentWrapper>
            <FlyInRightAnimation>
              {__('Fly in', 'web-stories')}
            </FlyInRightAnimation>
          </ContentWrapper>
        </GridItem>
        <GridItemFullRow>
          <ContentWrapper>
            <PulseAnimation>{__('Pulse', 'web-stories')}</PulseAnimation>
          </ContentWrapper>
        </GridItemFullRow>
        <GridItemHalfRow>
          <ContentWrapper>
            <RotateInLeftAnimation>
              {__('Rotate', 'web-stories')}
            </RotateInLeftAnimation>
          </ContentWrapper>
        </GridItemHalfRow>
        <GridItemHalfRow>
          <RotateInRightAnimation>
            <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
          </RotateInRightAnimation>
        </GridItemHalfRow>
        <GridItemFullRow>
          <TwirlInAnimation>
            <ContentWrapper>{__('Twirl In', 'web-stories')}</ContentWrapper>
          </TwirlInAnimation>
        </GridItemFullRow>
        <GridItemHalfRow>
          <ContentWrapper>
            <WhooshInLeftAnimation>
              {__('Woosh In', 'web-stories')}
            </WhooshInLeftAnimation>
          </ContentWrapper>
        </GridItemHalfRow>
        <GridItemHalfRow>
          <WhooshInRightAnimation>
            <ContentWrapper>{__('Woosh In', 'web-stories')}</ContentWrapper>
          </WhooshInRightAnimation>
        </GridItemHalfRow>
        <GridItem>
          <ContentWrapper>
            <PanLeftAnimation>{__('Pan', 'web-stories')}</PanLeftAnimation>
          </ContentWrapper>
        </GridItem>
        <GridItem>
          <ContentWrapper>
            <PanTopAnimation>{__('Pan', 'web-stories')}</PanTopAnimation>
          </ContentWrapper>
        </GridItem>
        <GridItem>
          <ContentWrapper>
            <PanBottomAnimation>{__('Pan', 'web-stories')}</PanBottomAnimation>
          </ContentWrapper>
        </GridItem>
        <GridItem>
          <ContentWrapper>
            <PanRightAnimation>{__('Pan', 'web-stories')}</PanRightAnimation>
          </ContentWrapper>
        </GridItem>
        <GridItemHalfRow>
          <ContentWrapper>
            <ZoomInAnimation>{__('Zoom In', 'web-stories')}</ZoomInAnimation>
          </ContentWrapper>
        </GridItemHalfRow>
        <GridItemHalfRow>
          <ZoomOutAnimation>
            <ContentWrapper>{__('Zoom Out', 'web-stories')}</ContentWrapper>
          </ZoomOutAnimation>
        </GridItemHalfRow>
      </Grid>
    </Container>
  );
}
