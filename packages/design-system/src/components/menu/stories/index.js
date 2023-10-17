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
import styled, { css } from 'styled-components';
import { useState, forwardRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { Menu } from '..';
import {
  basicDropDownOptions,
  effectChooserOptions,
  nestedDropDownOptions,
  reallyLongOptions,
} from '../../../storybookUtils/sampleData';
import { getOptions } from '../utils';

export default {
  title: 'DesignSystem/Components/Menu',
  args: {
    dropDownHeight: 100,
    hasMenuRole: true,
    isRTL: false,
    menuAriaLabel: 'default aria label',
    parentId: 'id-menu-associates-with',
  },
  argTypes: {
    onMenuItemClick: { action: 'onMenuItemClick' },
    onDismissMenu: { action: 'onDismissMenu occurred' },
  },
};

const STANDARD_WIDTH = 400;
const NARROW_WIDTH = 150;

const Container = styled.div`
  width: ${({ narrow }) => (narrow ? NARROW_WIDTH : STANDARD_WIDTH)}px;
  height: 100vh;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

const StyledEffectListItem = styled.li`
  border: none;
  background: ${({ active }) => (active ? '#5732A3' : '#333')};
  border-radius: 4px;
  height: 48px;
  position: relative;
  overflow: hidden;
  font-family: 'Teko', sans-serif;
  font-size: 20px;
  line-height: 1;
  color: white;
  text-transform: uppercase;
  transition: background 0.1s linear;
  grid-column-start: ${({ width }) => (width === 'full' ? 'span 4' : 'span 2')};
  &:focus {
    background: ${({ active }) => (active ? '#5732A3' : '#B488FC')};
  }
`;

const styleOverrideForAnimationEffectMenu = css`
  width: 276px;
  display: inline-block;
  background: black;
  ul {
    display: grid;
    justify-content: center;
    gap: 15px 3px;
    grid-template-columns: repeat(4, 58px);
    padding: 15px;
    position: relative;
  }
`;

const _basicDropDownOptions = getOptions(basicDropDownOptions);
const _effectChooserOptions = getOptions(effectChooserOptions);
const _nestedDropDownOptions = getOptions(nestedDropDownOptions);
const _reallyLongOptions = getOptions(reallyLongOptions);

export const _default = {
  render: function Render({ onMenuItemClick, ...args }) {
    const [selectedValue, setSelectedValue] = useState(
      basicDropDownOptions[2].value
    );
    return (
      <DarkThemeProvider>
        <Container>
          <Menu
            options={_basicDropDownOptions}
            listId={'list-id'}
            onMenuItemClick={(_, newValue) => {
              onMenuItemClick(newValue);
              setSelectedValue(newValue);
            }}
            activeValue={selectedValue}
            {...args}
          />
        </Container>
      </DarkThemeProvider>
    );
  },
};

export const LightTheme = {
  render: function Render({ onMenuItemClick, ...args }) {
    const [selectedValue, setSelectedValue] = useState(null);

    return (
      <Container>
        <Menu
          emptyText={'No options available'}
          options={_basicDropDownOptions}
          listId={'list-id'}
          onMenuItemClick={(_, newValue) => {
            onMenuItemClick(newValue);
            setSelectedValue(newValue);
          }}
          activeValue={selectedValue}
          {...args}
        />
      </Container>
    );
  },
};
export const NoOptionsMenu = {
  render: function Render({ onMenuItemClick, ...args }) {
    const [selectedValue, setSelectedValue] = useState(null);

    return (
      <Container>
        <Menu
          emptyText={'No options available'}
          options={[]}
          listId={'list-id'}
          onMenuItemClick={(_, newValue) => {
            onMenuItemClick(newValue);
            setSelectedValue(newValue);
          }}
          activeValue={selectedValue}
          {...args}
        />
      </Container>
    );
  },
};
export const ReallyLongLabelsMenu = {
  render: function Render({ onMenuItemClick, ...args }) {
    const [selectedValue, setSelectedValue] = useState(null);

    return (
      <Container narrow>
        <Menu
          emptyText={'No options available'}
          options={_reallyLongOptions}
          listId={'list-id'}
          onMenuItemClick={(_, newValue) => {
            onMenuItemClick(newValue);
            setSelectedValue(newValue);
          }}
          activeValue={selectedValue}
          {...args}
        />
      </Container>
    );
  },
};
export const SubMenus = {
  render: function Render({ onMenuItemClick, ...args }) {
    const [selectedValue, setSelectedValue] = useState('dog-2');

    return (
      <Container>
        <Menu
          emptyText={'No options available'}
          options={_nestedDropDownOptions}
          listId={'list-id'}
          onMenuItemClick={(_, newValue) => {
            onMenuItemClick(newValue);
            setSelectedValue(newValue);
          }}
          activeValue={selectedValue}
          {...args}
        />
      </Container>
    );
  },
};

const RenderItemOverride = forwardRef(
  ({ option, isSelected, ...rest }, ref) => (
    <StyledEffectListItem
      ref={ref}
      width={option.width}
      active={isSelected}
      {...rest}
    >
      {option.label}
    </StyledEffectListItem>
  )
);
RenderItemOverride.propTypes = {
  option: PropTypes.object,
  isSelected: PropTypes.bool,
};

export const OverriddenAnimationProofOfConcept = {
  render: function Render({
    // eslint-disable-next-line react/prop-types
    onMenuItemClick,
    ...args
  }) {
    const [selectedValue, setSelectedValue] = useState(null);
    return (
      <DarkThemeProvider>
        <Container>
          <Menu
            emptyText={'No options available'}
            options={_effectChooserOptions}
            listId={'list-id'}
            onMenuItemClick={(_, newValue) => {
              onMenuItemClick(newValue);
              setSelectedValue(newValue);
            }}
            activeValue={selectedValue}
            menuStylesOverride={styleOverrideForAnimationEffectMenu}
            renderItem={RenderItemOverride}
            {...args}
          />
        </Container>
      </DarkThemeProvider>
    );
  },
};
