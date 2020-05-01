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

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import useCanvas from './useCanvas';
import DisplayElement from './displayElement';
import { Layer, PageArea } from './layout';

const DisplayPageArea = styled(PageArea).attrs({
  className: 'container web-stories-content',
  overflowAllowed: false,
  showDangerZone: true,
})`
  background-color: white;
  background-image: linear-gradient(45deg, #999999 25%, transparent 25%),
    linear-gradient(-45deg, #999999 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #999999 75%),
    linear-gradient(-45deg, transparent 75%, #999999 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

function DisplayLayer() {
  const {
    state: { currentPage },
  } = useStory();
  const {
    state: { editingElement },
    actions: { setPageContainer },
  } = useCanvas();

  return (
    <Layer pointerEvents="none">
      <DisplayPageArea ref={setPageContainer}>
        {currentPage
          ? currentPage.elements.map(({ id, ...rest }) => {
              if (editingElement === id) {
                return null;
              }
              return (
                <DisplayElement
                  key={id}
                  element={{ id, ...rest }}
                  page={currentPage}
                />
              );
            })
          : null}
      </DisplayPageArea>
    </Layer>
  );
}

export default DisplayLayer;
