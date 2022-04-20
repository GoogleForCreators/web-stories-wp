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
import { useFont, useStory } from '../../../../app';
import { useCalculateAccessibleTextColors } from '../../../../app/pageCanvas';
import StoryPropTypes from '../../../../types';
import useLibrary from '../../useLibrary';
import LibraryMoveable from '../shared/libraryMoveable';
import InsertionOverlay from '../shared/insertionOverlay';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';
import { areAllType, getTextInlineStyles } from '../../../../utils/presetUtils';
import objectWithout from '../../../../utils/objectWithout';
import getUpdatedSizeAndPosition from '../../../../utils/getUpdatedSizeAndPosition';
import { focusStyle } from '../../../panels/shared/styles';

// If text is selected, there's no `+` icon displayed and we display the focus style on the button directly.
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

  ${({ isTextSelected }) => (isTextSelected ? focusStyle : 'outline: none;')}

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
  const { font, fontSize, content } = element;
  const { fontWeight } = getTextInlineStyles(content);
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const { shouldUseSmartColor } = useLibrary((state) => ({
    shouldUseSmartColor: state.state.shouldUseSmartColor,
  }));

  const calculateAccessibleTextColors = useCalculateAccessibleTextColors();

  const { isTextSelected, updateSelectedElements } = useStory(
    ({ state, actions }) => ({
      isTextSelected: areAllType('text', state.selectedElements),
      updateSelectedElements: actions.updateSelectedElements,
    })
  );

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

  const onClick = useCallback(async () => {
    // If we have only text(s) selected, we apply the preset instead of inserting.
    if (isTextSelected) {
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

    let newElement = element;
    const insertOpts = {
      isPositioned: false,
    };
    if (shouldUseSmartColor) {
      const position = getPosition(element);
      insertOpts.isPositioned = true;
      newElement = {
        ...element,
        ...position,
      };
      insertOpts.accessibleColors = await calculateAccessibleTextColors(
        newElement
      );
    }
    insertPreset(newElement, insertOpts);
    trackEvent('insert_text_preset', { name: title });
  }, [
    isTextSelected,
    getPosition,
    element,
    shouldUseSmartColor,
    insertPreset,
    title,
    updateSelectedElements,
    applyStyleOnContent,
    calculateAccessibleTextColors,
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
      isTextSelected={isTextSelected}
      aria-label={
        isTextSelected
          ? sprintf(
              /* translators: %s: preset name */
              __('Apply preset: %s', 'web-stories'),
              title
            )
          : null
      }
    >
      {getTextDisplay()}
      {active && !isTextSelected && <InsertionOverlay />}
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
