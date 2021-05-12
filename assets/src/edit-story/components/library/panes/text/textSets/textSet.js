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
import PropTypes from 'prop-types';
import { trackEvent } from '@web-stories-wp/tracking';
import { useCallback, forwardRef } from 'react';

/**
 * Internal dependencies
 */
import {
  BUTTON_TRANSITION_TIMING,
  ThemeGlobals,
} from '../../../../../../design-system';
import { useLayout } from '../../../../../app/layout';
import { TEXT_SET_SIZE } from '../../../../../constants';
import useLibrary from '../../../useLibrary';
import { dataToEditorX, dataToEditorY } from '../../../../../units';
import LibraryMoveable from '../../shared/libraryMoveable';
import { focusStyle } from '../../../../panels/shared';
import TextSetElements from './textSetElements';

const TextSetItem = styled.div`
  position: absolute;
  top: 0;
  height: ${TEXT_SET_SIZE}px;
  width: ${TEXT_SET_SIZE}px;
  display: flex;
  flex-direction: column;
  transform: ${({ translateX, translateY }) =>
    `translateX(${translateX}px) translateY(${translateY}px)`};

  ${focusStyle};

  background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  cursor: pointer;
  transition: background-color ${BUTTON_TRANSITION_TIMING};

  &:hover,
  &:focus,
  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }
  &:active {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryPress};
  }
`;

const DragContainer = styled.div`
  position: absolute;
  opacity: 0;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.opacity.white24};
`;

function TextSet({ elements, translateY, translateX, ...rest }, ref) {
  const { insertTextSet } = useLibrary((state) => ({
    insertTextSet: state.actions.insertTextSet,
  }));

  const { pageWidth, pageHeight } = useLayout(
    ({ state: { pageWidth, pageHeight } }) => ({
      pageWidth,
      pageHeight,
    })
  );

  const onClick = useCallback(() => {
    insertTextSet(elements);
    trackEvent('insert_textset');
  }, [elements, insertTextSet]);

  const handleKeyboardPageClick = useCallback(
    ({ key }) => {
      if (key === 'Enter') {
        onClick();
      }
    },
    [onClick]
  );

  const { textSetHeight, textSetWidth } = elements[0];
  const dragWidth = dataToEditorX(textSetWidth, pageWidth);
  const dragHeight = dataToEditorY(textSetHeight, pageHeight);
  return (
    <TextSetItem
      role="listitem"
      tabIndex={0}
      translateX={translateX}
      translateY={translateY}
      ref={ref}
      onKeyUp={handleKeyboardPageClick}
      {...rest}
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

const TextSetWithRef = forwardRef(TextSet);

TextSet.propTypes = {
  elements: PropTypes.array.isRequired,
  translateY: PropTypes.number.isRequired,
  translateX: PropTypes.number.isRequired,
};

TextSet.displayName = 'TextSet';

export default TextSetWithRef;
