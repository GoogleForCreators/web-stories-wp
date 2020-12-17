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
import { action } from '@storybook/addon-actions';
import { boolean, select, text } from '@storybook/addon-knobs';
import styled, { css } from 'styled-components';
import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { PLACEMENT } from '../../popup';
import { Dropdown } from '..';
import { DROPDOWN_ITEM } from '../types';
import {
  basicDropdownOptions,
  effectChooserOptions,
  nestedDropdownOptions,
} from './sampleData';

export default {
  title: 'DesignSystem/Components/Dropdown',
};

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

export const _default = () => {
  const [selectedValue, setSelectedValue] = useState(
    basicDropdownOptions[2].value
  );
  return (
    <DarkThemeProvider>
      <Dropdown
        emptyText={'No options available'}
        options={basicDropdownOptions}
        hint={text('hint', 'default hint text')}
        placeholder={text('placeholder', 'select a value')}
        dropdownLabel={text('dropdownLabel', 'label')}
        isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
        isRTL={boolean('isRTL')}
        disabled={boolean('disabled')}
        selectedValue={selectedValue}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick', event);
          setSelectedValue(newValue);
        }}
        placement={select('placement', Object.values(PLACEMENT))}
      />
    </DarkThemeProvider>
  );
};

export const LightTheme = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Dropdown
      emptyText={'No options available'}
      options={basicDropdownOptions}
      hint={text('hint', 'default hint text')}
      placeholder={text('placeholder', 'select a value')}
      dropdownLabel={text('dropdownLabel', 'label')}
      isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
      isRTL={boolean('isRTL')}
      disabled={boolean('disabled')}
      selectedValue={selectedValue}
      onMenuItemClick={(event, newValue) => {
        action('onMenuItemClick', event);
        setSelectedValue(newValue);
      }}
      placement={select('placement', Object.values(PLACEMENT))}
    />
  );
};

export const SubMenus = () => {
  const [selectedValue, setSelectedValue] = useState('dog-2');

  return (
    <Dropdown
      emptyText={'No options available'}
      options={nestedDropdownOptions}
      hint={text('hint', 'default hint text')}
      placeholder={text('placeholder', 'select a value')}
      dropdownLabel={text('dropdownLabel', 'label')}
      isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
      isRTL={boolean('isRTL')}
      disabled={boolean('disabled')}
      selectedValue={selectedValue}
      onMenuItemClick={(event, newValue) => {
        action('onMenuItemClick', event);
        setSelectedValue(newValue);
      }}
      placement={select('placement', Object.values(PLACEMENT))}
    />
  );
};

const RenderItemOverride = forwardRef(function RenderItemOverride(
  { option, isSelected, ...rest },
  ref
) {
  return (
    <StyledEffectListItem
      ref={ref}
      width={option.width}
      active={isSelected}
      {...rest}
    >
      {option.label}
    </StyledEffectListItem>
  );
});
RenderItemOverride.propTypes = {
  option: DROPDOWN_ITEM,
  isSelected: PropTypes.bool,
};

export const OverriddenAnimationProofOfConcept = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <DarkThemeProvider>
      <Dropdown
        emptyText={'No options available'}
        options={effectChooserOptions}
        hint={text('hint', 'default hint text')}
        placeholder={text('placeholder', 'select a value')}
        dropdownLabel={text('dropdownLabel', 'label')}
        isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection', true)}
        disabled={boolean('disabled')}
        selectedValue={selectedValue}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick', event);
          setSelectedValue(newValue);
        }}
        placement={select('placement', Object.values(PLACEMENT))}
        menuStylesOverride={styleOverrideForAnimationEffectMenu}
        renderItem={RenderItemOverride}
      />
    </DarkThemeProvider>
  );
};
