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

const StyledGridItem = styled.div`
  width: ${({ theme }) => theme.grid.desktop.itemWidth};
  height: ${({ theme }) => theme.grid.desktop.itemHeight};
  background-color: ${({ theme }) => theme.colors.placeholder};

  @media ${({ theme }) => theme.breakpoint.tablet} {
    width: ${({ theme }) => theme.grid.tablet.itemWidth};
    height: ${({ theme }) => theme.grid.tablet.itemHeight};
  }

  @media ${({ theme }) => theme.breakpoint.mobile} {
    width: ${({ theme }) => theme.grid.mobile.itemWidth};
    height: ${({ theme }) => theme.grid.mobile.itemHeight};
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    width: ${({ theme }) => theme.grid.min.itemWidth};
    height: ${({ theme }) => theme.grid.min.itemHeight};
  }
`;

const CardGridItem = ({ children, ...rest }) => {
  return <StyledGridItem {...rest}>{children}</StyledGridItem>;
};

CardGridItem.propTypes = {
  children: PropTypes.node.isRequired,
};
export default CardGridItem;
