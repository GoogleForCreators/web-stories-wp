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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useState } from 'react';
import { getDefinitionForType } from '../../elements';
import {
  elementWithPosition,
  elementWithSize,
  elementWithRotation,
} from '../../elements/shared';
import { useUnits } from '../../units';
import useCanvas from './useCanvas';
import SingleSelectionMovable from './singleSelectionMovable';

// Background color is used to make the edited element more prominent and
// easier to see.
const Wrapper = styled.div`
	${elementWithPosition}
	${elementWithSize}
	${elementWithRotation}
	pointer-events: initial;
	background-color: ${({ theme }) => theme.colors.whiteout};
`;

function EditElement({ element }) {
  const { id, type } = element;
  const { getBox } = useUnits((state) => ({
    getBox: state.actions.getBox,
  }));

  const [editWrapper, setEditWrapper] = useState(null);

  const { lastSelectionEvent } = useCanvas(
    ({ state: { lastSelectionEvent } }) => ({
      lastSelectionEvent,
    })
  );

  const { Edit, hasEditModeMovable } = getDefinitionForType(type);
  const box = getBox(element);

  return (
    <>
      <Wrapper
        aria-labelledby={`layer-${id}`}
        {...box}
        onMouseDown={(evt) => evt.stopPropagation()}
        ref={setEditWrapper}
      >
        <Edit element={element} box={box} />
      </Wrapper>
      {hasEditModeMovable && (
        <SingleSelectionMovable
          selectedElement={element}
          targetEl={editWrapper}
          pushEvent={lastSelectionEvent}
          isEditMode={true}
        />
      )}
    </>
  );
}

EditElement.propTypes = {
  element: PropTypes.object.isRequired,
};

export default EditElement;
