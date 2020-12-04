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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { useKeyDownEffect } from '../../keyboard';
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

  &[aria-disabled='true'] {
    opacity: 0.6;
  }

  &:hover:not([aria-disabled='true']) {
    cursor: pointer;
  }

  &:hover:not([aria-disabled='true']),
  &:focus:not([aria-disabled='true']) {
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
  /* Specify outline override here so we can give priority with extra selectors */
  & > button[role='listitem']:focus {
    outline: -webkit-focus-ring-color auto 1px !important;
  }
`;

const GridItemFullRow = styled(GridItem)`
  grid-column-start: span 4;
`;

const GridItemHalfRow = styled(GridItem)`
  grid-column-start: span 2;
`;

/**
 * Because the effect chooser is hard coded these two effects lists help keep track of the current index
 * current index is how we track focus for up and down arrows and setting active list item when menu is opened.
 * These values map to the value prop and then if a direction is present,
 * it's added to the name in order of appearance in the dropdown to track index properly and uniquely
 */

const FOREGROUND_EFFECTS_LIST = [
  'No Effect',
  'Drop',
  'Fade In',
  `Fly In ${DIRECTION.LEFT_TO_RIGHT}`,
  `Fly In ${DIRECTION.TOP_TO_BOTTOM}`,
  `Fly In ${DIRECTION.RIGHT_TO_LEFT}`,
  `Fly In ${DIRECTION.BOTTOM_TO_TOP}`,
  'Pulse',
  `Rotate In ${DIRECTION.LEFT_TO_RIGHT}`,
  `Rotate In ${DIRECTION.RIGHT_TO_LEFT}`,
  'Twirl In',
  `Whoosh In ${DIRECTION.LEFT_TO_RIGHT}`,
  `Whoosh In ${DIRECTION.RIGHT_TO_LEFT}`,
  'Zoom In',
  'Zoom Out',
];

const BACKGROUND_EFFECTS_LIST = [
  'No Effect',
  'Zoom',
  `Pan ${DIRECTION.LEFT_TO_RIGHT}`,
  `Pan ${DIRECTION.RIGHT_TO_LEFT}`,
  `Pan ${DIRECTION.BOTTOM_TO_TOP}`,
  `Pan ${DIRECTION.TOP_TO_BOTTOM}`,
];

// TODO figure out what the key is for pan direction, add to helper
export default function EffectChooser({
  onAnimationSelected,
  onNoEffectSelected,
  onDismiss,
  isBackgroundEffects = false,
  disabledTypeOptionsMap,
  value = '',
  direction,
}) {
  const [focusedValue, setFocusedValue] = useState(null);
  const ref = useRef();
  const previousEffectValueRef = useRef();

  useEffect(() => {
    loadStylesheet(`${GOOGLE_MENU_FONT_URL}?family=Teko`).catch(function () {});
  }, []);

  const getDisabledBackgroundEffects = useCallback(() => {
    // right now only background pan effects are potentially disabled
    const listWithDisabledOptions = [...BACKGROUND_EFFECTS_LIST].filter(
      // eslint-disable-next-line consistent-return
      (currentEffect) => {
        const isDisabled = disabledTypeOptionsMap[
          'effect-background-pan'
        ].find((disabledOption) => currentEffect.endsWith(disabledOption));

        if (isDisabled) {
          return currentEffect;
        }
      }
    );
    return listWithDisabledOptions;
  }, [disabledTypeOptionsMap]);

  const availableListOptions = isBackgroundEffects
    ? BACKGROUND_EFFECTS_LIST
    : FOREGROUND_EFFECTS_LIST;
  const listLength = availableListOptions.length;

  const disabledBackgroundEffects = useMemo(() => {
    if (isBackgroundEffects) {
      if (disabledTypeOptionsMap?.['effect-background-pan']) {
        return getDisabledBackgroundEffects();
      }
      return [];
    }
    return [];
  }, [
    disabledTypeOptionsMap,
    getDisabledBackgroundEffects,
    isBackgroundEffects,
  ]);

  // set existing active effect with a ref, specify when dropdown is opened which version of an effect it is since some have many options
  const getPreviousEffectValue = useCallback(() => {
    if (direction || direction === 0) {
      let indicator;
      if (typeof direction === 'number') {
        indicator = direction > 0 ? 'Out' : 'In';
      } else {
        indicator = direction;
      }

      return `${value} ${indicator}`.trim();
    }
    return value;
  }, [direction, value]);

  useEffect(() => {
    previousEffectValueRef.current = getPreviousEffectValue();
    return () => {
      previousEffectValueRef.current = null;
    };
  }, [getPreviousEffectValue]);

  // Once the correct effect w/ direction is found, set focusedValue to trigger effect hook to find proper index.
  useEffect(() => {
    if (previousEffectValueRef.current) {
      setFocusedValue(previousEffectValueRef.current);
    }
  }, []);

  const isNullOrUndefined = (val) =>
    val === null || val === undefined || val === '';

  const focusedIndex = useMemo(() => {
    if (isNullOrUndefined(focusedValue)) {
      return 0;
    }
    const newFocusIndex = availableListOptions.indexOf(focusedValue);
    return newFocusIndex >= 0 ? newFocusIndex : 0;
  }, [availableListOptions, focusedValue]);

  const handleMoveFocus = useCallback(
    (offset) => setFocusedValue(availableListOptions[focusedIndex + offset]),
    [availableListOptions, focusedIndex]
  );

  const handleUpDown = useCallback(
    ({ key }) => {
      if (key === 'ArrowUp' && focusedIndex !== 0) {
        handleMoveFocus(-1);
      } else if (key === 'ArrowDown' && focusedIndex < listLength - 1) {
        handleMoveFocus(1);
      }
    },
    [focusedIndex, handleMoveFocus, listLength]
  );

  useKeyDownEffect(ref, { key: ['up', 'down'] }, handleUpDown, [handleUpDown]);

  useFocusOut(ref, () => onDismiss?.(), []);

  // TODO tab+shift should also dismiss
  useKeyDownEffect(ref, { key: ['esc', 'tab'] }, onDismiss, [onDismiss]);

  // Set initial focus
  useEffect(() => {
    if (ref.current && focusedIndex !== null) {
      ref.current.firstChild?.children?.[focusedIndex]?.focus();
    }
  }, [focusedValue, focusedIndex, disabledBackgroundEffects]);

  const handleOnSelect = useCallback(
    (event, effect, animation) => {
      const isEffectDisabled = disabledBackgroundEffects.includes(effect);

      if (isEffectDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return () => {};
      }

      return onAnimationSelected(animation);
    },
    [disabledBackgroundEffects, onAnimationSelected]
  );

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
              onClick={(event) =>
                handleOnSelect(event, 'Zoom', {
                  animation: BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                })
              }
            >
              <ContentWrapper>{__('Zoom', 'web-stories')}</ContentWrapper>
              <ZoomOutAnimation>{__('Zoom', 'web-stories')}</ZoomOutAnimation>
            </GridItemFullRow>
            <GridItem
              aria-label={__('Pan Left Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(event, 'Pan leftToRight', {
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.LEFT_TO_RIGHT,
                })
              }
              aria-disabled={disabledBackgroundEffects.includes(
                'Pan leftToRight'
              )}
            >
              <ContentWrapper>{__('Pan Left', 'web-stories')}</ContentWrapper>
              <PanLeftAnimation>
                {__('Pan Left', 'web-stories')}
              </PanLeftAnimation>
            </GridItem>
            <GridItem
              aria-label={__('Pan Right Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(event, 'Pan rightToLeft', {
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.RIGHT_TO_LEFT,
                })
              }
              aria-disabled={disabledBackgroundEffects.includes(
                'Pan rightToLeft'
              )}
            >
              <ContentWrapper>{__('Pan Right', 'web-stories')}</ContentWrapper>
              <PanRightAnimation>
                {__('Pan Right', 'web-stories')}
              </PanRightAnimation>
            </GridItem>
            <GridItem
              aria-label={__('Pan Up Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(event, 'Pan bottomToTop', {
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.BOTTOM_TO_TOP,
                })
              }
              aria-disabled={disabledBackgroundEffects.includes(
                'Pan bottomToTop'
              )}
            >
              <ContentWrapper>{__('Pan Up', 'web-stories')}</ContentWrapper>
              <PanBottomAnimation>
                {__('Pan Up', 'web-stories')}
              </PanBottomAnimation>
            </GridItem>
            <GridItem
              aria-label={__('Pan Down Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(event, 'Pan topToBottom', {
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.TOP_TO_BOTTOM,
                })
              }
              aria-disabled={disabledBackgroundEffects.includes(
                'Pan topToBottom'
              )}
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
              aria-label={__('Scale In Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.ZOOM.value,
                  zoomFrom: 0,
                  zoomTo: 1,
                })
              }
            >
              <ContentWrapper>{__('Scale In', 'web-stories')}</ContentWrapper>
              <ZoomInAnimation>{__('Scale In', 'web-stories')}</ZoomInAnimation>
            </GridItemHalfRow>
            <GridItemHalfRow
              aria-label={__('Scale Out Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.ZOOM.value,
                  zoomFrom: 2,
                  zoomTo: 1,
                })
              }
            >
              <ZoomOutAnimation>
                {__('Scale Out', 'web-stories')}
              </ZoomOutAnimation>
              <ContentWrapper>{__('Scale Out', 'web-stories')}</ContentWrapper>
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
  direction: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  onDismiss: PropTypes.func,
  isBackgroundEffects: PropTypes.bool,
  disabledTypeOptionsMap: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.string)
  ),
  value: PropTypes.string,
};
