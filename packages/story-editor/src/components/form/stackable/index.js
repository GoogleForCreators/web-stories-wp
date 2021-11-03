/*
 * Copyright 2021 Google LLC
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
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */

const StackableContainer = styled.div(
  ({ locked, styleOverride }) => css`
    display: flex;
    ${locked ? 'max-width: 106px' : ''}
    ${styleOverride};

    & > div {
      border-radius: 0;

      &:first-of-type > div {
        border-radius: 4px 0 0 4px;
      }
      &:last-of-type > div {
        border-radius: 0 4px 4px 0;
      }
    }
  `
);

function StackableGroup(props) {
  const { children, containerStyleOverride, locked } = props;

  return (
    <StackableContainer locked={locked} styleOverride={containerStyleOverride}>
      {children}
    </StackableContainer>
  );
}

StackableGroup.propTypes = {
  children: PropTypes.node,
  locked: PropTypes.bool,
  containerStyleOverride: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

export default StackableGroup;
