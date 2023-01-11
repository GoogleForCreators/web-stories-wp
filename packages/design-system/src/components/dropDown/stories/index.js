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
import { Placement } from '../../popup';
import { Text } from '../../typography';
import { DROP_DOWN_ITEM } from '../../menu';
import { DropDown } from '..';
import {
  basicDropDownOptions,
  effectChooserOptions,
  nestedDropDownOptions,
  reallyLongOptions,
} from '../../../storybookUtils/sampleData';

export default {
  title: 'DesignSystem/Components/DropDown',
  args: {
    hasError: false,
    hint: 'default hint text',
    placeholder: 'select a value',
    ariaLabel: 'ariaLabel',
    dropDownLabel: 'label',
    isKeepMenuOpenOnSelection: true,
    isRTL: false,
    disabled: false,
    placement: Placement.Top,
    popupZIndex: 1,
  },
  argTypes: {
    placement: {
      options: Object.values(Placement),
      control: 'select',
    },
    onMenuItemClick: { action: 'onMenuItemClick' },
  },
};

const Container = styled.div`
  width: ${({ narrow }) => (narrow ? 150 : 400)}px;
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

// eslint-disable-next-line react/prop-types
export const _default = ({ onMenuItemClick, ...args }) => {
  const [selectedValue, setSelectedValue] = useState(
    basicDropDownOptions[2].value
  );
  return (
    <DarkThemeProvider>
      <Container>
        <Text>
          {
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus luctus ex eu maximus. Nam cursus nulla massa, vel porta nisi mattis et. Vivamus vitae massa nulla. Sed enim velit, iaculis ut pharetra vitae, sagittis et dui. In sollicitudin lectus vel rhoncus auctor. Morbi pulvinar nisl sed mi fringilla, vitae bibendum felis egestas.'
          }
        </Text>
        <DropDown
          emptyText={'No options available'}
          options={basicDropDownOptions}
          selectedValue={selectedValue}
          onMenuItemClick={(_, newValue) => {
            onMenuItemClick(newValue);
            setSelectedValue(newValue);
          }}
          {...args}
        />
      </Container>
    </DarkThemeProvider>
  );
};

// eslint-disable-next-line react/prop-types
export const LightTheme = ({ onMenuItemClick, ...args }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container>
      <DropDown
        emptyText={'No options available'}
        options={basicDropDownOptions}
        selectedValue={selectedValue}
        onMenuItemClick={(_, newValue) => {
          onMenuItemClick(newValue);
          setSelectedValue(newValue);
        }}
        {...args}
      />
    </Container>
  );
};

const shortenedOptions = [...basicDropDownOptions.slice(0, 3)];

// eslint-disable-next-line react/prop-types
export const ShortMenu = ({ onMenuItemClick, ...args }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container>
      <DropDown
        emptyText={'No options available'}
        options={shortenedOptions}
        selectedValue={selectedValue}
        onMenuItemClick={(_, newValue) => {
          onMenuItemClick(newValue);
          setSelectedValue(newValue);
        }}
        {...args}
      />
    </Container>
  );
};

// eslint-disable-next-line react/prop-types
export const NoOptionsMenu = ({ onMenuItemClick, ...args }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container>
      <DropDown
        emptyText={'No options available'}
        options={[]}
        selectedValue={selectedValue}
        onMenuItemClick={(_, newValue) => {
          onMenuItemClick(newValue);
          setSelectedValue(newValue);
        }}
        {...args}
      />
    </Container>
  );
};

// eslint-disable-next-line react/prop-types
export const ReallyLongLabelsMenu = ({ onMenuItemClick, ...args }) => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container narrow>
      <DropDown
        emptyText={'No options available'}
        options={reallyLongOptions}
        selectedValue={selectedValue}
        onMenuItemClick={(_, newValue) => {
          onMenuItemClick(newValue);
          setSelectedValue(newValue);
        }}
        {...args}
      />
    </Container>
  );
};

// eslint-disable-next-line react/prop-types
export const SubMenus = ({ onMenuItemClick, ...args }) => {
  const [selectedValue, setSelectedValue] = useState('dog-2');

  return (
    <Container>
      <DropDown
        emptyText={'No options available'}
        options={nestedDropDownOptions}
        selectedValue={selectedValue}
        onMenuItemClick={(_, newValue) => {
          onMenuItemClick(newValue);
          setSelectedValue(newValue);
        }}
        {...args}
      />
    </Container>
  );
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
  option: DROP_DOWN_ITEM,
  isSelected: PropTypes.bool,
};

export const OverriddenAnimationProofOfConcept = ({
  // eslint-disable-next-line react/prop-types
  onMenuItemClick,
  ...args
}) => {
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <DarkThemeProvider>
      <Container>
        <DropDown
          emptyText={'No options available'}
          options={effectChooserOptions}
          selectedValue={selectedValue}
          onMenuItemClick={(event, newValue) => {
            onMenuItemClick(newValue);
            setSelectedValue(newValue);
          }}
          menuStylesOverride={styleOverrideForAnimationEffectMenu}
          renderItem={RenderItemOverride}
          {...args}
        />
      </Container>
    </DarkThemeProvider>
  );
};
