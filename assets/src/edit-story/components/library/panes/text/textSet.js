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
import DisplayElement from '../../../canvas/displayElement';
import { PAGE_HEIGHT, PAGE_WIDTH } from '../../../../constants';
import useBatchingCallback from '../../../../utils/useBatchingCallback';
import useLibrary from '../../useLibrary';

const ITEM_SIZE = 150;

const TextSetItem = styled.div`
  position: relative;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.white, 0.07)};
  border-radius: 4px;
  cursor: pointer;
`;

function TextSet({ elements, index }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const insertElements = useBatchingCallback(
    (toAdd) => {
      toAdd.forEach((e) => insertElement(e.type, e));
    },
    [insertElement]
  );

  return (
    <TextSetItem
      key={index}
      style={{ justifySelf: index % 2 === 0 ? 'start' : 'end' }}
      onClick={() => insertElements(elements)}
    >
      {elements.map(
        ({ id, content, x, y, textSetWidth, textSetHeight, ...rest }) => (
          <DisplayElement
            previewMode
            key={id}
            element={{
              id,
              content: `<span style="color: #fff">${content}<span>`,
              x: x + (PAGE_WIDTH - textSetWidth) / 2,
              y: y + (PAGE_HEIGHT - textSetHeight) / 2,
              ...rest,
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
