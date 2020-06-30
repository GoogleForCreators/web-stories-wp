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
import { useLayoutEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import MediaGallery from '../mediaGallery';
import { Pane } from '../../shared';
import paneId from './paneId';

const StyledPane = styled(Pane)`
  height: 100%;
  padding: 0;
  overflow: hidden;
`;

const Container = styled.div`
  overflow: scroll;
  height: 100%;
  padding: 0 1.5em 0 1.5em;
  margin-top: 1em;
`;

/**
 * Pane that contains the media 3P integrations.
 *
 * @param {Object} props Component props
 * @return {*} The media pane element for 3P integrations.
 */
function Media3pPane(props) {
  // TODO(#1698): Ensure scrollbars auto-disappear in MacOS.
  // State and callback ref necessary to recalculate the padding of the list
  //  given the scrollbar width.
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  let container = null;
  const refContainer = (element) => {
    if (!element) {
      return;
    }
    container = element;
    setScrollbarWidth(element.offsetWidth - element.clientWidth);
  };

  // TODO(#2368): get resources from useMedia
  // TODO(#2368): handle pagination / infinite scrolling
  const resources = [];

  // Recalculates padding of Media Pane so it stays centered.
  // As of May 2020 this cannot be achieved without js (as the scrollbar-gutter
  // prop is not yet ready).
  useLayoutEffect(() => {
    if (!scrollbarWidth) {
      return;
    }
    const currentPaddingLeft = parseFloat(
      window.getComputedStyle(container, null).getPropertyValue('padding-left')
    );
    container.style['padding-right'] =
      currentPaddingLeft - scrollbarWidth + 'px';
  }, [scrollbarWidth, container]);

  // Callback for when a media element is selected.
  const onInsert = () => {};

  return (
    <StyledPane id={paneId} {...props}>
      <Container ref={refContainer}>
        <MediaGallery
          resources={resources}
          onInsert={onInsert}
          isMedia3p={true}
        />
      </Container>
    </StyledPane>
  );
}

export default Media3pPane;
