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
 * Internal dependencies
 */
import { useStory } from '../../app';
import withOverlay from '../overlay/withOverlay';
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

function FramesLayer() {
  const {
    state: { currentPage },
  } = useStory();

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
      </FramesPageArea>
    </Layer>
  );
}

export default FramesLayer;
