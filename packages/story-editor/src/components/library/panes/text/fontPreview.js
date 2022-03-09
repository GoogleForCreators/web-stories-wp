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
import {
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
  useState,
} from '@googleforcreators/react';
import {
  Text,
  useKeyDownEffect,
  ThemeGlobals,
  themeHelpers,
} from '@googleforcreators/design-system';
import { trackEvent } from '@googleforcreators/tracking';
import { useUnits } from '@googleforcreators/units';
import { stripHTML } from '@googleforcreators/dom';
import { __, sprintf } from '@googleforcreators/i18n';
import { getHTMLFormatters } from '@googleforcreators/rich-text';

/**
 * Internal dependencies
 */
import { useFont, useHistory, useStory } from '../../../../app';
import StoryPropTypes from '../../../../types';
import usePageAsCanvas from '../../../../utils/usePageAsCanvas';
import useLibrary from '../../useLibrary';
import LibraryMoveable from '../shared/libraryMoveable';
import InsertionOverlay from '../shared/insertionOverlay';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';
import { areAllType, getTextInlineStyles } from '../../../../utils/presetUtils';
import objectWithout from '../../../../utils/objectWithout';
import getUpdatedSizeAndPosition from '../../../../utils/getUpdatedSizeAndPosition';

const Preview = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  padding: 8px 0px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: left;
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

const PreviewText = styled(Text).attrs({ forwardedAs: 'span' })`
  color: ${({ theme, isClone }) =>
    isClone ? theme.colors.standard.black : theme.colors.fg.primary};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  font-family: ${({ fontFamily }) => fontFamily};
  line-height: normal;
  margin: ${({ isClone }) => (isClone ? 0 : '0px 16px')};
`;

const DragContainer = styled.div`
  position: absolute;
  opacity: 0;
  background-color: ${({ theme }) => theme.colors.opacity.white24};
  width: ${({ width }) => width}px;
  line-height: ${({ lineHeight }) => lineHeight}px;
`;

function FontPreview({ title, element, insertPreset, getPosition, index }) {
  const htmlFormatters = getHTMLFormatters();
  const { font, fontSize, fontWeight, content } = element;
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

  const {
    state: { versionNumber },
  } = useHistory();

  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const { pageCanvasData, shouldUseSmartColor } = useLibrary((state) => ({
    pageCanvasData: state.state.pageCanvasData,
    shouldUseSmartColor: state.state.shouldUseSmartColor,
  }));

  const { calculateAccessibleTextColors } = usePageAsCanvas();

  const { isText, updateSelectedElements } = useStory(({ state, actions }) => ({
    isText: Boolean(
      state.selectedElements && areAllType('text', state.selectedElements)
    ),
    updateSelectedElements: actions.updateSelectedElements,
  }));

  const presetDataRef = useRef({});
  const buttonRef = useRef(null);

  useEffect(() => {
    maybeEnqueueFontStyle([
      {
        font,
        fontWeight,
        content: stripHTML(content),
      },
    ]);
  }, [font, fontWeight, content, maybeEnqueueFontStyle]);

  // Gets the position and the color already once the canvas information is available, to use it directly when inserting.
  useLayoutEffect(() => {
    async function getPositionAndColor() {
      if (!pageCanvasData || !shouldUseSmartColor) {
        return;
      }
      // If nothing changed meanwhile and we already have color data, don't make new calculations.
      if (
        presetDataRef.current.versionNumber === versionNumber &&
        presetDataRef.current.autoColor
      ) {
        return;
      }
      presetDataRef.current.versionNumber = versionNumber;
      const atts = getPosition(element);
      presetDataRef.current.positionAtts = atts;

      // If the element is positioned under the previous element (not default position),
      // no new image generation needed.
      if (atts.y !== element.y) {
        presetDataRef.current.skipCanvasGeneration = true;
      }

      presetDataRef.current.autoColor = await calculateAccessibleTextColors(
        { ...element, ...atts },
        false /* isInserting */
      );
    }
    getPositionAndColor();
  }, [
    calculateAccessibleTextColors,
    element,
    getPosition,
    shouldUseSmartColor,
    pageCanvasData,
    versionNumber,
  ]);

  const applyStyleOnContent = useCallback(
    (
      { fontWeight: newFontWeight, isItalic, isUnderline, letterSpacing },
      elContent
    ) => {
      elContent = htmlFormatters.setFontWeight(elContent, newFontWeight);
      elContent = htmlFormatters.toggleItalic(elContent, isItalic);
      elContent = htmlFormatters.toggleUnderline(elContent, isUnderline);
      elContent = htmlFormatters.setLetterSpacing(elContent, letterSpacing);
      return elContent;
    },
    [htmlFormatters]
  );

  const onClick = useCallback(() => {
    // If we have only text(s) selected, we apply the preset instead of inserting.
    if (isText) {
      updateSelectedElements({
        properties: (oldElement) => {
          const newContent = applyStyleOnContent(
            getTextInlineStyles(element.content),
            oldElement.content
          );
          const presetAtts = objectWithout(element, [
            'x',
            'y',
            'content',
            'width',
          ]);
          const sizeUpdates = getUpdatedSizeAndPosition({
            ...oldElement,
            ...presetAtts,
          });
          return {
            ...oldElement,
            ...presetAtts,
            ...sizeUpdates,
            content: newContent,
          };
        },
      });
      return;
    }
    // We might have pre-calculated data, let's use that, too.
    const isPositioned = Boolean(presetDataRef.current?.positionAtts);
    insertPreset(
      { ...element, ...presetDataRef.current?.positionAtts },
      {
        isPositioned,
        accessibleColors: presetDataRef.current?.autoColor,
        skipCanvasGeneration: presetDataRef.current?.skipCanvasGeneration,
      }
    );
    // Reset after insertion.
    presetDataRef.current = {};
    trackEvent('insert_text_preset', { name: title });
  }, [
    insertPreset,
    element,
    title,
    isText,
    updateSelectedElements,
    applyStyleOnContent,
  ]);

  const getTextDisplay = (textProps = {}) => {
    const { isClone } = textProps;
    return (
      <PreviewText
        font={font}
        fontSize={fontSize}
        fontWeight={fontWeight}
        {...textProps}
      >
        {isClone ? stripHTML(content) : title}
      </PreviewText>
    );
  };

  useKeyDownEffect(
    buttonRef,
    {
      key: ['enter', 'space'],
    },
    onClick,
    [onClick]
  );

  useRovingTabIndex({ ref: buttonRef });

  const [active, setActive] = useState(false);
  const makeActive = () => setActive(true);
  const makeInactive = () => setActive(false);

  return (
    <Preview
      ref={buttonRef}
      onPointerEnter={makeActive}
      onFocus={makeActive}
      onPointerLeave={makeInactive}
      onBlur={makeInactive}
      tabIndex={index === 0 ? 0 : -1}
      aria-label={
        isText
          ? sprintf(
              /* translators: %s: preset name */
              __('Apply preset: %s', 'web-stories'),
              title
            )
          : null
      }
    >
      {getTextDisplay()}
      {active && !isText && <InsertionOverlay />}
      <LibraryMoveable
        cloneElement={DragContainer}
        cloneProps={{
          children: getTextDisplay({
            fontSize: dataToEditorY(fontSize),
            isClone: true,
          }),
          width: dataToEditorX(element.width),
          lineHeight: Math.ceil(dataToEditorY(fontSize)),
        }}
        elementProps={element}
        type={'text'}
        onClick={onClick}
      />
    </Preview>
  );
}

FontPreview.propTypes = {
  title: PropTypes.string.isRequired,
  element: StoryPropTypes.textContent.isRequired,
  insertPreset: PropTypes.func.isRequired,
  getPosition: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default FontPreview;
