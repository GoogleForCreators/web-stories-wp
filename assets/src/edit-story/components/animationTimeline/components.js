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

export const TimelineContainer = styled.div`
  height: 180px;
  background: ${({ theme }) => theme.colors.bg.v16};
  color: ${({ theme }) => theme.colors.fg.v1};
  overflow-y: scroll;
`;

export const TimelineContent = styled.div`
  display: flex;
  min-height: calc(100% - ${ROW_HEIGHT}px);
`;

export const TimelineLegend = styled.div`
  flex: 0 1 246px;
  box-shadow: 2px 0px 10px rgba(0, 0, 0, 0.4);
`;

export const TimelineTimingContainer = styled.div`
  flex: 1;
`;

export const TimelineTitleBar = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  height: ${ROW_HEIGHT}px;
  min-width: 100%;
  background: ${({ theme }) => theme.colors.bg.v16};
  border-bottom: 1px solid ${({ theme }) => theme.colors.fg.v9};
`;

export const TimelineRow = styled.div`
  height: ${ROW_HEIGHT}px;
  min-width: 100%;
  ${({ alternating, theme }) =>
    alternating && {
      backgroundColor: rgba(theme.colors.fg.white, 0.1),
    }}
`;

TimelineRow.propTypes = {
  alternating: propTypes.bool,
};
