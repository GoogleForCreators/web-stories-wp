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
import * as Icons from '../';
import * as ActionIcons from '../action';
import * as AddIcons from '../add';
import * as AlignIcons from '../align';
import * as AnimationIcons from '../animation';
import * as ArrowIcons from '../arrow';
import * as DashboardIcons from '../dashboard';
import * as DistributeIcons from '../distribute';
import * as DragIcons from '../drag';
import * as GeneralIcons from '../general';
import * as ShapesIcons from '../shapes';
import * as StatusIcons from '../status';
import * as LayoutIcons from '../layout';
import * as LockIcons from '../lock';
import * as MoreIcons from '../more';
import * as MediaIcons from '../media';
import * as TextIcons from '../text';
import * as TextAlignIcons from '../text-align';
import * as TextStyleIcons from '../text-style';
import * as UploadIcons from '../upload';
import * as ViewIcons from '../view';
import * as ZoomIcons from '../zoom';

export default {
  title: 'DesignSystem/Icons',
};

const IconsList = styled.ul`
  color: ${({ theme }) => theme.colors.fg.primary};
  list-style-type: none;
  li {
    padding: 10px 0;
  }
  svg {
    height: 22px;
    width: 22px;
    margin-right: 10px;
  }
`;

export const AllIcons = () => {
  return (
    <IconsList>
      {`Total Icons: ${Object.values(Icons).length}`}
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
