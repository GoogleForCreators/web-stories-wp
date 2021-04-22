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
import PropTypes from 'prop-types';

export const PANEL_GRID_ROW_GAP = 12;

// padding-top is to help outlines on text sets
export const virtualPaneContainer = css`
  margin-top: 38px;
  padding-top: 2px;
  width: 100%;
  height: 100%;
`;

// Contains mapped over useVirtual rows
export const VirtualizedWrapper = styled.div`
  height: ${({ height }) => `${height}px`};
  width: 100%;
  position: relative;
`;
VirtualizedWrapper.propTypes = {
  height: PropTypes.number.isRequired,
};

// VirtualizedContainer is the last accessible parent before virtualizedRows and columns are in play.
export const VirtualizedContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${({ paneLeft }) => paneLeft};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-columns: ${({ columnWidth }) => `
    repeat(auto-fill, ${columnWidth}px)`};
  grid-template-rows: ${({ rowHeight }) => `minmax(${rowHeight}px, auto)`};
  gap: ${({ rowGap }) => rowGap}px;
  width: calc(100% - ${({ paneLeft }) => paneLeft});
  height: 100%;
  margin-top: 4px;
`;

VirtualizedContainer.propTypes = {
  columnWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowGap: PropTypes.number,
  paneLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
VirtualizedContainer.defaultProps = {
  rowGap: 12,
  paneLeft: 0,
};
