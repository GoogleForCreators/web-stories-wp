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
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import { useLayout } from '../../../../../app/layout';
import { TEXT_SET_SIZE } from '../../../../../constants';
import { KEYBOARD_USER_SELECTOR } from '../../../../../utils/keyboardOnlyOutline';
import useLibrary from '../../../useLibrary';
import { dataToEditorX, dataToEditorY } from '../../../../../units';
import LibraryMoveable from '../../shared/libraryMoveable';
import TextSetElements from './textSetElements';

const TextSetItem = styled.div`
  position: relative;
  width: ${TEXT_SET_SIZE}px;
  height: ${TEXT_SET_SIZE}px;
  background-color: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.bg.white, 0.07)};
  border-radius: 4px;
  cursor: pointer;
  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: -webkit-focus-ring-color auto 2px;
  }
`;

const DragContainer = styled.div`
  position: absolute;
  opacity: 0;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.bg.white, 0.2)};
`;

function TextSet({ elements }) {
  const { insertTextSet } = useLibrary((state) => ({
    insertTextSet: state.actions.insertTextSet,
  }));

  const { canvasPageSize } = useLayout(({ state }) => ({
    canvasPageSize: state.canvasPageSize,
  }));

  const onClick = useCallback(() => {
    insertTextSet(elements);
    trackEvent('insert_textset', 'editor');
  }, [elements, insertTextSet]);

  const { textSetHeight, textSetWidth } = elements[0];
  const { width: pageWidth, height: pageHeight } = canvasPageSize;
  const dragWidth = dataToEditorX(textSetWidth, pageWidth);
  const dragHeight = dataToEditorY(textSetHeight, pageHeight);
  return (
    <TextSetItem
      role="listitem"
      aria-label={__('Insert Text Set', 'web-stories')}
    >
      <TextSetElements isForDisplay elements={elements} />
      <LibraryMoveable
        type={'textSet'}
        elements={elements}
        elementProps={{}}
        onClick={onClick}
        previewSize={{
          width: TEXT_SET_SIZE,
          height: TEXT_SET_SIZE,
        }}
        cloneElement={DragContainer}
        cloneProps={{
          width: dragWidth,
          height: dragHeight,
          children: (
            <TextSetElements
              elements={elements}
              pageSize={{
                width: pageWidth,
                height: pageHeight,
              }}
            />
          ),
        }}
      />
    </TextSetItem>
  );
}

TextSet.propTypes = {
  elements: PropTypes.array.isRequired,
};

export default TextSet;
