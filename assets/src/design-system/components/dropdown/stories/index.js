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
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { PLACEMENT } from '../../popup';
import { Dropdown } from '..';
import { basicDropdownItems, effectChooserData } from './sampleData';

export default {
  title: 'DesignSystem/Components/Dropdown',
};

const StyledEffectListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ active }) => (active ? '#5732A3' : 'inherit')};
  border-radius: 4px;
  border: 1px solid white;
  position: relative;
  height: 100%;
  overflow: hidden;
  font-size: 20px;
  line-height: 1;
  text-transform: uppercase;
  transition: background 0.1s linear;
  color: white;
  width: ${({ width }) => (width === 'full' ? 248 : 120)}px;
`;

const styleOverrideForAnimationEffectMenu = css`
  width: 276px;

  ul {
    display: flex;
    justify-content: space-evenly;
    align-items: stretch;
    flex-wrap: wrap;
    flex-direction: row;
    width: 100%;
    background: black;
  }

  li {
    margin: 8px 0;
    height: 48px;
    display: inline;
    width: fit-content;
    &:focus > div {
      background: #b488fc;
    }
  }
`;

export const _default = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <DarkThemeProvider>
      <Dropdown
        items={basicDropdownItems}
        hint={text('hint', 'default hint text')}
        placeholder={text('placeholder', 'select a value')}
        dropdownLabel={text('dropdownLabel', 'label')}
        isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
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
      items={basicDropdownItems}
      hint={text('hint', 'default hint text')}
      placeholder={text('placeholder', 'select a value')}
      dropdownLabel={text('dropdownLabel', 'label')}
      isKeepMenuOpenOnSelection={boolean('isKeepMenuOpenOnSelection')}
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

export const OverriddenAnimationProofOfConcept = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <DarkThemeProvider>
      <Dropdown
        items={effectChooserData}
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
        renderItem={(item, isSelected) => (
          <StyledEffectListItem width={item.width} active={isSelected}>
            {item.label}
          </StyledEffectListItem>
        )}
      />
    </DarkThemeProvider>
  );
};
