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

/**
 * Internal dependencies
 */
import { FULLBLEED_RATIO } from '../../../constants/pageStructure';

export const STORY_WIDTH = 275;

export const PageContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  padding: 20px;
`;

export const ActiveCard = styled.div(
  ({ theme, height, width, selectedElementIds }) => `
    position: relative;
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;

    ${Object.values(selectedElementIds)
      .map(
        (elementId) => `
          [data-element-id='${elementId}'] {
            border: 2px solid ${theme.internalTheme.colors.bluePrimary};
          }
        `
      )
      .join(' ')}
  `
);

export const StorySelector = styled.select`
  margin-bottom: 20px;
`;

export const Container = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

export const ElementsContainer = styled.div`
  min-width: 300px;
  height: ${STORY_WIDTH / FULLBLEED_RATIO}px;
  overflow: scroll;
`;

export const ElementInfo = styled.button(
  ({ theme, isActive }) => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    width: 100%;
    text-align: left;
    border: none;
    border-bottom: 1px solid ${theme.internalTheme.colors.gray500};
    background-color: ${
      isActive ? theme.internalTheme.colors.gray75 : 'transparent'
    };
  `
);

export const Type = styled.span`
  margin-right: 20px;
`;

export const Text = styled.span`
  overflow: hidden;
  max-width: 200px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
