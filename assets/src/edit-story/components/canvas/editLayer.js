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
import {getDefinitionForType} from '../../elements';
import {useStory} from '../../app';
import withOverlay from '../overlay/withOverlay';
import EditElement from './editElement';
import {Layer, PageArea} from './layout';
import useCanvas from './useCanvas';

const LayerWithGrayout = styled(Layer)`
  background-color:
    ${({grayout,
    theme}) =>
    grayout ? theme.colors.grayout : 'transparent'};
`;

const EditPageArea = withOverlay(styled(PageArea).attrs({
  className: 'container',
})`
  position: relative;
  width: 100%;
  height: 100%;
`);

function EditLayer({}) {
  const {
    state: {currentPage},
  } = useStory();
  const {
    state: {editingElement: editingElementId},
  } = useCanvas();

  const editingElement =
    editingElementId &&
    currentPage &&
    currentPage.elements.find(element => element.id === editingElementId);

  if (!editingElement) {
    return null;
  }

  const {editModeGrayout} = getDefinitionForType(editingElement.type);

  return (
    <LayerWithGrayout grayout={editModeGrayout} pointerEvents={false}>
      <EditPageArea>
        <EditElement element={editingElement} />
      </EditPageArea>
    </LayerWithGrayout>
  );
}

export default EditLayer;
