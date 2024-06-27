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
import { useRef, useEffect } from '@googleforcreators/react';
import { useUnits } from '@googleforcreators/units';
import { areEventsDragging } from '@googleforcreators/moveable';
import type { TextElement, TextElementFont } from '@googleforcreators/elements';
import { getCaretCharacterOffsetWithin } from '@googleforcreators/rich-text';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithFont,
  elementWithTextParagraphStyle,
} from '../shared';
import type { FrameProps } from '../types';
import { generateParagraphTextStyle } from './util';

const Element = styled.p<{
  font: TextElementFont;
  fontSize: string | number;
  fontWeight?: string | number;
  margin: number | string;
  padding?: number | string;
  lineHeight: number;
  textAlign: string;
}>`
  ${elementFillContent}
  ${elementWithFont}
  ${elementWithTextParagraphStyle}

  opacity: 0;
  user-select: none;
`;

function TextFrame({
  element,
  element: { id, content, isLocked, ...rest },
  wrapperRef,
  setEditingElementWithState,
  isOnlySelectedElement,
}: FrameProps<TextElement>) {
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

  const elementRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!isOnlySelectedElement) {
      return undefined;
    }

    const wrapper = wrapperRef.current;
    const elementNode = elementRef.current;

    let clickTime = 0;
    let clickCoordinates: { clientX: number; clientY: number } | null = null;

    const handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.metaKey || evt.altKey || evt.ctrlKey || isLocked) {
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

    const handleMouseDown = (evt: MouseEvent) => {
      clickTime = evt.timeStamp;
      clickCoordinates = {
        clientX: evt.clientX,
        clientY: evt.clientY,
      };
    };

    const handleMouseUp = (evt: MouseEvent) => {
      if (
        isLocked ||
        !clickCoordinates ||
        areEventsDragging(
          {
            timeStamp: clickTime,
            ...clickCoordinates,
          } as MouseEvent,
          evt
        )
      ) {
        // Abort early as this is part of a user dragging
        return;
      }

      // Enter editing mode and place cursor at current selection offset
      evt.stopPropagation();
      setEditingElementWithState(id, {
        offset: elementRef.current
          ? getCaretCharacterOffsetWithin(
              elementRef.current,
              evt.clientX,
              evt.clientY
            )
          : 0,
      });
    };

    wrapper?.addEventListener('keydown', handleKeyDown);
    elementNode?.addEventListener('mousedown', handleMouseDown);
    elementNode?.addEventListener('mouseup', handleMouseUp);
    return () => {
      wrapper?.removeEventListener('keydown', handleKeyDown);
      elementNode?.removeEventListener('mousedown', handleMouseDown);
      elementNode?.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    id,
    wrapperRef,
    isOnlySelectedElement,
    setEditingElementWithState,
    isLocked,
  ]);

  return (
    <Element
      ref={elementRef}
      data-testid="textFrame"
      // data-fix-caret is for allowing caretRangeFromPoint to work in Safari.
      // See https://github.com/googleforcreators/web-stories-wp/issues/7745.
      data-fix-caret
      className="syncMargin"
      dangerouslySetInnerHTML={{ __html: content }}
      {...props}
    />
  );
}

export default TextFrame;
