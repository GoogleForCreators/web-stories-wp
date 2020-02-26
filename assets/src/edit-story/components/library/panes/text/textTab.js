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
import useLibrary from '../../useLibrary';
import { Tab } from '../shared';
import paneId from './paneId';
import { ReactComponent as TextIcon } from './text.svg';
import { ReactComponent as TextAddIcon } from './text_add.svg';

const QuickAction = styled.button`
  margin: 0 0 0 -10px;
  background: transparent;
  border: 0;
  padding: 0;
  line-height: 1;
  overflow: hidden;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.v1};

  svg {
    width: 28px;
    height: 28px;
    transform-origin: center center;
    transition: transform 0.1s ease;
  }

  &:hover,
  &:focus {
    svg {
      transform: scale(1.71); /* scales 28px to 48px */
    }
  }
`;

function TextTab(props) {
  const {
    actions: { insertElement },
  } = useLibrary();

  const handleAddText = (evt) => {
    evt.stopPropagation();
    evt.preventDefault();

    // @todo: Needs product definition
    insertElement('text', {
      content: __('Double-click to edit...', 'web-stories'),
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
    <Tab aria-labelledby="text-tab-icon" aria-controls={paneId} {...props}>
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
    </Tab>
  );
}

TextTab.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default TextTab;
