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
/**
 * Internal dependencies
 */
import * as Icons from '..';

export default {
  title: 'Dashboard/Icons',
  component: Icons,
};

const IconsList = styled.ul`
  color: ${({ theme }) => theme.colors.gray600};
  list-style-type: none;
  li {
    padding: 10px 0;
  }
  svg {
    height: 1em;
    width: 1em;
    margin-right: 10px;
  }
`;

export const _default = {
  render: function Render() {
    return (
      <IconsList>
        {Object.keys(Icons).map((iconName) => {
          // eslint-disable-next-line import/namespace
          const Icon = Icons[iconName];
          return (
            <li key={iconName}>
              <Icon />
              {iconName}
            </li>
          );
        })}
      </IconsList>
    );
  },
};
