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

// TODO params
/**
 * VirtualizedContainer is the last accessible parent before virtualizedRows and columns are in play.
 *
 * @param root0
 * @param root0.paneLeft
 * @param root0.columnWidth
 * @param root0.rowHeight
 * @param root0.rowGap
 */
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
  width: 100%;
  height: 100%;
  margin-top: 4px;
`;

VirtualizedContainer.propTypes = {
  columnWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  rowGap: PropTypes.number,
  paneLeft: PropTypes.number,
};
VirtualizedContainer.defaultProps = {
  rowGap: 12,
  paneLeft: 0,
};
