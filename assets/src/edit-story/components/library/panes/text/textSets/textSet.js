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
import { useCallback, useRef } from 'react';
import { rgba } from 'polished';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useLayout } from '../../../../../app/layout';
import { PAGE_RATIO, TEXT_SET_SIZE } from '../../../../../constants';
import { KEYBOARD_USER_SELECTOR } from '../../../../../utils/keyboardOnlyOutline';
import useLibrary from '../../../useLibrary';
import { dataToEditorX, dataToEditorY } from '../../../../../units';
import TextSetElements from './textSetElements';

const TextSetItem = styled.button`
  border: 0;
  outline: 0;
  position: relative;
  width: ${TEXT_SET_SIZE}px;
  height: ${TEXT_SET_SIZE}px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.white, 0.07)};
  border-radius: 4px;
  cursor: pointer;
  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: -webkit-focus-ring-color auto 2px;
  }
`;

const DragWrapper = styled.div.attrs({
  role: 'listitem',
})``;

const DragContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => rgba(theme.colors.bg.white, 0.2)};
`;

function TextSet({ elements }) {
  const { insertTextSet } = useLibrary((state) => ({
    insertTextSet: state.actions.insertTextSet,
  }));

  const elementRef = useRef();

  const { canvasPageSize } = useLayout(({ state }) => ({
    canvasPageSize: state.canvasPageSize,
  }));

  const handleDragStart = useCallback(
    (e) => {
      const { x, y } = e.target.getBoundingClientRect();
      const offsetX = e.clientX - x;
      const offsetY = e.clientY - y;

      e.dataTransfer.setDragImage(elementRef.current, offsetX, offsetY);
      e.dataTransfer.setData(
        'textset',
        JSON.stringify({
          grabOffsetX: -offsetX,
          grabOffsetY: -offsetY,
          elements,
        })
      );
    },
    [elements]
  );

  const { textSetHeight, textSetWidth } = elements[0];
  const { width: pageWidth, height: pageHeight } = canvasPageSize;
  const dragWidth = dataToEditorX(textSetWidth, pageWidth);
  const dragHeight = dataToEditorY(textSetHeight, pageHeight);

  return (
    <DragWrapper>
      <DragContainer ref={elementRef} width={dragWidth} height={dragHeight}>
        <TextSetElements
          elements={elements}
          pageSize={{
            width: pageWidth,
            height: pageHeight,
          }}
        />
      </DragContainer>
      <TextSetItem
        role="listitem"
        draggable={true}
        onDragStart={handleDragStart}
        aria-label={__('Insert Text Set', 'web-stories')}
        onClick={() => insertTextSet(elements)}
      >
        <TextSetElements
          isForDisplay
          elements={elements}
          pageSize={{
            width: TEXT_SET_SIZE,
            height: TEXT_SET_SIZE / PAGE_RATIO,
          }}
        />
      </TextSetItem>
    </DragWrapper>
  );
}

TextSet.propTypes = {
  elements: PropTypes.array.isRequired,
};

export default TextSet;
