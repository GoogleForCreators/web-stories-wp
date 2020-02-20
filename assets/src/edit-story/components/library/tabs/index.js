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
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import useLibrary from '../useLibrary';
import { ReactComponent as MediaIcon } from './media.svg';
import { ReactComponent as TextIcon } from './text.svg';
import { ReactComponent as TextAddIcon } from './text_add.svg';
import { ReactComponent as ShapesIcon } from './shapes.svg';
import { ReactComponent as ElementsIcon } from './elements.svg';
import { ReactComponent as AnimationIcon } from './animation.svg';

const Tabs = styled.ul`
  background: ${({ theme }) => theme.colors.bg.v3};
  display: flex;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Tab = styled.li`
  width: 72px;
  height: 100%;
  color: ${({ theme }) => theme.colors.fg.v1};
`;

const QuickAction = styled.button`
  margin: 0 0 0 -10px;
  background: transparent;
  border: 0;
  padding: 0;
  line-height: 1;
  position: relative;
  color: ${({ theme }) => theme.colors.fg.v1};

  &:hover::before {
    content: '';
    display: block;
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    left: 5px;
    right: 5px;
    top: 5px;
    bottom: 5px;
  }
`;

const IconContent = styled.div`
  width: 60%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconButton = styled.button.attrs(({ isActive }) => ({
  tabIndex: isActive ? 0 : -1,
}))`
  color: inherit;
  background: ${({ isActive, theme }) =>
    isActive ? theme.colors.bg.v4 : 'transparent'};
  border: 0;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    outline: none;
    & ${IconContent} {
      /* todo: how to show default outline on inner element cross-browser? */
      outline: -webkit-focus-ring-color auto 5px;
    }
  }

  ${({ isActive }) =>
    !isActive &&
    `
  opacity: .5;
  &:hover { opacity: 1; }
  `}

  svg {
    display: block;
    width: 28px;
    height: 28px;
  }
`;

function Media(props) {
  return (
    <Tab>
      <IconButton {...props}>
        <IconContent>
          <MediaIcon aria-label={__('Media library', 'web-stories')} />
        </IconContent>
      </IconButton>
    </Tab>
  );
}

function Text(props) {
  const {
    actions: { insertElement },
  } = useLibrary();

  const handleAddText = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    insertElement('text', {
      content: 'Double-click to edit...',
      color: '#000000',
      fontSize: 100,
      backgroundColor: '#ffffff',
      width: 300,
      height: 100,
      x: 50,
      y: 20,
      rotationAngle: 0,
    });
  };
  const { isActive } = props;
  return (
    <Tab>
      <IconButton {...props} aria-labelledby="text-tab-icon">
        <IconContent>
          <TextIcon
            id="text-tab-icon"
            aria-label={__('Text library', 'web-stories')}
          />
          <QuickAction
            aria-label={__('Add new text element', 'web-stories')}
            onClick={handleAddText}
            tabIndex={isActive ? 0 : -1}
          >
            <TextAddIcon />
          </QuickAction>
        </IconContent>
      </IconButton>
    </Tab>
  );
}

Text.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

function Shapes(props) {
  return (
    <Tab>
      <IconButton {...props}>
        <IconContent>
          <ShapesIcon aria-label={__('Shapes library', 'web-stories')} />
        </IconContent>
      </IconButton>
    </Tab>
  );
}

function Elements(props) {
  return (
    <Tab>
      <IconButton {...props}>
        <IconContent>
          <ElementsIcon aria-label={__('Elements library', 'web-stories')} />
        </IconContent>
      </IconButton>
    </Tab>
  );
}

function Animation(props) {
  return (
    <Tab>
      <IconButton {...props}>
        <IconContent>
          <AnimationIcon aria-label={__('Animation library', 'web-stories')} />
        </IconContent>
      </IconButton>
    </Tab>
  );
}

export { Tabs, Media, Text, Shapes, Elements, Animation };
