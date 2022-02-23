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
import { trackEvent } from '@googleforcreators/tracking';
import { useCallback, forwardRef, useState } from '@googleforcreators/react';
import { dataToEditorX, dataToEditorY } from '@googleforcreators/units';
import {
  BUTTON_TRANSITION_TIMING,
  ThemeGlobals,
  themeHelpers,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useLayout } from '../../../../../app/layout';
import { TEXT_SET_SIZE } from '../../../../../constants';
import useLibrary from '../../../useLibrary';
import LibraryMoveable from '../../shared/libraryMoveable';
import { useConfig } from '../../../../../app';
import InsertionOverlay from '../../shared/insertionOverlay';
import useRovingTabIndex from '../../../../../utils/useRovingTabIndex';
import TextSetElements from './textSetElements';

const TextSetItem = styled.button`
  border: 0;
  background: none;
  position: absolute;
  top: 0;
  height: ${TEXT_SET_SIZE}px;
  width: ${TEXT_SET_SIZE}px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transform: ${({ translateX, translateY }) =>
    `translateX(${translateX}px) translateY(${translateY}px)`};

  background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  cursor: pointer;
  transition: background-color ${BUTTON_TRANSITION_TIMING};
  outline: none;

  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} [role='presentation'],
  &[data-focus-visible-added] [role='presentation'] {
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
      )};
  }
`;

const TextSetImg = styled.img`
  width: ${TEXT_SET_SIZE}px;
  height: ${TEXT_SET_SIZE}px;
`;

const DragContainer = styled.div`
  position: absolute;
  opacity: 0;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.colors.opacity.white24};
`;

function TextSet(
  { id, elements, translateY, translateX, isActive, index, ...rest },
  ref
) {
  const { insertTextSet } = useLibrary((state) => ({
    insertTextSet: state.actions.insertTextSet,
  }));

  const { cdnURL } = useConfig();

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
    ({ code }) => {
      if (code === 'Enter' || code === 'Space') {
        onClick();
      }
    },
    [onClick]
  );

  const renderImages =
    typeof WEB_STORIES_DISABLE_OPTIMIZED_RENDERING === 'undefined' ||
    WEB_STORIES_DISABLE_OPTIMIZED_RENDERING !== 'true';

  useRovingTabIndex({ ref: ref.current });
  const [isHovering, setIsHovering] = useState(false);
  const setHovering = () => setIsHovering(true);
  const unsetHovering = () => setIsHovering(false);

  const { textSetHeight, textSetWidth } = elements[0];
  const dragWidth = dataToEditorX(textSetWidth, pageWidth);
  const dragHeight = dataToEditorY(textSetHeight, pageHeight);
  return (
    <TextSetItem
      translateX={translateX}
      translateY={translateY}
      ref={ref}
      onKeyUp={handleKeyboardPageClick}
      onPointerEnter={setHovering}
      onPointerLeave={unsetHovering}
      tabIndex={index === 0 ? 0 : -1}
      {...rest}
    >
      {renderImages ? (
        <TextSetImg
          src={`${cdnURL}images/text-sets/${id}.png`}
          alt=""
          crossOrigin="anonymous"
          decoding="async"
        />
      ) : (
        <TextSetElements isForDisplay elements={elements} />
      )}
      {(isActive || isHovering) && <InsertionOverlay />}
      <LibraryMoveable
        type={'textSet'}
        elements={elements}
        elementProps={{}}
        onClick={onClick}
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
  id: PropTypes.string.isRequired,
  elements: PropTypes.array.isRequired,
  translateY: PropTypes.number.isRequired,
  translateX: PropTypes.number.isRequired,
  isActive: PropTypes.bool,
  index: PropTypes.number,
};

TextSet.displayName = 'TextSet';

export default TextSetWithRef;
