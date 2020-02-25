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
import { getDefinitionForType } from '../../elements';
import { useKeyDownEffect } from '../keyboard';
import { useStory } from '../../app';
import withOverlay from '../overlay/withOverlay';
import EditElement from './editElement';
import { Layer, PageArea } from './layout';
import useCanvas from './useCanvas';

const LayerWithGrayout = styled(Layer)`
  background-color: ${({ grayout, theme }) =>
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
  const ref = useRef(null);
  const {
    state: { currentPage },
  } = useStory();
  const {
    state: { editingElement: editingElementId },
    actions: { clearEditing },
  } = useCanvas();

  useKeyDownEffect(ref, { key: 'esc', editable: true }, () => clearEditing());

  const editingElement =
    editingElementId &&
    currentPage &&
    currentPage.elements.find((element) => element.id === editingElementId);

  if (!editingElement) {
    return null;
  }

  const { editModeGrayout } = getDefinitionForType(editingElement.type);

  return (
    <LayerWithGrayout ref={ref} grayout={editModeGrayout} pointerEvents="none">
      <EditPageArea>
        <EditElement element={editingElement} />
      </EditPageArea>
    </LayerWithGrayout>
  );
}

export default EditLayer;
