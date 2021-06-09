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
import { useState, useRef } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import ContextMenu from '../contextMenu';
import AnimatedContextMenu from '../animatedContextMenu';
import { DarkThemeProvider } from '../../../storybookUtils';
import {
  Bucket,
  Captions,
  CircleSpeed,
  Eraser,
  LetterTLargeLetterTSmall,
  LetterTPlus,
  Link,
  Media,
  PictureSwap,
} from '../../../icons';
import { Text } from '../../typography';

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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  ${Container} {
    width: 300px;
    margin: 0 auto;
  }
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

const blankPageItems = [
  { label: 'Change background color', Icon: Bucket },
  { label: 'Insert media', Icon: Media, separator: 'top' },
  { label: 'Insert text', Icon: LetterTPlus },
];

const backgroundImageItems = [
  { label: 'Replace background', Icon: PictureSwap },
  { label: 'Add animation', Icon: CircleSpeed },
  { label: 'Clear filters and animation', Icon: Eraser, separator: 'top' },
];

const foregroundImageItems = [
  { label: 'Replace media', Icon: PictureSwap },
  { label: 'Add animation', Icon: CircleSpeed },
  { label: 'Add link', Icon: Link },
  { label: 'Clear filters and animation', Icon: Eraser, separator: 'top' },
];

const videoItems = [
  { label: 'Replace media', Icon: PictureSwap },
  { label: 'Add animation', Icon: CircleSpeed },
  { label: 'Add link', Icon: Link },
  { label: 'Add captions', Icon: Captions },
  { label: 'Clear filters and animation', Icon: Eraser, separator: 'top' },
];

const shapeItems = [
  { label: 'Change color', Icon: Bucket },
  { label: 'Add animation', Icon: CircleSpeed },
  { label: 'Add link', Icon: Link },
  { label: 'Clear filters and animation', Icon: Eraser, separator: 'top' },
];

const textItems = [
  { label: 'Change color', Icon: Bucket },
  { label: 'Edit text', Icon: LetterTLargeLetterTSmall },
  { label: 'Add animation', Icon: CircleSpeed },
  { label: 'Add link', Icon: Link },
  { label: 'Clear filters and animation', Icon: Eraser, separator: 'top' },
];

export const QuickActionMenu = () => {
  const generateMenuItemsWithEventHandler = (i) =>
    i.map((item) => ({
      ...item,
      onClick: () => action(`Clicked on \`${item.label}\``)(),
    }));

  return (
    <Grid>
      <Container>
        <Text>{'Blank page; no item selected'}</Text>
        <ContextMenu
          items={generateMenuItemsWithEventHandler(blankPageItems)}
          isIconMenu
          isAlwaysVisible
        />
      </Container>
      <Container>
        <Text>{'Background Image selected'}</Text>
        <ContextMenu
          items={generateMenuItemsWithEventHandler(backgroundImageItems)}
          isIconMenu
          isAlwaysVisible
        />
      </Container>
      <Container>
        <Text>{'Foreground Image selected'}</Text>
        <ContextMenu
          items={generateMenuItemsWithEventHandler(foregroundImageItems)}
          isIconMenu
          isAlwaysVisible
        />
      </Container>
      <Container>
        <Text>{'Video selected'}</Text>
        <ContextMenu
          items={generateMenuItemsWithEventHandler(videoItems)}
          isIconMenu
          isAlwaysVisible
        />
      </Container>
      <Container>
        <Text>{'Shape selected'}</Text>
        <ContextMenu
          items={generateMenuItemsWithEventHandler(shapeItems)}
          isIconMenu
          isAlwaysVisible
        />
      </Container>
      <Container>
        <Text>{'Text selected'}</Text>
        <ContextMenu
          items={generateMenuItemsWithEventHandler(textItems)}
          isIconMenu
          isAlwaysVisible
        />
      </Container>
    </Grid>
  );
};

// todo these shortcuts need  translations!
const rightClickMenuMainOptions = [
  {
    label: __('Copy', 'web-stories'),
    ariaLabel: __('Copy element', 'web-stories'),
    shortcut: '⌘X',
  },
  {
    label: __('Paste', 'web-stories'),
    ariaLabel: __('Paste element', 'web-stories'),
    shortcut: '⌘C',
  },
  {
    label: __('Delete', 'web-stories'),
    ariaLabel: __('Delete element', 'web-stories'),
    shortcut: 'DEL',
  },
];

const rightClickMenuLayeringOptions = [
  {
    label: __('Send to Back', 'web-stories'),
    separator: 'top',
    shortcut: '⌥⌘[',
  },
  { label: __('Send Backwards', 'web-stories'), shortcut: '⌘[' },
  { label: __('Bring Forward', 'web-stories'), shortcut: '⌘]' },
  { label: __('Bring to Front', 'web-stories'), shortcut: '⌥⌘]' },
];

const rightClickMenuPageAddOptions = [
  { label: __('Add new page before', 'web-stories'), separator: 'top' },
  { label: __('Add new page after', 'web-stories') },
];

const rightClickMenuPageDeleteOptions = [
  { label: __('Duplicate page', 'web-stories') },
  { label: __('Delete page', 'web-stories') },
];

const rightClickMenuStyleOptions = [
  { label: __('Copy style', 'web-stories'), separator: 'top', shortcut: '⌥⌘C' },
  { label: __('Paste style', 'web-stories'), shortcut: '⌥⌘V' },
  { label: __('Clear style', 'web-stories') },
];

const pageElement = [
  ...rightClickMenuMainOptions,
  ...rightClickMenuPageAddOptions,
  ...rightClickMenuPageDeleteOptions,
];

const shapeElement = [
  ...rightClickMenuMainOptions,
  ...rightClickMenuLayeringOptions,
  ...rightClickMenuStyleOptions,
  { label: __('Add color to "Saved colors"', 'web-stories') },
];

const foregroundMediaElement = [
  ...rightClickMenuMainOptions,
  ...rightClickMenuLayeringOptions,
  { label: __('Set as page background', 'web-stories'), separator: 'top' },
  { label: __('Scale & crop image', 'web-stories') },
  ...rightClickMenuStyleOptions,
];

const backgroundMediaElement = [
  ...rightClickMenuMainOptions,
  {
    label: __('Detach image from background', 'web-stories'),
    separator: 'top',
  },
  { label: __('Replace background image', 'web-stories') },
  { label: __('Scale & crop background image', 'web-stories') },
  { label: __('Clear style', 'web-stories') },
  ...rightClickMenuPageAddOptions,
  ...rightClickMenuPageDeleteOptions,
];

const textElement = [
  ...rightClickMenuMainOptions,
  ...rightClickMenuLayeringOptions,
  ...rightClickMenuStyleOptions,
  { label: __('Add style to "Saved styles"', 'web-stories') },
  { label: __('Add color to "Saved colors"', 'web-stories') },
];

const SampleLayout = styled.div`
  display: block;
  width: 400px;
  height: 800px;
  border: 1px solid black;
`;

const RightClickContextMenuContainer = styled.div`
  position: absolute;
  top: ${({ position }) => position?.y ?? 0}px;
  left: ${({ position }) => position?.x ?? 0}px;
`;

export const RightClickMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({});
  const layoutRef = useRef();

  const generateMenuItemsWithEventHandler = (i) =>
    i.map((item) => ({
      ...item,
      onClick: () => {
        action(`Clicked on \`${item.label}\``)();
        setIsOpen(false);
      },
    }));
  const handleMenu = (e) => {
    e.preventDefault();
    const layoutRect = layoutRef?.current?.getBoundingClientRect();

    setIsOpen(true);
    setMenuPosition({
      x: e.clientX - layoutRect?.left,
      y: e.clientY - layoutRect?.top,
    });
  };
  return (
    <ViewportContainer>
      {/*eslint-disable-next-line styled-components-a11y/no-noninteractive-element-interactions*/}
      <SampleLayout
        ref={layoutRef}
        onClick={handleMenu}
        // TODO: confirm we don't need this menu to  show up for keyboards since they have a separate menu
        role="region"
        onKeyDown={() => {}}
      />
      <RightClickContextMenuContainer position={menuPosition}>
        <AnimatedContextMenu
          isOpen={isOpen}
          onDismiss={() => setIsOpen(false)}
          items={generateMenuItemsWithEventHandler(pageElement)}
        />
      </RightClickContextMenuContainer>
    </ViewportContainer>
  );
};
export const RightClickMenuStaticValues = () => {
  const generateMenuItemsWithEventHandler = (i) =>
    i.map((item) => ({
      ...item,
      onClick: () => {
        action(`Clicked on \`${item.label}\``)();
      },
    }));

  return (
    <Grid>
      <Container>
        <Text>{'Right click on page element'}</Text>
        <ContextMenu
          isOpen={boolean('isOpen', true)}
          items={generateMenuItemsWithEventHandler(pageElement)}
        />
      </Container>
      <Container>
        <Text>{'Right click on shape element'}</Text>
        <ContextMenu
          isOpen={boolean('isOpen', true)}
          items={generateMenuItemsWithEventHandler(shapeElement)}
        />
      </Container>
      <Container>
        <Text>{'Right click on foreground media element'}</Text>
        <ContextMenu
          isOpen={boolean('isOpen', true)}
          items={generateMenuItemsWithEventHandler(foregroundMediaElement)}
        />
      </Container>
      <Container>
        <Text>{'Right click on background element'}</Text>
        <ContextMenu
          isOpen={boolean('isOpen', true)}
          items={generateMenuItemsWithEventHandler(backgroundMediaElement)}
        />
      </Container>
      <Container>
        <Text>{'Right click on text element'}</Text>
        <ContextMenu
          isOpen={boolean('isOpen', true)}
          items={generateMenuItemsWithEventHandler(textElement)}
        />
      </Container>
    </Grid>
  );
};
