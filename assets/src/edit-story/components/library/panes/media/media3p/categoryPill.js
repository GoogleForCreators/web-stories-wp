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

const PillContainer = styled.span`
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.body2.family};
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.fg.v1};
  background-color: rgba(
    255,
    255,
    255,
    ${(props) => (props.isSelected ? 0.1 : 0)}
  );
  margin: 4px;
  padding: 6px 12px;
  border-radius: 2px;
  font-size: ${({ theme }) => theme.fonts.body2.size};
  line-height: ${({ theme }) => theme.fonts.body2.lineHeight};
  user-select: none;
  background-clip: padding-box;
  :hover {
    background-color: rgba(
      255,
      255,
      255,
      ${(props) => (props.isSelected ? 0.1 : 0.05)}
    );
  }
`;

PillContainer.propTypes = {
  isSelected: PropTypes.bool,
};

const CategoryPill = (props) => (
  <PillContainer isSelected={props.isSelected} onClick={props.onClick}>
    {props.title}
  </PillContainer>
);

CategoryPill.propTypes = {
  isSelected: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default CategoryPill;
