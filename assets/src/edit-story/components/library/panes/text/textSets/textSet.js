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
import { rgba } from 'polished';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import DisplayElement from '../../../../canvas/displayElement';
import { PAGE_WIDTH, TEXT_SET_SIZE } from '../../../../../constants';
import useBatchingCallback from '../../../../../utils/useBatchingCallback';
import useLibrary from '../../../useLibrary';
import { useStory } from '../../../../../app/story';

const TextSetItem = styled.div`
  position: relative;
  width: ${TEXT_SET_SIZE}px;
  height: ${TEXT_SET_SIZE}px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.white, 0.07)};
  border-radius: 4px;
  cursor: pointer;
`;

function TextSet({ elements, index }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const { setSelectedElementsById } = useStory(
    ({ actions: { setSelectedElementsById } }) => {
      return {
        setSelectedElementsById,
      };
    }
  );
  const insertSet = useBatchingCallback(
    (toAdd) => {
      const addedElements = [];
      toAdd.forEach((element) => {
        const toInsert = {
          ...element,
          id: null,
        };
        // Remove all preview element data.
        delete toInsert.previewOffsetX;
        delete toInsert.previewOffsetY;
        delete toInsert.textSetWidth;
        delete toInsert.textSetHeight;
        addedElements.push(insertElement(element.type, toInsert));
      });
      // Select all added elements.
      setSelectedElementsById({
        elementIds: addedElements.map(({ id }) => id),
      });
    },
    [insertElement, setSelectedElementsById]
  );

  return (
    <TextSetItem
      role="listitem"
      key={index}
      style={{ justifySelf: index % 2 === 0 ? 'start' : 'end' }}
      onClick={() => insertSet(elements)}
    >
      {elements.map(
        ({
          id,
          content,
          previewOffsetX,
          previewOffsetY,
          textSetWidth,
          textSetHeight,
          ...rest
        }) => (
          <DisplayElement
            previewMode={true}
            key={id}
            element={{
              id,
              content: `<span style="color: #fff">${content}<span>`,
              ...rest,
              x: previewOffsetX + (PAGE_WIDTH - textSetWidth) / 2,
              y:
                previewOffsetY +
                (PAGE_WIDTH - textSetHeight) /
                  2 /* Use PAGE_WIDTH here since the area is square */,
            }}
          />
        )
      )}
    </TextSetItem>
  );
}

TextSet.propTypes = {
  elements: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
};

export default TextSet;
