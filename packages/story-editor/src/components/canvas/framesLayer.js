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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { memo, useRef, useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { PAGE_WIDTH } from '@googleforcreators/units';
import { STORY_ANIMATION_STATE } from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import {
  themeHelpers,
  useKeyDownEffect,
} from '@googleforcreators/design-system';
import { DESIGN_SPACE_MARGIN, STABLE_ARRAY } from '../../constants';
import {
  useStory,
  useCanvas,
  useLayout,
  useTransform,
  useRightClickMenu,
} from '../../app';
import useCanvasKeys from '../../app/canvas/useCanvasKeys';
import { Layer, NavNextArea, NavPrevArea, PageArea } from './layout';
import FrameElement from './frameElement';
import Selection from './selection';
import PageNav from './pagenav';
import {
  FOCUS_GROUPS,
  useEditLayerFocusManager,
} from './editLayerFocusManager';

const FramesPageArea = styled(PageArea)`
  pointer-events: initial;
`;
const marginRatio = 100 * (DESIGN_SPACE_MARGIN / PAGE_WIDTH);

const FocusContainer = styled.div`
  // begin under header row
  grid-row: 2 / -1;
  grid-column: 1 / -1;
  // show focus border by adding margin
  margin: 5px;

  ${themeHelpers.focusableOutlineCSS};
`;

const FOCUS_CONTAINER_MESSAGE = __(
  'Canvas Area. To navigate into the page, press Enter. Press Tab to move to the group or element.',
  'web-stories'
);

const DesignSpaceGuidelineBorder = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.negativePress};
  left: ${marginRatio}%;
  right: ${marginRatio}%;
  top: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  z-index: 1;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
`;

function DesignSpaceGuideline() {
  const setDesignSpaceGuideline = useCanvas(
    ({ actions }) => actions.setDesignSpaceGuideline
  );
  const { isAnythingTransforming } = useTransform(({ state }) => ({
    isAnythingTransforming: state.isAnythingTransforming,
  }));

  return (
    <DesignSpaceGuidelineBorder
      ref={setDesignSpaceGuideline}
      isVisible={isAnythingTransforming}
    />
  );
}

function FramesNavAndSelection({ children }) {
  const framesLayerRef = useRef(null);

  const onOpenMenu = useRightClickMenu((state) => state.onOpenMenu);

  useKeyDownEffect(framesLayerRef, 'mod+alt+shift+m', onOpenMenu);

  return (
    <Layer
      ref={framesLayerRef}
      data-testid="FramesLayer"
      pointerEvents="initial"
      // Use `-1` to ensure that there's a default target to focus if
      // there's no selection, but it's not reachable by keyboard
      // otherwise.
      tabIndex="-1"
      aria-label={__('Frames layer', 'web-stories')}
    >
      {children}
      <NavPrevArea>
        <PageNav isNext={false} />
      </NavPrevArea>
      <NavNextArea>
        <PageNav />
      </NavNextArea>
      <Selection onContextMenu={onOpenMenu} />
    </Layer>
  );
}

FramesNavAndSelection.propTypes = {
  children: PropTypes.node,
};

function FrameElements() {
  // We are returning this directly because we want the elementIds array to be shallowly
  // compared between re-renders. This allows element properties to update without re-rendering
  // this top level component.
  const elementIds = useStory(
    ({ state }) =>
      state.currentPage?.elements?.map((el) => el.id) || STABLE_ARRAY
  );
  const isAnimating = useStory(({ state }) =>
    [STORY_ANIMATION_STATE.PLAYING, STORY_ANIMATION_STATE.SCRUBBING].includes(
      state.animationState
    )
  );

  const onOpenMenu = useRightClickMenu((state) => state.onOpenMenu);

  const { setScrollOffset } = useLayout(({ actions: { setScrollOffset } }) => ({
    setScrollOffset,
  }));
  const onScroll = useCallback(
    (evt) =>
      setScrollOffset({
        left: evt.target.scrollLeft,
        top: evt.target.scrollTop,
      }),
    [setScrollOffset]
  );

  return (
    !isAnimating && (
      <FramesPageArea
        fullBleedContainerLabel={__(
          'Fullbleed area (Frames layer)',
          'web-stories'
        )}
        onContextMenu={onOpenMenu}
        onScroll={onScroll}
      >
        {elementIds.map((id) => {
          return <FrameElement key={id} id={id} />;
        })}
        <DesignSpaceGuideline />
      </FramesPageArea>
    )
  );
}

function FramesLayer() {
  const canvasRef = useRef();
  const enterFocusGroup = useEditLayerFocusManager(
    ({ enterFocusGroup }) => enterFocusGroup
  );

  // TODO: https://github.com/google/web-stories-wp/issues/10266
  // refactor `useCanvasKeys`. This is the last hook causing extraneous re-renders in this component.
  // - pulls most of state from useStory and only creates actions and attaches them to hot keys
  // - extraneous re-renders in this component contribute only ~1ms to total re-render time,
  //   so this is a high hanging fruit with little reward.
  useCanvasKeys(canvasRef);

  useKeyDownEffect(
    canvasRef,
    { key: ['enter'] },
    () => {
      enterFocusGroup({
        groupId: FOCUS_GROUPS.ELEMENT_SELECTION,
        cleanup: () => canvasRef.current?.focus(),
      });
    },
    [enterFocusGroup]
  );

  return (
    <FramesNavAndSelection>
      <FocusContainer
        role="region"
        data-testid="canvas-focus-container"
        ref={canvasRef}
        aria-label={FOCUS_CONTAINER_MESSAGE}
        // eslint-disable-next-line styled-components-a11y/no-noninteractive-tabindex -- Container used to separate elements from normal tab order.
        tabIndex={0}
      />
      <FrameElements />
    </FramesNavAndSelection>
  );
}

export default memo(FramesLayer);
