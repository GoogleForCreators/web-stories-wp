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
import { Text } from '../../';
import * as Icons from '../';

export default {
  title: 'DesignSystem/Icons',
};

const IconsList = styled.ul`
  color: ${({ theme }) => theme.colors.fg.primary};
  list-style-type: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px 10px;

  li {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: center;
  }
  svg {
    height: 32px;
    width: 32px;
    margin-bottom: 10px;
  }
`;

export const AllIcons = () => {
  return (
    <>
      <Text>{`Total Icons: ${Object.values(Icons).length}`}</Text>

      <IconsList>
        {Object.keys(Icons).map((iconName) => {
          // eslint-disable-next-line import/namespace
          const Icon = Icons[iconName];
          return (
            <li key={iconName}>
              <Icon />
              <Text as="span" isBold>
                {iconName}
              </Text>
            </li>
          );
        })}
      </IconsList>
    </>
  );
};

export const ColorfulIcons = () => {
  const colors = ['blue', 'hotpink', 'rebeccapurple', 'lightgreen', 'red'];
  return (
    <>
      <Text>{`Total Icons: ${Object.values(Icons).length}`}</Text>

      <IconsList>
        {Object.keys(Icons).map((iconName, index) => {
          // eslint-disable-next-line import/namespace
          const Icon = Icons[iconName];
          return (
            <li key={iconName}>
              <Icon style={{ color: colors[index % colors.length] }} />
              <Text as="span" isBold>
                {iconName}
              </Text>
            </li>
          );
        })}
      </IconsList>
    </>
  );
};
