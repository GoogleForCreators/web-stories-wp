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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Internal dependencies
 */
import useStory from '../../../app/story/useStory';
import { TransformProvider } from '../../transform';
import { UnitsProvider } from '../../../units';
import DisplayElement from '../displayElement';
import generatePatternStyles from '../../../utils/generatePatternStyles';

export const THUMB_INDICATOR_HEIGHT = 6;
export const THUMB_INDICATOR_GAP = 4;

export const THUMB_FRAME_HEIGHT = THUMB_INDICATOR_HEIGHT + THUMB_INDICATOR_GAP;
export const THUMB_FRAME_WIDTH = 0;

const Page = styled.button`
  display: block;
  cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
  padding: ${THUMB_INDICATOR_GAP}px 0 0 0;
  border: 0;
  border-top: ${THUMB_INDICATOR_HEIGHT}px solid
    ${({ isActive, theme }) =>
      isActive ? theme.colors.selection : theme.colors.bg.v1};
  height: ${({ height }) => height}px;
  background-color: transparent;
  width: ${({ width }) => width}px;
  flex: none;
  transition: width 0.2s ease, height 0.2s ease;
  outline: 0;
  ${({ isActive, isInteractive, theme }) =>
    !isActive &&
    isInteractive &&
    css`
      &:hover,
      &:focus {
        border-top: ${THUMB_INDICATOR_HEIGHT}px solid
          ${rgba(theme.colors.selection, 0.3)};
      }
    `}
`;

const PreviewWrapper = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: white;
  ${({ background }) => generatePatternStyles(background)}
`;

function PagePreview({ index, ...props }) {
  const { pages } = useStory((state) => ({
    pages: state.state.pages,
  }));
  const page = pages[index];
  const { backgroundColor } = page;
  const { width: thumbWidth, height: thumbHeight } = props;
  const width = thumbWidth - THUMB_FRAME_WIDTH;
  const height = thumbHeight - THUMB_FRAME_HEIGHT;
  return (
    <UnitsProvider pageSize={{ width, height }}>
      <TransformProvider>
        <Page {...props}>
          <PreviewWrapper background={backgroundColor}>
            {page.elements.map(({ id, ...rest }) => (
              <DisplayElement
                key={id}
                previewMode={true}
                element={{ id, ...rest }}
                page={page}
              />
            ))}
          </PreviewWrapper>
        </Page>
      </TransformProvider>
    </UnitsProvider>
  );
}

PagePreview.propTypes = {
  index: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isInteractive: PropTypes.bool,
};

PagePreview.defaultProps = {
  isInteractive: true,
};

export default PagePreview;
