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
import { ReactComponent as MediaIcon } from './media.svg';
import { ReactComponent as TextIcon } from './text.svg';
import { ReactComponent as ShapesIcon } from './shapes.svg';
import { ReactComponent as LinksIcon } from './links.svg';

const Tabs = styled.ul`
  background: ${({ theme }) => theme.colors.bg.v3};
  display: flex;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Tab = styled.li`
  width: 64px;
  height: 100%;
  color: ${({ theme }) => theme.colors.fg.v1};
`;

const Icon = styled.a`
  color: inherit;
  background: ${({ isActive, theme }) =>
    isActive ? theme.colors.bg.v4 : 'transparent'};
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    color: inherit;
  }

  ${({ isActive }) =>
    !isActive &&
    `
  opacity: .4;
  &:hover { opacity: 1; }
  `}

  svg {
    width: 22px;
    height: 22px;
  }
`;

function Media(props) {
  return (
    <Tab>
      <Icon {...props}>
        <MediaIcon />
      </Icon>
    </Tab>
  );
}

function Text(props) {
  return (
    <Tab>
      <Icon {...props}>
        <TextIcon />
      </Icon>
    </Tab>
  );
}

function Shapes(props) {
  return (
    <Tab>
      <Icon {...props}>
        <ShapesIcon />
      </Icon>
    </Tab>
  );
}

function Links(props) {
  return (
    <Tab>
      <Icon {...props}>
        <LinksIcon />
      </Icon>
    </Tab>
  );
}

export { Tabs, Media, Text, Shapes, Links };
