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
import { useContext } from 'react';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import panelContext from '../context';

const Form = styled.form`
  padding: ${({ padding }) => padding || '10px 20px'};
  background-color: ${({ isSecondary, theme }) =>
    isSecondary ? rgba(theme.colors.fg.v1, 0.07) : 'transparent'};
  overflow: auto;
  ${({ hasBorder, theme }) =>
    hasBorder && `border-top: 1px solid ${theme.colors.bg.v9};`}
`;

function Content({ children, onSubmit, ...rest }) {
  const {
    state: { isCollapsed, height, panelContentId },
  } = useContext(panelContext);

  const formStyle = {
    height: height === null ? 'auto' : `${height}px`,
  };

  return (
    <Form
      style={formStyle}
      onSubmit={onSubmit}
      {...rest}
      id={panelContentId}
      hidden={isCollapsed}
    >
      {children}
    </Form>
  );
}

Content.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onSubmit: PropTypes.func,
  isPrimary: PropTypes.bool,
};

Content.defaultProps = {
  onSubmit: (evt) => evt.preventDefault(),
};

export default Content;
