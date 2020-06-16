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
import { useStory, useDropTargets } from '../../app';
import withOverlay from '../overlay/withOverlay';
import PageMenu from './pagemenu';
import { Layer, MenuArea, PageArea } from './layout';
import FrameElement from './frameElement';
import Selection from './selection';
import useCanvasKeys from './useCanvasKeys';

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
  color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.54)};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: 24px;
  text-align: right;
  background-color: ${({ theme }) => theme.colors.bg.v1};
`;

function FramesLayer() {
  const { currentPage } = useStory((state) => ({
    currentPage: state.state.currentPage,
  }));
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
    >
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
        fullbleed={<Selection />}
      >
        {currentPage &&
          currentPage.elements.map(({ id, ...rest }) => {
            return <FrameElement key={id} element={{ id, ...rest }} />;
          })}
      </FramesPageArea>
      <MenuArea
        pointerEvents="initial"
        // Make its own stacking context.
        zIndex={1}
        // Cancel lasso.
        onMouseDown={(evt) => evt.stopPropagation()}
      >
        <PageMenu />
      </MenuArea>
    </Layer>
  );
}

export default memo(FramesLayer);
