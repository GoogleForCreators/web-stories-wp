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
import { useRef, useEffect } from '@googleforcreators/react';
import { useUnits } from '@googleforcreators/units';
import { areEventsDragging } from '@googleforcreators/moveable';
import { StoryPropTypes } from '@googleforcreators/elements';
import { getCaretCharacterOffsetWithin } from '@googleforcreators/rich-text';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithFont,
  elementWithTextParagraphStyle,
} from '../shared';
import { generateParagraphTextStyle } from './util';

const Element = styled.p`
  ${elementFillContent}
  ${elementWithFont}
  ${elementWithTextParagraphStyle}

  opacity: 0;
  user-select: none;
`;

function TextFrame({
  element,
  element: { id, content, ...rest },
  wrapperRef,
  setEditingElementWithState,
  selectedElementIds,
}) {
  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));
  const props = generateParagraphTextStyle(
    rest,
    (x) => `${dataToEditorX(x)}px`,
    (y) => `${dataToEditorY(y)}px`,
    dataToEditorY,
    element
  );
  const isElementSelected = selectedElementIds.includes(id);
  const isElementOnlySelection =
    isElementSelected && selectedElementIds.length === 1;

  const elementRef = useRef();

  useEffect(() => {
    if (!isElementOnlySelection) {
      return undefined;
    }

    const wrapper = wrapperRef.current;
    const elementNode = elementRef.current;

    let clickTime = 0;
    let clickCoordinates = null;

    const handleKeyDown = (evt) => {
      if (evt.metaKey || evt.altKey || evt.ctrlKey) {
        // Some modifier (except shift) was pressed. Ignore and bubble
        return;
      }

      if (evt.key === 'Enter' || /^\w$/.test(evt.key)) {
        // TODO: in above check all printable characters across alphabets, no just a-z0-9 as \w regex is
        // Enter on editing mode. When inserting content, first letter will be correctly inserted from keyup
        setEditingElementWithState(id, { selectAll: true });
        evt.stopPropagation();
        // Make sure no actual Enter is pressed
        if (evt.key === 'Enter') {
          evt.preventDefault();
        }
      }
    };

    const handleMouseDown = (evt) => {
      clickTime = evt.timeStamp;
      clickCoordinates = {
        clientX: evt.clientX,
        clientY: evt.clientY,
      };
    };

    const handleMouseUp = (evt) => {
      if (
        !clickCoordinates ||
        areEventsDragging(
          {
            timeStamp: clickTime,
            ...clickCoordinates,
          },
          evt
        )
      ) {
        // Abort early as this is part of a user dragging
        return;
      }

      // Enter editing mode and place cursor at current selection offset
      evt.stopPropagation();
      setEditingElementWithState(id, {
        offset: getCaretCharacterOffsetWithin(
          elementRef.current,
          evt.clientX,
          evt.clientY
        ),
      });
    };

    wrapper.addEventListener('keydown', handleKeyDown);
    elementNode.addEventListener('mousedown', handleMouseDown);
    elementNode.addEventListener('mouseup', handleMouseUp);
    return () => {
      wrapper.removeEventListener('keydown', handleKeyDown);
      elementNode.removeEventListener('mousedown', handleMouseDown);
      elementNode.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, wrapperRef, isElementOnlySelection, setEditingElementWithState]);

  // data-fix-caret is for allowing caretRangeFromPoint to work in Safari.
  // See https://github.com/googleforcreators/web-stories-wp/issues/7745.
  return (
    <Element
      ref={elementRef}
      data-testid="textFrame"
      data-fix-caret
      className="syncMargin"
      dangerouslySetInnerHTML={{ __html: content }}
      element={element}
      {...props}
    />
  );
}

TextFrame.propTypes = {
  element: StoryPropTypes.elements.text.isRequired,
  wrapperRef: PropTypes.object.isRequired,
  setEditingElementWithState: PropTypes.func,
  selectedElementIds: PropTypes.array,
};

export default TextFrame;
