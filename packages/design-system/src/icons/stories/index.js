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
import { useState, useMemo } from '@web-stories-wp/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Text } from '../..';
import * as Icons from '..';

export default {
  title: 'DesignSystem/Icons',
};

const Page = styled.main`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

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

// eslint-disable-next-line import/namespace
const allIcons = Object.keys(Icons).map((key) => ({ key, Icon: Icons[key] }));

function IconDisplay({ getStyle = () => {} }) {
  const [query, setQuery] = useState('');
  const matchingIcons = useMemo(() => {
    if (!query) {
      return allIcons;
    }
    return allIcons.filter(({ key }) => key.match(new RegExp(query, 'i')));
  }, [query]);

  return (
    <Page>
      <Text as="label">
        <span>{'Filter: '}</span>
        <input
          type="search"
          value={query}
          onChange={(evt) => setQuery(evt.target.value)}
        />
      </Text>
      <Text>{`Matching: ${matchingIcons.length}`}</Text>

      <IconsList>
        {matchingIcons.map(({ key, Icon }, index) => {
          return (
            <li key={key}>
              <Icon style={getStyle(index, key)} />
              <Text as="span" isBold>
                {key}
              </Text>
            </li>
          );
        })}
      </IconsList>
    </Page>
  );
}

IconDisplay.propTypes = {
  getStyle: PropTypes.func,
};

export const AllIcons = IconDisplay;

export const ColorfulIcons = () => {
  const colors = ['blue', 'hotpink', 'rebeccapurple', 'lightgreen', 'red'];
  return (
    <IconDisplay
      getStyle={(index) => ({ color: colors[index % colors.length] })}
    />
  );
};
