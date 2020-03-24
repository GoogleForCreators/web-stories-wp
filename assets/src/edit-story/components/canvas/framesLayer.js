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
import { useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory, useDropTargets } from '../../app';
import withOverlay from '../overlay/withOverlay';
import { prettifyShortcut } from '../keyboard';
import { LinkGuidelines } from '../link';
import { Layer, PageArea } from './layout';
import FrameElement from './frameElement';
import Selection from './selection';
import useCanvasKeys from './useCanvasKeys';

const FramesPageArea = withOverlay(
  styled(PageArea).attrs({
    className: 'container',
    pointerEvents: 'initial',
  })``
);

const FrameSidebar = styled.div`
  position: absolute;
  left: -200px;
  width: 200px;
  z-index: 1;
  pointer-events: none;
`;

const Hint = styled.div`
  padding: 12px;
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: 24px;
  text-align: right;
`;

function FramesLayer() {
  const {
    state: { currentPage },
  } = useStory();
  const {
    state: { draggingResource },
    actions: { isDropSource },
  } = useDropTargets();

  const ref = useRef(null);
  useCanvasKeys(ref);

  return (
    <Layer
      ref={ref}
      pointerEvents="none"
      // Use `-1` to ensure that there's a default target to focus if
      // there's no selection, but it's not reacheable by keyboard
      // otherwise.
      tabIndex="-1"
    >
      <FramesPageArea>
        {currentPage &&
          currentPage.elements.map(({ id, ...rest }) => {
            return <FrameElement key={id} element={{ id, ...rest }} />;
          })}
        <Selection />
        {Boolean(draggingResource) && isDropSource(draggingResource.type) && (
          <FrameSidebar>
            <Hint>
              {sprintf(
                /* translators: %s: keyboard shortcut. */
                __(
                  'Drop targets are outlined in blue. Use %s to disable snapping.',
                  'web-stories'
                ),
                prettifyShortcut('mod')
              )}
            </Hint>
          </FrameSidebar>
        )}
        <LinkGuidelines />
      </FramesPageArea>
    </Layer>
  );
}

export default FramesLayer;
