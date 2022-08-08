/*
 * Copyright 2022 Google LLC
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
import {
  useCallback,
  useState,
  useRef,
  useEffect,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import ContextMenu from '../contextMenu';
import { DarkThemeProvider } from '../../../storybookUtils';
import {
  Bucket,
  Captions,
  CheckmarkSmall,
  ChevronRightSmall,
  CircleSpeed,
  Cross,
  Eraser,
  LetterTLargeLetterTSmall,
  LetterTPlus,
  Link as IconLink,
  Media,
  PictureSwap,
} from '../../../icons';
import { Text } from '../../typography';
import { TOOLTIP_PLACEMENT } from '../../tooltip';
import * as MenuItems from '../components';

export default {
  title: 'DesignSystem/Components/ContextMenu',
  component: ContextMenu,
  args: {
    isOpen: true,
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
  parameters: {
    controls: {
      include: ['isOpen', 'onClick'],
    },
  },
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  ${Container} {
    height: 500px;
    width: 300px;
    margin: 0 auto;

    div {
      transform: translate(0, 0);
    }
  }
`;

// eslint-disable-next-line react/prop-types
export const _default = ({ onClick, ...args }) => {
  return (
    <Container>
      <ContextMenu {...args}>
        <MenuItems.MenuButton onClick={() => onClick('one')}>
          {'one'}
        </MenuItems.MenuButton>
        <MenuItems.MenuButton onClick={() => onClick('two')}>
          {'two'}
        </MenuItems.MenuButton>
        <MenuItems.MenuButton onClick={() => onClick('disable')} disabled>
          {'this is disabled'}
        </MenuItems.MenuButton>
        <MenuItems.MenuSeparator />
        <MenuItems.MenuLabel>
          {'i am neither a button nor a link'}
        </MenuItems.MenuLabel>
        <MenuItems.MenuSeparator />
        <MenuItems.MenuButton onClick={() => onClick('i am a button')}>
          {'i am a button!'}
          <MenuItems.MenuShortcut>{'⌥ ⌘ A'}</MenuItems.MenuShortcut>
        </MenuItems.MenuButton>
        <MenuItems.MenuButton
          onClick={() =>
            onClick(
              'Clicked on i am a very very very very very very very long label'
            )
          }
        >
          {'i am a very very very very very very very long label'}
        </MenuItems.MenuButton>
        <MenuItems.MenuLink href="https://www.google.com/">
          {'i am a link!'}
        </MenuItems.MenuLink>
        <MenuItems.MenuLink href="https://www.google.com/" openNewTab>
          {'i am a link that opens a new tab!'}
        </MenuItems.MenuLink>
        <MenuItems.MenuSeparator />
        <MenuItems.MenuGroup label="The oh my section">
          <MenuItems.MenuButton onClick={() => onClick('lions')}>
            {'lions'}
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('tigers')}>
            {'tigers'}
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('bears')}>
            {'bears'}
          </MenuItems.MenuButton>
        </MenuItems.MenuGroup>
      </ContextMenu>
    </Container>
  );
};

// eslint-disable-next-line react/prop-types
export const DarkMode = ({ onClick, ...args }) => {
  return (
    <DarkThemeProvider>
      <Container>
        <ContextMenu {...args}>
          <MenuItems.MenuButton onClick={() => onClick('one')}>
            {'one'}
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('two')}>
            {'two'}
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('disable')} disabled>
            {'this is disabled'}
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuLabel>
            {'i am neither a button nor a link'}
          </MenuItems.MenuLabel>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('i am a button')}>
            {'i am a button!'}
            <MenuItems.MenuShortcut>{'⌥ ⌘ A'}</MenuItems.MenuShortcut>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton
            onClick={() =>
              onClick(
                'Clicked on i am a very very very very very very very long label'
              )
            }
          >
            {'i am a very very very very very very very long label'}
          </MenuItems.MenuButton>
          <MenuItems.MenuLink href="https://www.google.com/">
            {'i am a link!'}
          </MenuItems.MenuLink>
          <MenuItems.MenuLink href="https://www.google.com/" openNewTab>
            {'i am a link that opens a new tab!'}
          </MenuItems.MenuLink>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuGroup label="The oh my section">
            <MenuItems.MenuButton onClick={() => onClick('lions')}>
              {'lions'}
            </MenuItems.MenuButton>
            <MenuItems.MenuButton onClick={() => onClick('tigers')}>
              {'tigers'}
            </MenuItems.MenuButton>
            <MenuItems.MenuButton onClick={() => onClick('bears')}>
              {'bears'}
            </MenuItems.MenuButton>
          </MenuItems.MenuGroup>
        </ContextMenu>
      </Container>
    </DarkThemeProvider>
  );
};

// eslint-disable-next-line react/prop-types
export const QuickActionMenu = ({ onClick, ...args }) => {
  return (
    <Grid>
      <Container>
        <Text>{'Blank page; no item selected'}</Text>
        <ContextMenu isIconMenu {...args}>
          <MenuItems.MenuButton onClick={() => onClick('on the first action')}>
            <MenuItems.MenuIcon title="Change background color">
              <Bucket />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('on the second action')}>
            <MenuItems.MenuIcon title="Insert media">
              <Media />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the third action')}>
            <MenuItems.MenuIcon title="Insert text">
              <LetterTPlus />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Background Image selected'}</Text>
        <ContextMenu isIconMenu {...args}>
          <MenuItems.MenuButton onClick={() => onClick('on the first action')}>
            <MenuItems.MenuIcon title="Replace background">
              <PictureSwap />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the second action')}>
            <MenuItems.MenuIcon title="Add animation">
              <CircleSpeed />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('on the third action')}>
            <MenuItems.MenuIcon title="Clear filters and animation">
              <Eraser />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Foreground Image selected'}</Text>
        <ContextMenu isIconMenu {...args}>
          <MenuItems.MenuButton onClick={() => onClick('on the first action')}>
            <MenuItems.MenuIcon title="Replace media">
              <PictureSwap />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the second action')}>
            <MenuItems.MenuIcon title="Add animation">
              <CircleSpeed />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the third action')}>
            <MenuItems.MenuIcon title="Add link">
              <IconLink />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('on the fourth action')}>
            <MenuItems.MenuIcon title="Clear filters and animation">
              <Eraser />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Video selected'}</Text>
        <ContextMenu isIconMenu {...args}>
          <MenuItems.MenuButton onClick={() => onClick('on the first action')}>
            <MenuItems.MenuIcon title="Replace media">
              <PictureSwap />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the second action')}>
            <MenuItems.MenuIcon title="Add animation">
              <CircleSpeed />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the third action')}>
            <MenuItems.MenuIcon title="Add link">
              <IconLink />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the fourth action')}>
            <MenuItems.MenuIcon title="Add captions">
              <Captions />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('on the fifth action')}>
            <MenuItems.MenuIcon title="Clear filters and animation">
              <Eraser />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Shape selected'}</Text>
        <ContextMenu isIconMenu {...args}>
          <MenuItems.MenuButton onClick={() => onClick('on the first action')}>
            <MenuItems.MenuIcon title="Change color">
              <Bucket />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the second action')}>
            <MenuItems.MenuIcon title="Add animation">
              <CircleSpeed />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the third action')}>
            <MenuItems.MenuIcon title="Add link">
              <IconLink />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('on the fourth action')}>
            <MenuItems.MenuIcon title="Clear filters and animation">
              <Eraser />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
        </ContextMenu>
      </Container>
      <Container>
        <Text>{'Text selected'}</Text>
        <ContextMenu isIconMenu {...args}>
          <MenuItems.MenuButton onClick={() => onClick('on the first action')}>
            <MenuItems.MenuIcon title="Change color">
              <Bucket />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the second action')}>
            <MenuItems.MenuIcon title="Edit text">
              <LetterTLargeLetterTSmall />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the third action')}>
            <MenuItems.MenuIcon title="Add animation">
              <CircleSpeed />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('on the fourth action')}>
            <MenuItems.MenuIcon title="Add link">
              <IconLink />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('on the fifth action')}>
            <MenuItems.MenuIcon title="Clear filters and animation">
              <Eraser />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
        </ContextMenu>
      </Container>
    </Grid>
  );
};

// eslint-disable-next-line react/prop-types
export const HorizontalMenu = ({ onClick, ...args }) => {
  return (
    <Grid>
      <Container>
        <Text>{'Dummy horizontal menu'}</Text>
        <ContextMenu isHorizontal isInline isSecondary {...args}>
          <MenuItems.MenuButton onClick={() => onClick('Clicked on bucket')}>
            <MenuItems.MenuIcon
              title="Bucket"
              placement={TOOLTIP_PLACEMENT.BOTTOM}
            >
              <Bucket />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('Clicked on link')}>
            <MenuItems.MenuIcon
              title="Link"
              placement={TOOLTIP_PLACEMENT.BOTTOM}
            >
              <IconLink />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuButton onClick={() => onClick('Clicked on captions')}>
            <MenuItems.MenuIcon
              title="Captions"
              placement={TOOLTIP_PLACEMENT.BOTTOM}
            >
              <Captions />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('Clicked on animation')}>
            <MenuItems.MenuIcon
              title="Animation"
              placement={TOOLTIP_PLACEMENT.BOTTOM}
            >
              <CircleSpeed />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
          <MenuItems.MenuSeparator />
          <MenuItems.MenuButton onClick={() => onClick('Clicked on cross')}>
            <MenuItems.MenuIcon
              title="Cross"
              placement={TOOLTIP_PLACEMENT.BOTTOM}
            >
              <Cross />
            </MenuItems.MenuIcon>
          </MenuItems.MenuButton>
        </ContextMenu>
      </Container>
    </Grid>
  );
};

const rightClickMenuMainOptions = (
  <>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Copy'}
      <MenuItems.MenuShortcut>{'⌘C'}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Paste'}
      <MenuItems.MenuShortcut>{'⌘V'}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Delete'}
      <MenuItems.MenuShortcut>{'DEL'}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
  </>
);

const rightClickMenuLayeringOptions = (
  <>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Send to back'}
      <MenuItems.MenuShortcut>{'⌥⌘['}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Send backwards'}
      <MenuItems.MenuShortcut>{'⌘['}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Bring forward'}
      <MenuItems.MenuShortcut>{'⌘]'}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Bring to front'}
      <MenuItems.MenuShortcut>{'⌥⌘]'}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
  </>
);

const rightClickMenuPageAddOptions = (
  <>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Add new page before'}
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Add new page after'}
    </MenuItems.MenuButton>
  </>
);

const rightClickMenuPageDeleteOptions = (
  <>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Duplicate page'}
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Delete page'}
    </MenuItems.MenuButton>
  </>
);

const rightClickMenuStyleOptions = (
  <>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Copy style'}
      <MenuItems.MenuShortcut>{'⌥⌘C'}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Paste style'}
      <MenuItems.MenuShortcut>{'⌥⌘V'}</MenuItems.MenuShortcut>
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Clear style'}
    </MenuItems.MenuButton>
  </>
);

const pageMenu = (
  <>
    {rightClickMenuMainOptions}
    <MenuItems.MenuSeparator />
    {rightClickMenuPageAddOptions}
    {rightClickMenuPageDeleteOptions}
  </>
);

const shapeMenu = (
  <>
    {rightClickMenuMainOptions}
    <MenuItems.MenuSeparator />
    {rightClickMenuLayeringOptions}
    <MenuItems.MenuSeparator />
    {rightClickMenuStyleOptions}
    <MenuItems.MenuButton onClick={() => {}}>
      {'Add color to "Saved colors"'}
    </MenuItems.MenuButton>
  </>
);

const foregroundMediaMenu = (
  <>
    {rightClickMenuMainOptions}
    <MenuItems.MenuSeparator />
    {rightClickMenuLayeringOptions}
    <MenuItems.MenuSeparator />
    <MenuItems.MenuButton onClick={() => {}}>
      {'Set as page background'}
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Scale & crop image'}
    </MenuItems.MenuButton>
    <MenuItems.MenuSeparator />
    {rightClickMenuStyleOptions}
  </>
);

const backgroundMediaMenu = (
  <>
    {rightClickMenuMainOptions}
    <MenuItems.MenuSeparator />
    <MenuItems.MenuButton onClick={() => {}}>
      {'Detach image from background'}
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Replace background image'}
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Scale & crop background image'}
    </MenuItems.MenuButton>
    <MenuItems.MenuButton onClick={() => {}}>
      {'Clear style'}
    </MenuItems.MenuButton>
    <MenuItems.MenuSeparator />
    {rightClickMenuPageAddOptions}
    {rightClickMenuPageDeleteOptions}
  </>
);

const TextMenu = ({ children, ...args }) => {
  const ref = useRef();
  const subMenuRef = useRef();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  return (
    <Container ref={ref}>
      {children}
      <ContextMenu {...args}>
        <MenuItems.SubMenuTrigger
          subMenuRef={subMenuRef}
          isSubMenuOpen={isSubMenuOpen}
          parentMenuRef={ref}
          closeSubMenu={() => setIsSubMenuOpen(false)}
          openSubMenu={() => setIsSubMenuOpen(true)}
          label="Heading Level"
          SuffixIcon={ChevronRightSmall}
        />
        <RightClickContextMenuContainer
          position={{
            y: 0,
            x: 212,
          }}
          ref={subMenuRef}
        >
          <ContextMenu
            isOpen={isSubMenuOpen}
            onCloseSubMenu={() => setIsSubMenuOpen(false)}
            isSubMenu
            parentMenuRef={ref}
          >
            <MenuItems.MenuItem
              supportsIcon
              dismissOnClick={false}
              onClick={() => () => setIsSubMenuOpen(false)}
              label={<span>{'Automatic'}</span>}
            />
            <MenuItems.MenuItem
              supportsIcon
              dismissOnClick={false}
              icon={<CheckmarkSmall />}
              onClick={() => setIsSubMenuOpen(false)}
              label={<span>{'Heading 1'}</span>}
            />
            <MenuItems.MenuItem
              supportsIcon
              dismissOnClick={false}
              onClick={() => setIsSubMenuOpen(false)}
              label={<span>{'Heading 2'}</span>}
            />
            <MenuItems.MenuItem
              supportsIcon
              dismissOnClick={false}
              onClick={() => setIsSubMenuOpen(false)}
              label={<span>{'Heading 3'}</span>}
            />
            <MenuItems.MenuItem
              supportsIcon
              dismissOnClick={false}
              onClick={() => setIsSubMenuOpen(false)}
              label={<span>{'Paragraph'}</span>}
            />
          </ContextMenu>
        </RightClickContextMenuContainer>
        <MenuItems.MenuSeparator />
        {rightClickMenuLayeringOptions}
        <MenuItems.MenuSeparator />
        {rightClickMenuStyleOptions}
        <MenuItems.MenuButton onClick={() => {}}>
          {'Add style to "Saved styles"'}
        </MenuItems.MenuButton>
        <MenuItems.MenuButton onClick={() => {}}>
          {'Add color to "Saved colors"'}
        </MenuItems.MenuButton>
      </ContextMenu>
    </Container>
  );
};

TextMenu.propTypes = {
  children: PropTypes.node,
};

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

const RightClickMenuOnShapeAndBackground = ({ children, ...args }) => {
  const ref = useRef();
  const subMenuRef = useRef();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  return (
    <Container ref={ref}>
      {children}
      <ContextMenu {...args}>
        <MenuItems.SubMenuTrigger
          subMenuRef={subMenuRef}
          isSubMenuOpen={isSubMenuOpen}
          parentMenuRef={ref}
          closeSubMenu={() => setIsSubMenuOpen(false)}
          openSubMenu={() => setIsSubMenuOpen(true)}
          label="Select Layer"
          SuffixIcon={ChevronRightSmall}
        />
        <RightClickContextMenuContainer
          position={{
            y: 0,
            x: 212,
          }}
          ref={subMenuRef}
        >
          <ContextMenu
            isOpen={isSubMenuOpen}
            onCloseSubMenu={() => setIsSubMenuOpen(false)}
            isSubMenu
            parentMenuRef={ref}
          >
            <MenuItems.MenuItem
              supportsIcon
              dismissOnClick={false}
              onClick={() => () => setIsSubMenuOpen(false)}
              icon={<CheckmarkSmall />}
              label={<span>{'Select rectangle'}</span>}
            />
            <MenuItems.MenuItem
              supportsIcon
              dismissOnClick={false}
              onClick={() => setIsSubMenuOpen(false)}
              label={<span>{'Select background'}</span>}
            />
          </ContextMenu>
        </RightClickContextMenuContainer>
        <MenuItems.MenuSeparator />
        {shapeMenu}
      </ContextMenu>
    </Container>
  );
};

RightClickMenuOnShapeAndBackground.propTypes = {
  children: PropTypes.node,
};

// eslint-disable-next-line react/prop-types
export const WithSubMenu = ({ onClick, ...args }) => {
  const ref = useRef();
  const subMenuRef = useRef();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const handleSubMenuClick = (clicked) => {
    setIsSubMenuOpen(false);
    onClick(clicked);
  };
  return (
    <Container ref={ref}>
      <ContextMenu {...args}>
        <MenuItems.MenuButton onClick={() => onClick('one')}>
          {'one'}
        </MenuItems.MenuButton>
        <MenuItems.MenuButton onClick={() => onClick('two')}>
          {'two'}
        </MenuItems.MenuButton>
        <MenuItems.MenuButton onClick={() => onClick('disabled')} disabled>
          {'this is disabled'}
        </MenuItems.MenuButton>
        <MenuItems.MenuSeparator />
        <MenuItems.SubMenuTrigger
          subMenuRef={subMenuRef}
          isSubMenuOpen={isSubMenuOpen}
          parentMenuRef={ref}
          closeSubMenu={() => setIsSubMenuOpen(false)}
          openSubMenu={() => setIsSubMenuOpen(true)}
          label="More items"
          SuffixIcon={ChevronRightSmall}
        />
        <RightClickContextMenuContainer
          position={{
            y: 102,
            x: 212,
          }}
          ref={subMenuRef}
        >
          <ContextMenu
            isOpen={isSubMenuOpen}
            onCloseSubMenu={() => setIsSubMenuOpen(false)}
            isSubMenu
            parentMenuRef={ref}
          >
            <MenuItems.MenuButton
              dismissOnClick={false}
              onClick={() => handleSubMenuClick('layer 1')}
            >
              {'Select layer 1'}
            </MenuItems.MenuButton>
            <MenuItems.MenuSeparator />
            <MenuItems.MenuButton
              dismissOnClick={false}
              onClick={() => handleSubMenuClick('select background 1')}
            >
              {'Select background'}
            </MenuItems.MenuButton>
          </ContextMenu>
        </RightClickContextMenuContainer>
        <MenuItems.MenuLabel>
          {'i am neither a button nor a link'}
        </MenuItems.MenuLabel>
        <MenuItems.MenuSeparator />
        <MenuItems.MenuButton onClick={() => onClick('i am a button')}>
          {'i am a button!'}
          <MenuItems.MenuShortcut>{'⌥ ⌘ A'}</MenuItems.MenuShortcut>
        </MenuItems.MenuButton>
      </ContextMenu>
    </Container>
  );
};

export const RightClickMenu = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({});
  const layoutRef = useRef();

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
      <SampleLayout ref={layoutRef} role="region" onKeyDown={() => {}} />
      <RightClickContextMenuContainer position={menuPosition}>
        <ContextMenu
          isOpen={isOpen}
          onDismiss={() => setIsOpen(false)}
          {...args}
        >
          {pageMenu}
        </ContextMenu>
      </RightClickContextMenuContainer>
    </ViewportContainer>
  );
};

export const RightClickMenuStaticValues = (args) => {
  return (
    <Grid>
      <RightClickMenuOnShapeAndBackground {...args}>
        <Text>{'Right click menu on top of shape and background'}</Text>
      </RightClickMenuOnShapeAndBackground>
      <Container>
        <Text>{'Right click on page element'}</Text>
        <ContextMenu {...args}>{pageMenu}</ContextMenu>
      </Container>
      <Container>
        <Text>{'Right click on shape element'}</Text>
        <ContextMenu {...args}>{shapeMenu}</ContextMenu>
      </Container>
      <Container>
        <Text>{'Right click on foreground media element'}</Text>
        <ContextMenu {...args}>{foregroundMediaMenu}</ContextMenu>
      </Container>
      <Container>
        <Text>{'Right click on background element'}</Text>
        <ContextMenu {...args}>{backgroundMediaMenu}</ContextMenu>
      </Container>
      <TextMenu {...args}>
        <Text>{'Right click on text element'}</Text>
      </TextMenu>
    </Grid>
  );
};
