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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { useFeatures } from 'flagged';

/**
 * Internal dependencies
 */
import {
  isNullOrUndefinedOrEmptyString,
  useKeyDownEffect,
  useFocusOut,
  Text,
  THEME_CONSTANTS,
  themeHelpers,
  TOOLTIP_PLACEMENT,
  Tooltip,
} from '../../../../../design-system';
import loadStylesheet from '../../../../utils/loadStylesheet';
import { useConfig } from '../../../../app/config';
import { GOOGLE_MENU_FONT_URL } from '../../../../app/font';
import {
  ANIMATION_EFFECTS,
  BACKGROUND_ANIMATION_EFFECTS,
  DIRECTION,
  SCALE_DIRECTION,
} from '../../../../../animation';
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
  PanAndZoomAnimation,
} from './effectChooserElements';

// Full panel width minus the padding & scrollbar.
const Container = styled.div`
  width: ${PANEL_WIDTH - 22}px;
`;

const ContentWrapper = styled.div`
  display: inline-block;
`;

const GridItem = styled.button.attrs({ role: 'listitem' })`
  border: none;
  background: ${({ active, theme }) =>
    active
      ? theme.colors.interactiveBg.secondaryPress
      : theme.colors.interactiveBg.secondaryNormal};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  height: ${GRID_ITEM_HEIGHT}px;
  position: relative;
  overflow: hidden;
  font-family: 'Teko', sans-serif;
  font-size: ${({ size = 28 }) => size}px;
  line-height: 1;
  color: ${({ theme }) => theme.colors.fg.primary};
  text-transform: uppercase;
  transition: background 0.1s linear;

  &[aria-disabled='true'] {
    background: ${({ theme }) => theme.colors.interactiveBg.disable};
  }

  &:hover:not([aria-disabled='true']) {
    cursor: pointer;
  }

  &:hover:not([aria-disabled='true']),
  &:focus:not([aria-disabled='true']) {
    background: ${({ active, theme }) =>
      active
        ? theme.colors.interactiveBg.secondaryPress
        : theme.colors.interactiveBg.secondaryHover};

    ${BaseAnimationCell} {
      display: inline-block;
    }

    ${ContentWrapper} {
      display: none;
    }
  }
  ${themeHelpers.focusableOutlineCSS};
`;
const Grid = styled.div.attrs({ role: 'list' })`
  display: grid;
  justify-content: center;
  gap: 12px 4px;
  grid-template-columns: repeat(4, 1fr);
  padding: 16px 2px 16px 16px;
  position: relative;
`;

const GridItemFullRow = styled(GridItem)`
  grid-column-start: span 4;
`;

const GridItemHalfRow = styled(GridItem)`
  grid-column-start: span 2;
`;

const NoEffect = styled(GridItemFullRow)`
  height: 36px;
`;

/**
 * Because the effect chooser is hard coded these two effects lists help keep track of the current index
 * current index is how we track focus for up and down arrows and setting active list item when menu is opened.
 * These values map to the value prop and then if a direction is present,
 * it's added to the name in order of appearance in the dropdown to track index properly and uniquely
 */

const getDirectionalEffect = (effect, direction) =>
  direction ? `${effect} ${direction}`.trim() : effect;

const FOREGROUND_EFFECTS_LIST = [
  false, // arbitrary value to maintain order of focusable children 'No Effect',
  ANIMATION_EFFECTS.DROP.value,
  ANIMATION_EFFECTS.FADE_IN.value,
  `${ANIMATION_EFFECTS.FLY_IN.value} ${DIRECTION.LEFT_TO_RIGHT}`,
  `${ANIMATION_EFFECTS.FLY_IN.value} ${DIRECTION.TOP_TO_BOTTOM}`,
  `${ANIMATION_EFFECTS.FLY_IN.value} ${DIRECTION.BOTTOM_TO_TOP}`,
  `${ANIMATION_EFFECTS.FLY_IN.value} ${DIRECTION.RIGHT_TO_LEFT}`,
  ANIMATION_EFFECTS.PULSE.value,
  `${ANIMATION_EFFECTS.ROTATE_IN.value} ${DIRECTION.LEFT_TO_RIGHT}`,
  `${ANIMATION_EFFECTS.ROTATE_IN.value} ${DIRECTION.RIGHT_TO_LEFT}`,
  ANIMATION_EFFECTS.TWIRL_IN.value,
  `${ANIMATION_EFFECTS.WHOOSH_IN.value} ${DIRECTION.LEFT_TO_RIGHT}`,
  `${ANIMATION_EFFECTS.WHOOSH_IN.value} ${DIRECTION.RIGHT_TO_LEFT}`,
  `${ANIMATION_EFFECTS.ZOOM.value} ${SCALE_DIRECTION.SCALE_IN}`,
  `${ANIMATION_EFFECTS.ZOOM.value} ${SCALE_DIRECTION.SCALE_OUT}`,
];

const PAN_MAPPING = {
  [DIRECTION.LEFT_TO_RIGHT]: `${BACKGROUND_ANIMATION_EFFECTS.PAN.value} ${DIRECTION.LEFT_TO_RIGHT}`,
  [DIRECTION.RIGHT_TO_LEFT]: `${BACKGROUND_ANIMATION_EFFECTS.PAN.value} ${DIRECTION.RIGHT_TO_LEFT}`,
  [DIRECTION.BOTTOM_TO_TOP]: `${BACKGROUND_ANIMATION_EFFECTS.PAN.value} ${DIRECTION.BOTTOM_TO_TOP}`,
  [DIRECTION.TOP_TO_BOTTOM]: `${BACKGROUND_ANIMATION_EFFECTS.PAN.value} ${DIRECTION.TOP_TO_BOTTOM}`,
};
const BACKGROUND_EFFECTS_LIST = [
  false, // arbitrary value to maintain order of focusable children 'No Effect',
  PAN_MAPPING[DIRECTION.LEFT_TO_RIGHT],
  PAN_MAPPING[DIRECTION.RIGHT_TO_LEFT],
  PAN_MAPPING[DIRECTION.BOTTOM_TO_TOP],
  PAN_MAPPING[DIRECTION.TOP_TO_BOTTOM],
  `${BACKGROUND_ANIMATION_EFFECTS.ZOOM.value} ${SCALE_DIRECTION.SCALE_IN}`,
  `${BACKGROUND_ANIMATION_EFFECTS.ZOOM.value} ${SCALE_DIRECTION.SCALE_OUT}`,
  BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value,
];

export default function EffectChooser({
  onAnimationSelected,
  onNoEffectSelected,
  onDismiss,
  isBackgroundEffects = false,
  disabledTypeOptionsMap,
  value = '',
  direction,
}) {
  const { isRTL } = useConfig();
  const [focusedValue, setFocusedValue] = useState(null);
  const ref = useRef();
  const { enableExperimentalAnimationEffects } = useFeatures();

  useEffect(() => {
    loadStylesheet(`${GOOGLE_MENU_FONT_URL}?family=Teko`).catch(function () {});
  }, []);

  const getDisabledBackgroundEffects = useCallback(() => {
    const disabledDirectionalEffects = Object.entries(disabledTypeOptionsMap)
      .map(([effect, val]) => [effect, val.options])
      .reduce(
        (directionalEffects, [effect, directions]) => [
          ...directionalEffects,
          ...(directions || []).map((dir) => getDirectionalEffect(effect, dir)),
        ],
        []
      );
    return BACKGROUND_EFFECTS_LIST.filter((directionalEffect) =>
      disabledDirectionalEffects.includes(directionalEffect)
    );
  }, [disabledTypeOptionsMap]);

  const availableListOptions = isBackgroundEffects
    ? BACKGROUND_EFFECTS_LIST
    : FOREGROUND_EFFECTS_LIST;
  const listLength = availableListOptions.length;

  const disabledBackgroundEffects = useMemo(
    () => (isBackgroundEffects ? getDisabledBackgroundEffects() : []),
    [getDisabledBackgroundEffects, isBackgroundEffects]
  );

  // set existing active effect with a ref, specify when dropdown is opened which version of an effect it is since some have many options
  const activeEffectListValue = useMemo(
    () => getDirectionalEffect(value, direction),
    [direction, value]
  );

  const activeEffectListIndex = useMemo(() => {
    const bgListIndex = BACKGROUND_EFFECTS_LIST.indexOf(activeEffectListValue);
    if (bgListIndex > -1) {
      return bgListIndex;
    }
    const fgListIndex = FOREGROUND_EFFECTS_LIST.indexOf(activeEffectListValue);
    if (fgListIndex > -1) {
      return fgListIndex;
    }
    return 0;
  }, [activeEffectListValue]);

  // Once the correct effect w/ direction is found, set focusedValue to trigger effect hook to find proper index.
  useEffect(() => {
    setFocusedValue(activeEffectListValue);
  }, [activeEffectListValue, setFocusedValue]);

  const focusedIndex = useMemo(() => {
    if (isNullOrUndefinedOrEmptyString(focusedValue)) {
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
      if (
        ['ArrowUp', isRTL ? 'ArrowRight' : 'ArrowLeft'].includes(key) &&
        focusedIndex !== 0
      ) {
        handleMoveFocus(-1);
      } else if (
        ['ArrowDown', isRTL ? 'ArrowLeft' : 'ArrowRight'].includes(key) &&
        focusedIndex < listLength - 1
      ) {
        handleMoveFocus(1);
      }
    },
    [focusedIndex, handleMoveFocus, listLength, isRTL]
  );

  useKeyDownEffect(
    ref,
    { key: ['up', 'down', 'left', 'right'] },
    handleUpDown,
    [handleUpDown]
  );

  useFocusOut(ref, () => onDismiss?.(), []);

  // TODO tab+shift should also dismiss
  useKeyDownEffect(ref, { key: ['esc', 'tab'] }, onDismiss, [onDismiss]);

  // Set initial focus
  useEffect(() => {
    if (ref.current && focusedIndex !== null) {
      ref.current.children?.[focusedIndex]?.focus();
    }
  }, [focusedIndex, disabledBackgroundEffects]);

  const handleOnSelect = useCallback(
    (event, directionalEffect, animation) => {
      const isEffectDisabled = disabledBackgroundEffects.includes(
        directionalEffect
      );

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
    <Container>
      <Grid
        ref={ref}
        aria-label={__('Available Animations To Select', 'web-stories')}
      >
        <NoEffect
          onClick={onNoEffectSelected}
          aria-label={__('None', 'web-stories')}
          active={activeEffectListIndex === 0}
        >
          <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('None', 'web-stories')}
          </Text>
        </NoEffect>
        {isBackgroundEffects ? (
          <>
            <GridItem
              size={16}
              aria-label={__('Pan Left Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(event, PAN_MAPPING[DIRECTION.LEFT_TO_RIGHT], {
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.LEFT_TO_RIGHT,
                })
              }
              aria-disabled={disabledBackgroundEffects.includes(
                PAN_MAPPING[DIRECTION.LEFT_TO_RIGHT]
              )}
              active={activeEffectListIndex === 1}
            >
              <Tooltip
                title={
                  disabledBackgroundEffects.includes(
                    PAN_MAPPING[DIRECTION.LEFT_TO_RIGHT]
                  )
                    ? disabledTypeOptionsMap[
                        BACKGROUND_ANIMATION_EFFECTS.PAN.value
                      ]?.tooltip
                    : ''
                }
                placement={TOOLTIP_PLACEMENT.LEFT}
              >
                <ContentWrapper>{__('Pan Left', 'web-stories')}</ContentWrapper>
                <PanLeftAnimation>
                  {__('Pan Left', 'web-stories')}
                </PanLeftAnimation>
              </Tooltip>
            </GridItem>
            <GridItem
              size={16}
              aria-label={__('Pan Right Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(event, PAN_MAPPING[DIRECTION.RIGHT_TO_LEFT], {
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.RIGHT_TO_LEFT,
                })
              }
              aria-disabled={disabledBackgroundEffects.includes(
                PAN_MAPPING[DIRECTION.RIGHT_TO_LEFT]
              )}
              active={activeEffectListIndex === 2}
            >
              <Tooltip
                title={
                  disabledBackgroundEffects.includes(
                    PAN_MAPPING[DIRECTION.RIGHT_TO_LEFT]
                  )
                    ? disabledTypeOptionsMap[
                        BACKGROUND_ANIMATION_EFFECTS.PAN.value
                      ]?.tooltip
                    : ''
                }
                placement={TOOLTIP_PLACEMENT.LEFT}
              >
                <ContentWrapper>
                  {__('Pan Right', 'web-stories')}
                </ContentWrapper>
                <PanRightAnimation>
                  {__('Pan Right', 'web-stories')}
                </PanRightAnimation>
              </Tooltip>
            </GridItem>
            <GridItem
              size={16}
              aria-label={__('Pan Up Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(event, PAN_MAPPING[DIRECTION.BOTTOM_TO_TOP], {
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.BOTTOM_TO_TOP,
                })
              }
              aria-disabled={disabledBackgroundEffects.includes(
                PAN_MAPPING[DIRECTION.BOTTOM_TO_TOP]
              )}
              active={activeEffectListIndex === 3}
            >
              <Tooltip
                title={
                  disabledBackgroundEffects.includes(
                    PAN_MAPPING[DIRECTION.BOTTOM_TO_TOP]
                  )
                    ? disabledTypeOptionsMap[
                        BACKGROUND_ANIMATION_EFFECTS.PAN.value
                      ]?.tooltip
                    : ''
                }
                placement={TOOLTIP_PLACEMENT.LEFT}
              >
                <ContentWrapper>{__('Pan Up', 'web-stories')}</ContentWrapper>
                <PanBottomAnimation>
                  {__('Pan Up', 'web-stories')}
                </PanBottomAnimation>
              </Tooltip>
            </GridItem>
            <GridItem
              size={16}
              aria-label={__('Pan Down Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(event, PAN_MAPPING[DIRECTION.TOP_TO_BOTTOM], {
                  animation: BACKGROUND_ANIMATION_EFFECTS.PAN.value,
                  panDir: DIRECTION.TOP_TO_BOTTOM,
                })
              }
              aria-disabled={disabledBackgroundEffects.includes(
                PAN_MAPPING[DIRECTION.TOP_TO_BOTTOM]
              )}
              active={activeEffectListIndex === 4}
            >
              <Tooltip
                title={
                  disabledBackgroundEffects.includes(
                    PAN_MAPPING[DIRECTION.TOP_TO_BOTTOM]
                  )
                    ? disabledTypeOptionsMap[
                        BACKGROUND_ANIMATION_EFFECTS.PAN.value
                      ]?.tooltip
                    : ''
                }
                placement={TOOLTIP_PLACEMENT.LEFT}
              >
                <ContentWrapper>{__('Pan Down', 'web-stories')}</ContentWrapper>
                <PanTopAnimation>
                  {__('Pan Down', 'web-stories')}
                </PanTopAnimation>
              </Tooltip>
            </GridItem>
            <GridItemHalfRow
              aria-label={__('Zoom In Effect', 'web-stories')}
              size={12}
              onClick={(event) =>
                handleOnSelect(
                  event,
                  getDirectionalEffect(
                    BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                    SCALE_DIRECTION.SCALE_IN
                  ),
                  {
                    animation: BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                    zoomDirection: SCALE_DIRECTION.SCALE_IN,
                  }
                )
              }
              aria-disabled={disabledBackgroundEffects.includes(
                getDirectionalEffect(
                  BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                  SCALE_DIRECTION.SCALE_IN
                )
              )}
              active={activeEffectListIndex === 5}
            >
              <Tooltip
                title={
                  disabledBackgroundEffects.includes(
                    getDirectionalEffect(
                      BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                      SCALE_DIRECTION.SCALE_IN
                    )
                  )
                    ? disabledTypeOptionsMap[
                        BACKGROUND_ANIMATION_EFFECTS.ZOOM.value
                      ]?.tooltip
                    : ''
                }
                placement={TOOLTIP_PLACEMENT.LEFT}
              >
                <ContentWrapper>{__('Zoom In', 'web-stories')}</ContentWrapper>
                <ZoomInAnimation>
                  {__('Zoom In', 'web-stories')}
                </ZoomInAnimation>
              </Tooltip>
            </GridItemHalfRow>
            <GridItemHalfRow
              aria-label={__('Zoom Out Effect', 'web-stories')}
              onClick={(event) =>
                handleOnSelect(
                  event,
                  getDirectionalEffect(
                    BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                    SCALE_DIRECTION.SCALE_OUT
                  ),
                  {
                    animation: BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                    zoomDirection: SCALE_DIRECTION.SCALE_OUT,
                  }
                )
              }
              aria-disabled={disabledBackgroundEffects.includes(
                getDirectionalEffect(
                  BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                  SCALE_DIRECTION.SCALE_OUT
                )
              )}
              active={activeEffectListIndex === 6}
            >
              <Tooltip
                title={
                  disabledBackgroundEffects.includes(
                    getDirectionalEffect(
                      BACKGROUND_ANIMATION_EFFECTS.ZOOM.value,
                      SCALE_DIRECTION.SCALE_OUT
                    )
                  )
                    ? disabledTypeOptionsMap[
                        BACKGROUND_ANIMATION_EFFECTS.ZOOM.value
                      ]?.tooltip
                    : ''
                }
                placement={TOOLTIP_PLACEMENT.LEFT}
              >
                <ContentWrapper>{__('Zoom Out', 'web-stories')}</ContentWrapper>
                <ZoomOutAnimation>
                  {__('Zoom Out', 'web-stories')}
                </ZoomOutAnimation>
              </Tooltip>
            </GridItemHalfRow>
            {enableExperimentalAnimationEffects && (
              <GridItemFullRow
                aria-label={__('Pan and Zoom Effect', 'web-stories')}
                onClick={(event) => {
                  handleOnSelect(
                    event,
                    BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value,
                    {
                      animation:
                        BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value,
                      zoomDirection: (
                        disabledTypeOptionsMap[
                          BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value
                        ]?.options || []
                      ).includes(SCALE_DIRECTION.SCALE_OUT)
                        ? SCALE_DIRECTION.SCALE_IN
                        : SCALE_DIRECTION.SCALE_OUT,
                    }
                  );
                }}
                aria-disabled={disabledBackgroundEffects.includes(
                  BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value
                )}
                active={activeEffectListIndex === 7}
              >
                <Tooltip
                  title={
                    disabledBackgroundEffects.includes(
                      BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value
                    )
                      ? disabledTypeOptionsMap[
                          BACKGROUND_ANIMATION_EFFECTS.PAN_AND_ZOOM.value
                        ]?.tooltip
                      : ''
                  }
                  placement={TOOLTIP_PLACEMENT.LEFT}
                >
                  <ContentWrapper>
                    {__('Pan and Zoom', 'web-stories')}
                  </ContentWrapper>
                  <PanAndZoomAnimation>
                    {__('Pan and Zoom', 'web-stories')}
                  </PanAndZoomAnimation>
                </Tooltip>
              </GridItemFullRow>
            )}
          </>
        ) : (
          <>
            <GridItemFullRow
              aria-label={__('Drop Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({ animation: ANIMATION_EFFECTS.DROP.value })
              }
              active={activeEffectListIndex === 1}
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
              active={activeEffectListIndex === 2}
            >
              <ContentWrapper>{__('Fade in', 'web-stories')}</ContentWrapper>
              <FadeInAnimation>{__('Fade in', 'web-stories')}</FadeInAnimation>
            </GridItemFullRow>
            <GridItem
              size={18}
              aria-label={__('Fly In from Left Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.FLY_IN.value,
                  flyInDir: DIRECTION.LEFT_TO_RIGHT,
                })
              }
              active={activeEffectListIndex === 3}
            >
              <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
              <FlyInLeftAnimation>
                {__('Fly in', 'web-stories')}
              </FlyInLeftAnimation>
            </GridItem>
            <GridItem
              size={18}
              aria-label={__('Fly In from Top Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.FLY_IN.value,
                  flyInDir: DIRECTION.TOP_TO_BOTTOM,
                })
              }
              active={activeEffectListIndex === 4}
            >
              <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
              <FlyInTopAnimation>
                {__('Fly in', 'web-stories')}
              </FlyInTopAnimation>
            </GridItem>
            <GridItem
              size={18}
              aria-label={__('Fly In from Bottom Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.FLY_IN.value,
                  flyInDir: DIRECTION.BOTTOM_TO_TOP,
                })
              }
              active={activeEffectListIndex === 5}
            >
              <ContentWrapper>{__('Fly in', 'web-stories')}</ContentWrapper>
              <FlyInBottomAnimation>
                {__('Fly in', 'web-stories')}
              </FlyInBottomAnimation>
            </GridItem>
            <GridItem
              size={18}
              aria-label={__('Fly In from Right Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.FLY_IN.value,
                  flyInDir: DIRECTION.RIGHT_TO_LEFT,
                })
              }
              active={activeEffectListIndex === 6}
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
              active={activeEffectListIndex === 7}
            >
              <ContentWrapper>{__('Pulse', 'web-stories')}</ContentWrapper>
              <PulseAnimation>{__('Pulse', 'web-stories')}</PulseAnimation>
            </GridItemFullRow>
            <GridItemHalfRow
              size={18}
              aria-label={__('Rotate In Left Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.ROTATE_IN.value,
                  rotateInDir: DIRECTION.LEFT_TO_RIGHT,
                })
              }
              active={activeEffectListIndex === 8}
            >
              <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
              <RotateInLeftAnimation>
                {__('Rotate', 'web-stories')}
              </RotateInLeftAnimation>
            </GridItemHalfRow>
            <GridItemHalfRow
              size={18}
              aria-label={__('Rotate In Right Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.ROTATE_IN.value,
                  rotateInDir: DIRECTION.RIGHT_TO_LEFT,
                })
              }
              active={activeEffectListIndex === 9}
            >
              <ContentWrapper>{__('Rotate', 'web-stories')}</ContentWrapper>
              <RotateInRightAnimation>
                {__('Rotate', 'web-stories')}
              </RotateInRightAnimation>
            </GridItemHalfRow>
            <GridItemFullRow
              size={26}
              aria-label={__('Twirl In Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.TWIRL_IN.value,
                })
              }
              active={activeEffectListIndex === 10}
            >
              <ContentWrapper>{__('Twirl In', 'web-stories')}</ContentWrapper>
              <TwirlInAnimation>
                {__('Twirl In', 'web-stories')}
              </TwirlInAnimation>
            </GridItemFullRow>
            <GridItemHalfRow
              size={24}
              aria-label={__('Whoosh In from Left Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.WHOOSH_IN.value,
                  whooshInDir: DIRECTION.LEFT_TO_RIGHT,
                })
              }
              active={activeEffectListIndex === 11}
            >
              <ContentWrapper>{__('Whoosh In', 'web-stories')}</ContentWrapper>
              <WhooshInLeftAnimation>
                {__('Whoosh In', 'web-stories')}
              </WhooshInLeftAnimation>
            </GridItemHalfRow>
            <GridItemHalfRow
              size={24}
              aria-label={__('Whoosh In from Right Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.WHOOSH_IN.value,
                  whooshInDir: DIRECTION.RIGHT_TO_LEFT,
                })
              }
              active={activeEffectListIndex === 12}
            >
              <WhooshInRightAnimation>
                {__('Whoosh In', 'web-stories')}
              </WhooshInRightAnimation>
              <ContentWrapper>{__('Whoosh In', 'web-stories')}</ContentWrapper>
            </GridItemHalfRow>
            <GridItemHalfRow
              size={12}
              aria-label={__('Scale In Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.ZOOM.value,
                  scaleDirection: SCALE_DIRECTION.SCALE_IN,
                })
              }
              active={activeEffectListIndex === 13}
            >
              <ContentWrapper>{__('Scale In', 'web-stories')}</ContentWrapper>
              <ZoomInAnimation>{__('Scale In', 'web-stories')}</ZoomInAnimation>
            </GridItemHalfRow>
            <GridItemHalfRow
              aria-label={__('Scale Out Effect', 'web-stories')}
              onClick={() =>
                onAnimationSelected({
                  animation: ANIMATION_EFFECTS.ZOOM.value,
                  scaleDirection: SCALE_DIRECTION.SCALE_OUT,
                })
              }
              active={activeEffectListIndex === 14}
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
    PropTypes.shape({
      tooltip: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  value: PropTypes.string,
};
