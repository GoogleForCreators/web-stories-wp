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
import { rgba } from 'polished';
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useFont } from '../../../app';
import { ALLOWED_EDITOR_PAGE_WIDTHS, PAGE_WIDTH } from '../../../constants';
import StoryPropTypes from '../../../types';
import stripHTML from '../../../utils/stripHTML';

const PREVIEW_EM_SCALE = ALLOWED_EDITOR_PAGE_WIDTHS[0] / PAGE_WIDTH;

const Preview = styled.button`
  background: ${({ theme }) =>
    rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.1)};
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 4px;
  width: 100%;
  border: none;
  cursor: pointer;
  text-align: left;
`;

const Text = styled.span`
  background: none;
  font-size: ${({ fontSize }) => fontSize * PREVIEW_EM_SCALE}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  font-family: ${({ fontFamily }) => fontFamily};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
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
      <Text
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily={font.family}
      >
        {title}
      </Text>
    </Preview>
  );
}

FontPreview.propTypes = {
  title: PropTypes.string.isRequired,
  element: StoryPropTypes.textContent.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default FontPreview;
