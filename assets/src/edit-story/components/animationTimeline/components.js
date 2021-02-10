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
import propTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';

const ROW_HEIGHT = 35;
const LEGEND_WIDTH = 246;
const TIMELINE_HEIGHT = 180;

export const TimelineContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.family};
  height: ${TIMELINE_HEIGHT}px;
  background: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.v16};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  overflow: scroll;
  position: relative;
`;

export const TimelineLegend = styled.div`
  min-width: ${LEGEND_WIDTH}px;
  background: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.v16};
  height: max-content;
  position: sticky;
  left: 0;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.4);
  z-index: 3;
`;

export const TimelineTimingContainer = styled.div`
  height: max-content;
`;

export const TimelineTitleBar = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  flex-direction: column;
  justify-content: flex-end;
  height: ${ROW_HEIGHT}px;
  min-width: 100%;
  background: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.v16};
  border-bottom: 1px solid ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.v9};
  z-index: 2;
`;

export const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  height: ${ROW_HEIGHT}px;
  min-width: 100%;
  ${({ alternating, theme }) =>
    alternating && {
      backgroundColor: rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.1),
    }}
`;

TimelineRow.propTypes = {
  alternating: propTypes.bool,
};
