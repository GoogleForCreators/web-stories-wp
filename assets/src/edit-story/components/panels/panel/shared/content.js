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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useContext } from 'use-context-selector';

/**
 * Internal dependencies
 */
import panelContext from '../context';

const Container = styled.div`
  padding: ${({ padding }) => padding || '10px 20px'};
  overflow: auto;
  background-color: ${({ isSecondary, theme }) =>
    isSecondary ? theme.colors.interactiveBg.secondaryNormal : 'transparent'};
  ${({ hasBorder, theme }) =>
    hasBorder &&
    `border-top: 1px solid ${theme.DEPRECATED_THEME.colors.bg.v9};`}
`;

function Content({ children, ...rest }) {
  const {
    state: { isCollapsed, height, resizeable, panelContentId },
  } = useContext(panelContext);

  const formStyle = {
    height: resizeable ? `${height}px` : 'auto',
  };

  return (
    <Container
      style={formStyle}
      {...rest}
      id={panelContentId}
      hidden={isCollapsed}
    >
      {children}
    </Container>
  );
}

Content.propTypes = {
  children: PropTypes.node,
  isPrimary: PropTypes.bool,
};

Content.defaultProps = {
  isPrimary: false,
};

export default Content;
