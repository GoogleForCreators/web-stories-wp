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
import { useContext } from '@web-stories-wp/react';

/**
 * Internal dependencies
 */
import panelContext from '../context';

const Container = styled.div`
  padding: ${({ padding }) => padding || '8px 16px 8px'};
  overflow: auto;
  background-color: ${({ isSecondary, theme }) =>
    isSecondary ? theme.colors.interactiveBg.secondaryNormal : 'transparent'};
`;

function Content({ children, ...rest }) {
  const {
    state: { isCollapsed, height, resizable, panelContentId },
  } = useContext(panelContext);

  const formStyle = {
    height: resizable ? `${height}px` : 'auto',
  };

  // Don't render panel content/children when collapsed.
  return isCollapsed ? null : (
    <Container style={formStyle} {...rest} id={panelContentId}>
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
