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

const Tab = styled.span`
  cursor: pointer;
  font-size: 16px;
  margin-right: 16px;
  border-bottom: ${({ theme, active }) =>
    active ? `solid 4px ${theme.colors.accent.primary};` : 'none'};
  &:last-child: {
    margin-right: 0;
  }
`;

function ProviderTab(props) {
  return (
    <Tab onClick={props.onClick} active={props.active} id={props.id}>
      {props.name}
    </Tab>
  );
}

ProviderTab.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
};

export default ProviderTab;
