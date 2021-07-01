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
import { useEffect, useState } from 'react';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';
import { Icons } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import usePageAsCanvas from '../../../../utils/usePageAsCanvas';
import { BACKGROUND_TEXT_MODE } from '../../../../constants';
import { applyHiddenPadding } from '../../../panels/design/textBox/utils';
import { getHTMLFormatters } from '../../../richText/htmlManipulation';
import { DEFAULT_PRESET } from './textPresets';

const AnimatedTextIcon = styled(({ isSecondary, ...rest }) => (
  // Necessary because of https://github.com/styled-components/styled-components/pull/2093
  <Icons.LetterT {...rest} />
)).attrs(({ isSecondary }) => ({
  style: {
    // scales 14px to 11px
    transform: isSecondary ? 'scale(0.78)' : 'none',
  },
}))``;

const AnimatedTextAddIcon = styled(({ isPrimary, ...rest }) => (
  // Necessary because of https://github.com/styled-components/styled-components/pull/2093
  <Icons.PlusFilled {...rest} />
)).attrs(({ isPrimary }) => ({
  style: {
    // scales 12px to 16px
    transform: isPrimary ? 'scale(1.33)' : 'none',
  },
}))``;

const QuickAction = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  line-height: 1;
  cursor: pointer;
  flex: 1;
  width: 22px;
  svg {
    width: 24px;
  }
`;

const IconWrapper = styled.div`
  margin: 0;
  flex: 1;
  width: 24px;
`;

const TextIconContainer = styled.div`
  display: flex;
  cursor: pointer;
  border: 0;
  padding: 0;
  margin: 0 -4px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

function TextIcon(props) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const [isHoveringQuick, setIsHoveringQuick] = useState(false);
  const [isFocusingQuick, setIsFocusingQuick] = useState(false);

  const [autoColor, setAutoColor] = useState(null);
  const { calculateAccessibleTextColors, generateCanvasFromPage } =
    usePageAsCanvas();

  const htmlFormatters = getHTMLFormatters();
  const { setColor } = htmlFormatters;

  useEffect(() => {
    if (autoColor) {
      // Add all the necessary props in case of color / highlight.
      const { content } = DEFAULT_PRESET;
      const { color, backgroundColor } = autoColor;
      const highlightProps = backgroundColor
        ? {
            backgroundColor: { color: backgroundColor },
            backgroundTextMode: BACKGROUND_TEXT_MODE.HIGHLIGHT,
            padding: applyHiddenPadding(DEFAULT_PRESET),
          }
        : null;
      insertElement('text', {
        ...DEFAULT_PRESET,
        content: color ? setColor(content, { color }) : content,
        ...highlightProps,
      });
      setAutoColor(null);
    }
  }, [autoColor, insertElement, setColor]);

  const handleAddText = (evt) => {
    evt.stopPropagation();
    calculateAccessibleTextColors(DEFAULT_PRESET, setAutoColor);
    trackEvent('library_text_quick_action');
  };
  const { isActive } = props;
  return (
    <TextIconContainer>
      <IconWrapper>
        <AnimatedTextIcon
          id="text-tab-icon"
          isSecondary={isHoveringQuick || isFocusingQuick}
          aria-label={__('Text library', 'web-stories')}
          onPointerOver={() => setIsHoveringQuick(false)}
        />
      </IconWrapper>
      <QuickAction
        aria-label={__('Add new text element', 'web-stories')}
        onClick={handleAddText}
        tabIndex={isActive ? 0 : -1}
        onFocus={() => setIsFocusingQuick(true)}
        onBlur={() => setIsFocusingQuick(false)}
        onPointerOver={() => {
          generateCanvasFromPage();
          setIsHoveringQuick(true);
        }}
      >
        <AnimatedTextAddIcon isPrimary={isHoveringQuick || isFocusingQuick} />
      </QuickAction>
    </TextIconContainer>
  );
}

TextIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default TextIcon;
