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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useFont } from '../../../app';
import StoryPropTypes from '../../../types';
import stripHTML from '../../../utils/stripHTML';
import { Text, themeHelpers } from '../../../../design-system';

const Preview = styled.button`
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

  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

const PreviewText = styled(Text).attrs({ forwardedAs: 'span' })`
  color: ${({ theme }) => theme.colors.fg.primary};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  font-family: ${({ fontFamily }) => fontFamily};
  line-height: normal;
`;

function FontPreview({ title, element, onClick }) {
  const { font, fontSize, fontWeight, content } = element;
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

  useEffect(() => {
    maybeEnqueueFontStyle([
      {
        font,
        fontWeight,
        content: stripHTML(content),
      },
    ]);
  }, [font, fontWeight, content, maybeEnqueueFontStyle]);

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
  onClick: PropTypes.func.isRequired,
};

export default FontPreview;
