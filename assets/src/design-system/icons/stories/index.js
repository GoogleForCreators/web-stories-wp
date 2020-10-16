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
  }
  svg {
    height: 40px;
    width: 40px;
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

export const Action = () => {
  return (
    <IconsList>
      {Object.keys(ActionIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = ActionIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Add = () => {
  return (
    <IconsList>
      {Object.keys(AddIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = AddIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Align = () => {
  return (
    <IconsList>
      {Object.keys(AlignIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = AlignIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Animation = () => {
  return (
    <IconsList>
      {Object.keys(AnimationIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = AnimationIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Arrow = () => {
  return (
    <IconsList>
      {Object.keys(ArrowIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = ArrowIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
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
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Distribute = () => {
  return (
    <IconsList>
      {Object.keys(DistributeIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = DistributeIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Drag = () => {
  return (
    <IconsList>
      {Object.keys(DragIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = DragIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const General = () => {
  return (
    <IconsList>
      {Object.keys(GeneralIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = GeneralIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Status = () => {
  return (
    <IconsList>
      {Object.keys(StatusIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = StatusIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Layout = () => {
  return (
    <IconsList>
      {Object.keys(LayoutIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = LayoutIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Lock = () => {
  return (
    <IconsList>
      {Object.keys(LockIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = LockIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Media = () => {
  return (
    <IconsList>
      {Object.keys(MediaIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = MediaIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const More = () => {
  return (
    <IconsList>
      {Object.keys(MoreIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = MoreIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Shapes = () => {
  return (
    <IconsList>
      {Object.keys(ShapesIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = ShapesIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Text = () => {
  return (
    <IconsList>
      {Object.keys(TextIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = TextIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const TextAlign = () => {
  return (
    <IconsList>
      {Object.keys(TextAlignIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = TextAlignIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const TextStyle = () => {
  return (
    <IconsList>
      {Object.keys(TextStyleIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = TextStyleIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Upload = () => {
  return (
    <IconsList>
      {Object.keys(UploadIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = UploadIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const View = () => {
  return (
    <IconsList>
      {Object.keys(ViewIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = ViewIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};

export const Zoom = () => {
  return (
    <IconsList>
      {Object.keys(ZoomIcons).map((iconName) => {
        // eslint-disable-next-line import/namespace
        const Icon = ZoomIcons[iconName];
        return (
          <li key={iconName}>
            <Icon />
            {iconName}
          </li>
        );
      })}
    </IconsList>
  );
};
