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
import { boolean, number, text } from '@storybook/addon-knobs';
import styled, { css } from 'styled-components';
import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { DarkThemeProvider } from '../../../storybookUtils';
import { Menu, DROP_DOWN_ITEM } from '../';
import {
  basicDropDownOptions,
  effectChooserOptions,
  nestedDropDownOptions,
  reallyLongOptions,
} from '../../../storybookUtils/sampleData';
import { getOptions } from '../utils';

export default {
  title: 'DesignSystem/Components/Menu',
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

export const _default = () => {
  const [selectedValue, setSelectedValue] = useState(
    basicDropDownOptions[2].value
  );
  return (
    <DarkThemeProvider>
      <Container>
        <Menu
          dropDownHeight={number('dropDownHeight')}
          emptyText={'No options available'}
          hasMenuRole={boolean('hasMenuRole')}
          isRTL={boolean('isRTL')}
          options={_basicDropDownOptions}
          listId={'list-id'}
          onMenuItemClick={(event, newValue) => {
            action('onMenuItemClick')(event);
            setSelectedValue(newValue);
          }}
          onDismissMenu={(event) => {
            action('onDismissMenu occured')(event);
          }}
          activeValue={selectedValue}
          menuAriaLabel={text('menuAriaLabel', 'default aria label')}
          parentId={text('parentId', 'id-menu-associates-with')}
        />
      </Container>
    </DarkThemeProvider>
  );
};

export const LightTheme = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container>
      <Menu
        dropDownHeight={number('dropDownHeight')}
        emptyText={'No options available'}
        hasMenuRole={boolean('hasMenuRole')}
        isRTL={boolean('isRTL')}
        options={_basicDropDownOptions}
        listId={'list-id'}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick')(event);
          setSelectedValue(newValue);
        }}
        onDismissMenu={(event) => {
          action('onDismissMenu occured')(event);
        }}
        activeValue={selectedValue}
        menuAriaLabel={text('menuAriaLabel', 'default aria label')}
        parentId={text('parentId', 'id-menu-associates-with')}
      />
    </Container>
  );
};

export const NoOptionsMenu = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container>
      <Menu
        dropDownHeight={number('dropDownHeight')}
        emptyText={'No options available'}
        hasMenuRole={boolean('hasMenuRole')}
        isRTL={boolean('isRTL')}
        options={[]}
        listId={'list-id'}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick')(event);
          setSelectedValue(newValue);
        }}
        onDismissMenu={(event) => {
          action('onDismissMenu occured')(event);
        }}
        activeValue={selectedValue}
        menuAriaLabel={text('menuAriaLabel', 'default aria label')}
        parentId={text('parentId', 'id-menu-associates-with')}
      />
    </Container>
  );
};

export const ReallyLongLabelsMenu = () => {
  const [selectedValue, setSelectedValue] = useState(null);

  return (
    <Container narrow>
      <Menu
        dropDownHeight={number('dropDownHeight')}
        emptyText={'No options available'}
        hasMenuRole={boolean('hasMenuRole')}
        isRTL={boolean('isRTL')}
        options={_reallyLongOptions}
        listId={'list-id'}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick')(event);
          setSelectedValue(newValue);
        }}
        onDismissMenu={(event) => {
          action('onDismissMenu occured')(event);
        }}
        activeValue={selectedValue}
        menuAriaLabel={text('menuAriaLabel', 'default aria label')}
        parentId={text('parentId', 'id-menu-associates-with')}
      />
    </Container>
  );
};

export const SubMenus = () => {
  const [selectedValue, setSelectedValue] = useState('dog-2');

  return (
    <Container>
      <Menu
        dropDownHeight={number('dropDownHeight')}
        emptyText={'No options available'}
        hasMenuRole={boolean('hasMenuRole')}
        isRTL={boolean('isRTL')}
        options={_nestedDropDownOptions}
        listId={'list-id'}
        onMenuItemClick={(event, newValue) => {
          action('onMenuItemClick')(event);
          setSelectedValue(newValue);
        }}
        onDismissMenu={(event) => {
          action('onDismissMenu occured')(event);
        }}
        activeValue={selectedValue}
        menuAriaLabel={text('menuAriaLabel', 'default aria label')}
        parentId={text('parentId', 'id-menu-associates-with')}
      />
    </Container>
  );
};

// eslint-disable-next-line react/display-name
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

export const OverriddenAnimationProofOfConcept = () => {
  const [selectedValue, setSelectedValue] = useState(null);
  return (
    <DarkThemeProvider>
      <Container>
        <Menu
          dropDownHeight={number('dropDownHeight')}
          emptyText={'No options available'}
          hasMenuRole={boolean('hasMenuRole')}
          isRTL={boolean('isRTL')}
          options={_effectChooserOptions}
          listId={'list-id'}
          onMenuItemClick={(event, newValue) => {
            action('onMenuItemClick')(event);
            setSelectedValue(newValue);
          }}
          onDismissMenu={(event) => {
            action('onDismissMenu occured')(event);
          }}
          activeValue={selectedValue}
          menuAriaLabel={text('menuAriaLabel', 'default aria label')}
          parentId={text('parentId', 'id-menu-associates-with')}
          menuStylesOverride={styleOverrideForAnimationEffectMenu}
          renderItem={RenderItemOverride}
        />
      </Container>
    </DarkThemeProvider>
  );
};
