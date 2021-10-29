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
import { memo, useRef, useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import { PAGE_WIDTH } from '@web-stories-wp/units';
import { STORY_ANIMATION_STATE } from '@web-stories-wp/animation';

/**
 * Internal dependencies
 */
import { DESIGN_SPACE_MARGIN } from '../../constants';
import {
  useStory,
  useCanvas,
  useLayout,
  useTransform,
  useRightClickMenu,
} from '../../app';
import useCanvasKeys from '../../app/canvas/useCanvasKeys';
import PageMenu from './pagemenu';
import { Layer, MenuArea, NavNextArea, NavPrevArea, PageArea } from './layout';
import FrameElement from './frameElement';
import Selection from './selection';
import PageNav from './pagenav';

const FramesPageArea = styled(PageArea)`
  pointer-events: initial;
`;
const marginRatio = 100 * (DESIGN_SPACE_MARGIN / PAGE_WIDTH);
const DesignSpaceGuideline = styled.div`
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

function FramesLayer() {
  const { currentPage, isAnimating } = useStory((state) => ({
    currentPage: state.state.currentPage,
    isAnimating: [
      STORY_ANIMATION_STATE.PLAYING,
      STORY_ANIMATION_STATE.SCRUBBING,
    ].includes(state.state.animationState),
  }));
  const { setDesignSpaceGuideline } = useCanvas(
    ({ actions: { setDesignSpaceGuideline } }) => ({
      setDesignSpaceGuideline,
    })
  );

  const { isAnythingTransforming } = useTransform((state) => ({
    isAnythingTransforming: state.state.isAnythingTransforming,
  }));

  const framesLayerRef = useRef(null);
  useCanvasKeys(framesLayerRef);

  const { onOpenMenu } = useRightClickMenu();

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
  const { isEditing, hasEditMenu = false } = useCanvas(
    ({ state: { isEditing, editingElementState: { hasEditMenu } = {} } }) => ({
      isEditing,
      hasEditMenu,
    })
  );

  const isEditingWithMenu = isEditing && hasEditMenu;

  return (
    <Layer
      ref={framesLayerRef}
      data-testid="FramesLayer"
      pointerEvents="initial"
      // Use `-1` to ensure that there's a default target to focus if
      // there's no selection, but it's not reacheable by keyboard
      // otherwise.
      tabIndex="-1"
      aria-label={__('Frames layer', 'web-stories')}
    >
      {!isAnimating && (
        <FramesPageArea onContextMenu={onOpenMenu} onScroll={onScroll}>
          {currentPage &&
            currentPage.elements.map((element) => {
              return <FrameElement key={element.id} element={element} />;
            })}
          <DesignSpaceGuideline
            ref={setDesignSpaceGuideline}
            isVisible={isAnythingTransforming}
          />
        </FramesPageArea>
      )}
      <MenuArea
        pointerEvents="initial"
        // Make its own stacking context.
        zIndex={1}
        // Cancel lasso.
        onMouseDown={(evt) => evt.stopPropagation()}
      >
        {!isEditingWithMenu && <PageMenu />}
      </MenuArea>
      <NavPrevArea>
        <PageNav isNext={false} />
      </NavPrevArea>
      <NavNextArea>
        <PageNav />
      </NavNextArea>
      <Selection />
    </Layer>
  );
}

export default memo(FramesLayer);
