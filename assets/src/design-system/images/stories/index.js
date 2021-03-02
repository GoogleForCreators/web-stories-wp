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
import { Text } from '../../components';
import * as Logos from '..';

export default {
  title: 'DesignSystem/Images',
};

const LogoList = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  padding: 24px;
  width: 300px;

  li {
    margin: 20px 0;
  }
`;

export const Default = () => {
  return (
    <LogoList>
      {Object.keys(Logos).map((logoName) => {
        // eslint-disable-next-line import/namespace
        const Logo = Logos[logoName];
        return (
          <li key={logoName}>
            <Logo />
            <Text as="span" isBold>
              {logoName}
            </Text>
          </li>
        );
      })}
    </LogoList>
  );
};
