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
import { DEFAULT_EDITOR_PAGE_HEIGHT, PAGE_HEIGHT } from '../../../constants';
import { FontPropType } from '../../../types';

const PREVIEW_EM_SCALE = DEFAULT_EDITOR_PAGE_HEIGHT / PAGE_HEIGHT;

const Preview = styled.div`
  position: relative;
  background: ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Text = styled.span`
  background: none;
  font-size: ${({ fontSize }) => fontSize * PREVIEW_EM_SCALE}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  font-family: ${({ fontFamily }) => fontFamily};
  color: ${({ theme }) => theme.colors.fg.v1};
`;

function FontPreview({ title, font, fontSize, fontWeight }) {
  const {
    actions: { maybeEnqueueFontStyle },
  } = useFont();

  useEffect(() => {
    maybeEnqueueFontStyle(font);
  }, [font, maybeEnqueueFontStyle]);

  return (
    <Preview>
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
  title: PropTypes.string,
  font: FontPropType,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.number,
};

export default FontPreview;
