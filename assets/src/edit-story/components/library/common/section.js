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

export const Container = styled.div`
  position: relative;
  margin-top: 28px;
  margin-bottom: 28px;

  &:first-child {
    margin-top: 0px;
  }
`;

export const Title = styled.h2`
  flex: 1 1 auto;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.size};
  font-weight: 500;
  line-height: ${({ theme }) => theme.DEPRECATED_THEME.fonts.label.lineHeight};
  margin-bottom: 28px;
`;

export default function Section({ title, children, ...rest }) {
  return (
    <Container {...rest}>
      <Title>{title}</Title>
      {children}
    </Container>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
