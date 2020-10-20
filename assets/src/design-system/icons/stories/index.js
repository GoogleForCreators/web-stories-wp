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
import * as ActionIcons from '../action';
import * as AlertIcons from '../alert';
import * as AvIcons from '../av';
import * as ContentIcons from '../content';
import * as DashboardIcons from '../dashboard';
import * as EditorIcons from '../editor';
import * as FileIcons from '../file';
import * as NavigationIcons from '../navigation';
import * as SocialIcons from '../social';

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
    border: 1px solid gray;
  }
  svg {
    height: 40px;
    width: 40px;
    margin-bottom: 10px;
    border: 1px solid red;
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

export const Action = () => {
  return (
    <IconsList>
      {Object.keys(ActionIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = ActionIcons[iconName];
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
  );
};

export const Alert = () => {
  return (
    <IconsList>
      {Object.keys(AlertIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = AlertIcons[iconName];
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
  );
};

export const Av = () => {
  return (
    <IconsList>
      {Object.keys(AvIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = AvIcons[iconName];
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
  );
};

export const Content = () => {
  return (
    <IconsList>
      {Object.keys(ContentIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = ContentIcons[iconName];
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
  );
};

export const Editor = () => {
  return (
    <IconsList>
      {Object.keys(EditorIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = EditorIcons[iconName];
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
  );
};

export const Dashboard = () => {
  return (
    <IconsList>
      {Object.keys(DashboardIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = DashboardIcons[iconName];
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
  );
};

export const File = () => {
  return (
    <IconsList>
      {Object.keys(FileIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = FileIcons[iconName];
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
  );
};

export const Navigation = () => {
  return (
    <IconsList>
      {Object.keys(NavigationIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = NavigationIcons[iconName];
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
  );
};

export const Social = () => {
  return (
    <IconsList>
      {Object.keys(SocialIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = SocialIcons[iconName];
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
  );
};
