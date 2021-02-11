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
import StoryPropTypes from '../../types';
import { TransformProvider } from '../transform';
import { UnitsProvider } from '../../units';
import DisplayElement from '../canvas/displayElement';
import generatePatternStyles from '../../utils/generatePatternStyles';

const Page = styled.button`
  display: block;
  position: relative;
  cursor: ${({ isInteractive }) => (isInteractive ? 'pointer' : 'default')};
  padding: 0;
  border: 0;
  background-color: transparent;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  flex: none;
  outline: 0;

  &::after {
    content: '';
    display: block;
    position: absolute;
    left: -4px;
    right: -4px;
    top: -4px;
    bottom: -4px;
    pointer-events: none;
    border-style: solid;
    border-width: 1px;
    border-radius: 8px;
    border-color: ${({ isActive, theme }) =>
      isActive ? theme.DEPRECATED_THEME.colors.fg.primary : 'transparent'};
  }

  ${({ isInteractive, isActive, theme }) =>
    isInteractive &&
    css`
      &:focus::after {
        border-color: ${rgba(
          theme.DEPRECATED_THEME.colors.selection,
          isActive ? 1 : 0.7
        )};
      }
    `}
`;

const PreviewWrapper = styled.div`
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: white;
  border-radius: 4px;
  ${({ background }) => generatePatternStyles(background)}
`;

function CarouselPagePreview({ page, ...props }) {
  const { backgroundColor } = page;
  const { width, height } = props;

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

CarouselPagePreview.propTypes = {
  page: StoryPropTypes.page.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isInteractive: PropTypes.bool,
  isActive: PropTypes.bool,
  tabIndex: PropTypes.number,
};

export default CarouselPagePreview;
