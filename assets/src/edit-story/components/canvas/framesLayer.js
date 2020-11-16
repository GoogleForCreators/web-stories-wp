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
import { memo, useRef } from 'react';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { STORY_ANIMATION_STATE } from '../../../animation';
import { PAGE_WIDTH, DESIGN_SPACE_MARGIN } from '../../constants';
import { useStory, useDropTargets } from '../../app';
import withOverlay from '../overlay/withOverlay';
import PageMenu from './pagemenu';
import { Layer, MenuArea, NavNextArea, NavPrevArea, PageArea } from './layout';
import FrameElement from './frameElement';
import useCanvasKeys from './useCanvasKeys';
import Selection from './selection';
import useCanvas from './useCanvas';
import PageNav from './pagenav';

const FramesPageArea = withOverlay(
  styled(PageArea).attrs({
    showOverflow: true,
  })``
);

const FrameSidebar = styled.div`
  position: absolute;
  left: -200px;
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
  pointer-events: none;
`;

const Hint = styled.div`
  padding: 12px;
  color: ${({ theme }) => rgba(theme.colors.fg.white, 0.54)};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: 24px;
  text-align: right;
  background-color: ${({ theme }) => theme.colors.bg.workspace};
`;

const marginRatio = 100 * (DESIGN_SPACE_MARGIN / PAGE_WIDTH);
const DesignSpaceGuideline = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.callout};
  left: ${marginRatio}%;
  right: ${marginRatio}%;
  top: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  z-index: 1;
  visibility: hidden;
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
  const {
    state: { draggingResource, dropTargets },
    actions: { isDropSource },
  } = useDropTargets();

  const ref = useRef(null);
  useCanvasKeys(ref);

  return (
    <Layer
      ref={ref}
      data-testid="FramesLayer"
      pointerEvents="none"
      // Use `-1` to ensure that there's a default target to focus if
      // there's no selection, but it's not reacheable by keyboard
      // otherwise.
      tabIndex="-1"
      aria-label={__('Frames layer', 'web-stories')}
    >
      {!isAnimating && (
        <FramesPageArea
          overlay={
            Boolean(draggingResource) &&
            isDropSource(draggingResource.type) &&
            Object.keys(dropTargets).length > 0 && (
              <FrameSidebar>
                <Hint>
                  {__('Drop targets are outlined in blue.', 'web-stories')}
                </Hint>
              </FrameSidebar>
            )
          }
        >
          {currentPage &&
            currentPage.elements.map(({ id, ...rest }) => {
              return <FrameElement key={id} element={{ id, ...rest }} />;
            })}
          <DesignSpaceGuideline ref={setDesignSpaceGuideline} />
        </FramesPageArea>
      )}
      <MenuArea
        pointerEvents="initial"
        // Make its own stacking context.
        zIndex={1}
        // Cancel lasso.
        onMouseDown={(evt) => evt.stopPropagation()}
      >
        <PageMenu />
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
