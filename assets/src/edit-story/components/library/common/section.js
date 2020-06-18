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
import { rgba } from 'polished';

const Container = styled.div`
  position: relative;
  margin-top: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid ${({ theme }) => rgba(theme.colors.fg.v1, 0.2)};

  &:first-child {
    margin-top: 0px;
  }
`;

const TitleAndTools = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  align-items: center;
  height: 30px;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  flex: 1 1 auto;
  color: ${({ theme }) => theme.colors.fg.v1};
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.label.family};
  font-size: ${({ theme }) => theme.fonts.label.size};
  font-weight: 500;
  line-height: ${({ theme }) => theme.fonts.label.lineHeight};
`;

const Tools = styled.div`
  flex: 0 0 auto;
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`;

export default function Section({ title, titleTools, children }) {
  return (
    <Container>
      {(title || titleTools) && (
        <TitleAndTools>
          {title && <Title>{title}</Title>}
          {titleTools && <Tools>{titleTools}</Tools>}
        </TitleAndTools>
      )}
      {children}
    </Container>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  titleTools: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
