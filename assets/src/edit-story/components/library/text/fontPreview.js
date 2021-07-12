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
import { useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Text } from '@web-stories-wp/design-system';
import { useFeature } from 'flagged';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useFont, useHistory } from '../../../app';
import StoryPropTypes from '../../../types';
import stripHTML from '../../../utils/stripHTML';
import { focusStyle } from '../../panels/shared';
import usePageAsCanvas from '../../../utils/usePageAsCanvas';
import useLibrary from '../useLibrary';

const Preview = styled.button`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  padding: 8px 16px;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: left;

  :hover {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }

  ${focusStyle};
`;

const PreviewText = styled(Text).attrs({ forwardedAs: 'span' })`
  color: ${({ theme }) => theme.colors.fg.primary};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  font-family: ${({ fontFamily }) => fontFamily};
  line-height: normal;
`;

function FontPreview({ title, element, insertPreset, getPosition }) {
  const { font, fontSize, fontWeight, content } = element;
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

  const {
    state: { versionNumber },
  } = useHistory();

  const { pageCanvasData } = useLibrary((state) => ({
    pageCanvasData: state.state.pageCanvasData,
  }));

  const { calculateAccessibleTextColors } = usePageAsCanvas();
  const enableSmartTextColor = useFeature('enableSmartTextColor');

  const presetDataRef = useRef({});

  useEffect(() => {
    maybeEnqueueFontStyle([
      {
        font,
        fontWeight,
        content: stripHTML(content),
      },
    ]);
  }, [font, fontWeight, content, maybeEnqueueFontStyle]);

  // Gets the position and the color already when hovering to use it directly when inserting.
  useLayoutEffect(() => {
    if (!pageCanvasData || !enableSmartTextColor) {
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
    calculateAccessibleTextColors(
      { ...element, ...atts },
      (autoColor) => {
        presetDataRef.current.autoColor = autoColor;
      },
      false /* isInserting */
    );
  }, [
    calculateAccessibleTextColors,
    element,
    getPosition,
    enableSmartTextColor,
    pageCanvasData,
    versionNumber,
  ]);

  const onClick = useCallback(() => {
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
  }, [insertPreset, element, title]);

  return (
    <Preview onClick={onClick}>
      <PreviewText font={font} fontSize={fontSize} fontWeight={fontWeight}>
        {title}
      </PreviewText>
    </Preview>
  );
}

FontPreview.propTypes = {
  title: PropTypes.string.isRequired,
  element: StoryPropTypes.textContent.isRequired,
  insertPreset: PropTypes.func.isRequired,
  getPosition: PropTypes.func.isRequired,
};

export default FontPreview;
