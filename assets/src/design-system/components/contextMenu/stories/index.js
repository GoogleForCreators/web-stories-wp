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
import { boolean } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import ContextMenu from '../contextMenu';
import AnimatedContextMenu from '../animatedContextMenu';
import { DarkThemeProvider } from '../../../storybookUtils';

const items = [
  { label: 'Copy', shortcut: '⌘ X' },
  { label: 'Paste', shortcut: '⌘ C' },
  { label: 'Delete', shortcut: 'DEL' },
  { label: 'Send to back', shortcut: '⌥ ⌘ [', separator: 'top' },
  { label: 'Send backward', shortcut: '⌘ [', disabled: true },
  { label: 'Bring forward', shortcut: '⌘ ]', disabled: true },
  {
    label: 'Bring to front',
    shortcut: '⌥ ⌘ [',
    disabled: true,
    separator: 'bottom',
  },
  { label: 'Copy style', shortcut: '⌥ ⌘ C' },
  { label: 'Paste Style', shortcut: '⌥ ⌘ V' },
  { label: 'Clear text styles' },
  { label: 'Add style to "Saved style"' },
  { label: 'Add color to "Saved colors"' },
];

const randomItems = [
  { label: 'one' },
  { label: 'two', shortcut: '%C' },
  { label: 'i am a button!', shortcut: '$$$' },
  { label: 'neither a button nor a link' },
  { label: 'this is disabled', disabled: true },
  { label: 'three', separator: 'top' },
  {
    label: 'i am a link!',
    href: 'https://www.google.com/',
    shortcut: '⌥ ⌘ A',
  },
  {
    label: 'i am a very very very very very very very long label',
    separator: 'bottom',
  },
  { label: 'lions' },
  { label: 'tigers', separator: 'top' },
  { label: 'bears' },
];

export default {
  title: 'DesignSystem/Components/ContextMenu',
  component: ContextMenu,
};

const ViewportContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
`;

const Container = styled.div`
  position: relative;
  height: 700px;
  width: 500px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
`;

const AnimatedContainerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;

export const _default = () => {
  const itemsWithEventHandlers = items.map((item) => ({
    ...item,
    onClick: action(`Clicked on \`${item.label}\``),
  }));

  return (
    <Container>
      <ContextMenu
        items={itemsWithEventHandlers}
        isOpen={boolean('isOpen', true)}
      />
    </Container>
  );
};

export const DarkMode = () => {
  const itemsWithEventHandlers = items.map((item) => ({
    ...item,
    onClick: action(`Clicked on \`${item.label}\``),
  }));

  return (
    <DarkThemeProvider>
      <Container>
        <ContextMenu
          items={itemsWithEventHandlers}
          isOpen={boolean('isOpen', true)}
        />
      </Container>
    </DarkThemeProvider>
  );
};

export const RandomItemsInMenu = () => {
  const itemsWithEventHandlers = randomItems.map((item) => {
    if (
      item.href === undefined &&
      item.label !== 'neither a button nor a link'
    ) {
      return { ...item, onClick: action(`Clicked on \`${item.label}\``) };
    }

    return item;
  });

  return (
    <Container>
      <ContextMenu
        items={itemsWithEventHandlers}
        isOpen={boolean('isOpen', true)}
      />
    </Container>
  );
};

export const Animated = () => {
  const itemsWithEventHandlers = items.map((item) => ({
    ...item,
    onClick: action(`Clicked on \`${item.label}\``),
  }));

  return (
    <ViewportContainer>
      <AnimatedContainerWrapper>
        <AnimatedContextMenu
          items={itemsWithEventHandlers}
          isOpen={boolean('isOpen', true)}
        />
      </AnimatedContainerWrapper>
    </ViewportContainer>
  );
};
