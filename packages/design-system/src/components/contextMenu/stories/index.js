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
import {
  useCallback,
  useState,
  useRef,
  useEffect,
} from '@web-stories-wp/react';
import { _x, __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import ContextMenu from '../contextMenu';
import { DarkThemeProvider } from '../../../storybookUtils';
import {
  Bucket,
  Captions,
  CircleSpeed,
  Eraser,
  LetterTLargeLetterTSmall,
  LetterTPlus,
  Link as IconLink,
  Media,
  PictureSwap,
} from '../../../icons';
import { Text } from '../../typography';
import * as MenuItems from '../menuItems';
import ContextMenuSeparator from '../contextMenuSeparator';
import { Tooltip, TOOLTIP_PLACEMENT } from '../../tooltip';

const items = [
  {
    label: 'Bring to front',
    shortcut: {
      display: '⌥ ⌘ [',
      title: 'my aria label for this shortcut!',
    },
    separator: 'bottom',
  },
  {
    label: 'Clear text styles',
    shortcut: {
      display: '⌥ ⌘ ]',
      title: 'my aria label for this shortcut!',
    },
    disabled: true,
  },
  { label: 'Add style to "Saved style"' },
  { label: 'Add color to "Saved colors"' },
];

const randomItems = [
  { label: 'one' },
  { label: 'two' },
  { label: 'i am a button!' },
  { label: 'neither a button nor a link' },
  { label: 'this is disabled', disabled: true },
  { label: 'three', separator: 'top' },
  {
    label: 'i am a link!',
    href: 'https://www.google.com/',
    shortcut: {
      title: 'option command and the letter A',
      display: '⌥ ⌘ A',
    },
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
  return (
    <Container>
      <ContextMenu isOpen={boolean('isOpen', true)}>
        <MenuItems.Item onClick={action('Clicked on `one`')}>
          {'one'}
        </MenuItems.Item>
        <MenuItems.Item onClick={action('Clicked on `two`')}>
          {'two'}
        </MenuItems.Item>
        <MenuItems.Item onClick={action('Clicked on `disabled`')} disabled>
          {'this is disabled'}
        </MenuItems.Item>
        <ContextMenuSeparator />
        <MenuItems.Label>{'i am neither a button nor a link'}</MenuItems.Label>
        <ContextMenuSeparator />
        <MenuItems.Item onClick={action('Clicked on `i am a button`')}>
          {'i am a button!'}
          <MenuItems.Shortcut>{'⌥ ⌘ A'}</MenuItems.Shortcut>
        </MenuItems.Item>
        <MenuItems.Item
          onClick={action(
            'Clicked on `i am a very very very very very very very long label`'
          )}
        >
          {'i am a very very very very very very very long label'}
        </MenuItems.Item>
        <MenuItems.Link href="https://www.google.com/">
          {'i am a link!'}
        </MenuItems.Link>
        <MenuItems.Link href="https://www.google.com/" openNewTab>
          {'i am a link that opens a new tab!'}
        </MenuItems.Link>
        <ContextMenuSeparator />
        <MenuItems.Group label="The oh my section">
          <MenuItems.Item onClick={action('Clicked on `lions`')}>
            {'lions'}
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on `tigers`')}>
            {'tigers'}
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on `bears`')}>
            {'bears'}
          </MenuItems.Item>
        </MenuItems.Group>
      </ContextMenu>
    </Container>
  );
};

export const DarkMode = () => {
  return (
    <DarkThemeProvider>
      <Container>
        <Container>
          <ContextMenu isOpen={boolean('isOpen', true)}>
            <MenuItems.Item onClick={action('Clicked on `one`')}>
              {'one'}
            </MenuItems.Item>
            <MenuItems.Item onClick={action('Clicked on `two`')}>
              {'two'}
            </MenuItems.Item>
            <MenuItems.Item onClick={action('Clicked on `disabled`')} disabled>
              {'this is disabled'}
            </MenuItems.Item>
            <ContextMenuSeparator />
            <MenuItems.Label>
              {'i am neither a button nor a link'}
            </MenuItems.Label>
            <ContextMenuSeparator />
            <MenuItems.Item onClick={action('Clicked on `i am a button`')}>
              {'i am a button!'}
              <MenuItems.Shortcut>{'⌥ ⌘ A'}</MenuItems.Shortcut>
            </MenuItems.Item>
            <MenuItems.Item
              onClick={action(
                'Clicked on `i am a very very very very very very very long label`'
              )}
            >
              {'i am a very very very very very very very long label'}
            </MenuItems.Item>
            <MenuItems.Link href="https://www.google.com/">
              {'i am a link!'}
            </MenuItems.Link>
            <MenuItems.Link href="https://www.google.com/" openNewTab>
              {'i am a link that opens a new tab!'}
            </MenuItems.Link>
            <ContextMenuSeparator />
            <MenuItems.Group label="The oh my section">
              <MenuItems.Item onClick={action('Clicked on `lions`')}>
                {'lions'}
              </MenuItems.Item>
              <MenuItems.Item onClick={action('Clicked on `tigers`')}>
                {'tigers'}
              </MenuItems.Item>
              <MenuItems.Item onClick={action('Clicked on `bears`')}>
                {'bears'}
              </MenuItems.Item>
            </MenuItems.Group>
          </ContextMenu>
        </Container>
      </Container>
    </DarkThemeProvider>
  );
};

export const QuickActionMenu = () => {
  return (
    <Grid>
      <Container>
        <Text>{'Blank page; no item selected'}</Text>
        <ContextMenu isIconMenu isOpen={boolean('isOpen', true)}>
          <MenuItems.Item onClick={action('Clicked on the first action')}>
            <MenuItems.Icon title="Change background color">
              <Bucket />
            </MenuItems.Icon>
          </MenuItems.Item>
          <ContextMenuSeparator />
          <MenuItems.Item onClick={action('Clicked on the second action')}>
            <MenuItems.Icon title="Insert media">
              <Media />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the third action')}>
            <MenuItems.Icon title="Insert text">
              <LetterTPlus />
            </MenuItems.Icon>
          </MenuItems.Item>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Background Image selected'}</Text>
        <ContextMenu isIconMenu isOpen={boolean('isOpen', true)}>
          <MenuItems.Item onClick={action('Clicked on the first action')}>
            <MenuItems.Icon title="Replace background">
              <PictureSwap />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the second action')}>
            <MenuItems.Icon title="Add animation">
              <CircleSpeed />
            </MenuItems.Icon>
          </MenuItems.Item>
          <ContextMenuSeparator />
          <MenuItems.Item onClick={action('Clicked on the third action')}>
            <MenuItems.Icon title="Clear filters and animation">
              <Eraser />
            </MenuItems.Icon>
          </MenuItems.Item>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Foreground Image selected'}</Text>
        <ContextMenu isIconMenu isOpen={boolean('isOpen', true)}>
          <MenuItems.Item onClick={action('Clicked on the first action')}>
            <MenuItems.Icon title="Replace media">
              <PictureSwap />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the second action')}>
            <MenuItems.Icon title="Add animation">
              <CircleSpeed />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the third action')}>
            <MenuItems.Icon title="Add link">
              <IconLink />
            </MenuItems.Icon>
          </MenuItems.Item>
          <ContextMenuSeparator />
          <MenuItems.Item onClick={action('Clicked on the fourth action')}>
            <MenuItems.Icon title="Clear filters and animation">
              <Eraser />
            </MenuItems.Icon>
          </MenuItems.Item>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Video selected'}</Text>
        <ContextMenu isIconMenu isOpen={boolean('isOpen', true)}>
          <MenuItems.Item onClick={action('Clicked on the first action')}>
            <MenuItems.Icon title="Replace media">
              <PictureSwap />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the second action')}>
            <MenuItems.Icon title="Add animation">
              <CircleSpeed />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the third action')}>
            <MenuItems.Icon title="Add link">
              <IconLink />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the third action')}>
            <MenuItems.Icon title="Add captions">
              <Captions />
            </MenuItems.Icon>
          </MenuItems.Item>
          <ContextMenuSeparator />
          <MenuItems.Item onClick={action('Clicked on the fourth action')}>
            <MenuItems.Icon title="Clear filters and animation">
              <Eraser />
            </MenuItems.Icon>
          </MenuItems.Item>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Shape selected'}</Text>
        <ContextMenu isIconMenu isOpen={boolean('isOpen', true)}>
          <MenuItems.Item onClick={action('Clicked on the first action')}>
            <MenuItems.Icon title="Change color">
              <Bucket />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the second action')}>
            <MenuItems.Icon title="Add animation">
              <CircleSpeed />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the third action')}>
            <MenuItems.Icon title="Add link">
              <IconLink />
            </MenuItems.Icon>
          </MenuItems.Item>
          <ContextMenuSeparator />
          <MenuItems.Item onClick={action('Clicked on the fourth action')}>
            <MenuItems.Icon title="Clear filters and animation">
              <Eraser />
            </MenuItems.Icon>
          </MenuItems.Item>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Text selected'}</Text>
        <ContextMenu isIconMenu isOpen={boolean('isOpen', true)}>
          <MenuItems.Item onClick={action('Clicked on the first action')}>
            <MenuItems.Icon title="Change color">
              <Bucket />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the second action')}>
            <MenuItems.Icon title="Edit text">
              <LetterTLargeLetterTSmall />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the third action')}>
            <MenuItems.Icon title="Add animation">
              <CircleSpeed />
            </MenuItems.Icon>
          </MenuItems.Item>
          <MenuItems.Item onClick={action('Clicked on the third action')}>
            <MenuItems.Icon title="Add link">
              <IconLink />
            </MenuItems.Icon>
          </MenuItems.Item>
          <ContextMenuSeparator />
          <MenuItems.Item onClick={action('Clicked on the fourth action')}>
            <MenuItems.Icon title="Clear filters and animation">
              <Eraser />
            </MenuItems.Icon>
          </MenuItems.Item>
        </ContextMenu>
      </Container>
    </Grid>
  );
};

const rightClickMenuMainOptions = [
  {
    label: __('Copy', 'web-stories'),
    ariaLabel: __('Copy element', 'web-stories'),
    shortcut: {
      display: '⌘X',
      title: _x(
        'Command X',
        'The keyboard keys "Command" and "X"',
        'web-stories'
      ),
    },
  },
  {
    label: __('Paste', 'web-stories'),
    ariaLabel: __('Paste element', 'web-stories'),
    shortcut: {
      display: '⌘C',
      title: _x(
        'Command C',
        'The keyboard keys "Command" and "C"',
        'web-stories'
      ),
    },
  },
  {
    label: __('Delete', 'web-stories'),
    ariaLabel: __('Delete element', 'web-stories'),
    shortcut: {
      display: 'DEL',
      title: _x('Delete', 'The keyboard key "Delete"', 'web-stories'),
    },
  },
];

const rightClickMenuLayeringOptions = [
  {
    label: __('Send to Back', 'web-stories'),
    separator: 'top',
    shortcut: {
      display: '⌥⌘[',
      title: _x(
        'Option Command Left Square Bracket',
        'The keyboard keys "Option", "Command" and "Left Square Bracket"',
        'web-stories'
      ),
    },
  },
  {
    label: __('Send Backwards', 'web-stories'),
    shortcut: {
      display: '⌘[',
      title: _x(
        'Command Left Square Bracket',
        'The keyboard keys "Command" and "Left Square Bracket"',
        'web-stories'
      ),
    },
  },
  {
    label: __('Bring Forward', 'web-stories'),
    shortcut: {
      display: '⌘]',
      title: _x(
        'Command Right Square Bracket',
        'The keyboard keys "Command" and "Right Square Bracket"',
        'web-stories'
      ),
    },
  },
  {
    label: __('Bring to Front', 'web-stories'),
    shortcut: {
      display: '⌥⌘]',
      title: _x(
        'Option Command Right Square Bracket',
        'The keyboard keys "Option" "Command" and "Right Square Bracket"',
        'web-stories'
      ),
    },
  },
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
  {
    label: __('Copy style', 'web-stories'),
    separator: 'top',
    shortcut: {
      display: '⌥⌘C',
      title: _x(
        'Option Command C',
        'The keyboard keys "Option" "Command" and the letter "C"',
        'web-stories'
      ),
    },
  },
  {
    label: __('Paste style', 'web-stories'),
    shortcut: {
      display: '⌥⌘V',
      title: _x(
        'Option Command V',
        'The keyboard keys "Option" "Command" and the letter "V"',
        'web-stories'
      ),
    },
  },
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
  const handleMenu = useCallback((e) => {
    e.preventDefault();
    const layoutRect = layoutRef?.current?.getBoundingClientRect();

    setIsOpen(true);
    setMenuPosition({
      x: e.clientX - layoutRect?.left,
      y: e.clientY - layoutRect?.top,
    });
  }, []);

  // Override the browser's context menu
  useEffect(() => {
    const node = layoutRef.current;
    if (!node) {
      return undefined;
    }

    node.addEventListener('contextmenu', handleMenu);

    return () => {
      node.removeEventListener('contextmenu', handleMenu);
    };
  }, [handleMenu]);

  return (
    <ViewportContainer>
      {/*eslint-disable-next-line styled-components-a11y/no-noninteractive-element-interactions*/}
      <SampleLayout
        ref={layoutRef}
        // TODO: confirm we don't need this menu to show up for keyboards since they have a separate menu
        role="region"
        onKeyDown={() => {}}
      />
      <RightClickContextMenuContainer position={menuPosition}>
        <ContextMenu
          animate
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
