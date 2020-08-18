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
import { useState } from 'react';

/**
 * WordPress dependencies
 */

import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import { ReactComponent as TextTabIcon } from './text.svg';
import { ReactComponent as TextAddIcon } from './text_add.svg';
import { DEFAULT_PRESET } from './textPresets';

const AnimatedTextIcon = styled(({ isSecondary, ...rest }) => (
  // Necessary because of https://github.com/styled-components/styled-components/pull/2093
  <TextTabIcon {...rest} />
)).attrs(({ isSecondary }) => ({
  style: {
    // scales 28px to 20px
    transform: isSecondary ? 'scale(0.71)' : 'none',
  },
}))``;

const AnimatedTextAddIcon = styled(({ isPrimary, ...rest }) => (
  // Necessary because of https://github.com/styled-components/styled-components/pull/2093
  <TextAddIcon {...rest} />
)).attrs(({ isPrimary }) => ({
  style: {
    // scales 28px to 48px
    transform: isPrimary ? 'scale(1.71)' : 'none',
  },
}))``;

const QuickAction = styled.button`
  margin: 0 0 0 -10px;
  background: transparent;
  border: 0;
  padding: 0;
  line-height: 1;
  overflow: hidden;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.white};
`;

const TextIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0;
  padding: 0;
  margin: 0;
`;

function TextIcon(props) {
  const {
    actions: { insertElement },
  } = useLibrary();

  const [isHoveringQuick, setIsHoveringQuick] = useState(false);
  const [isFocusingQuick, setIsFocusingQuick] = useState(false);

  const handleAddText = (evt) => {
    evt.stopPropagation();
    insertElement('text', DEFAULT_PRESET);
  };
  const { isActive } = props;
  return (
    <TextIconContainer>
      <AnimatedTextIcon
        id="text-tab-icon"
        isSecondary={isHoveringQuick || isFocusingQuick}
        aria-label={__('Text library', 'web-stories')}
      />
      <QuickAction
        aria-label={__('Add new text element', 'web-stories')}
        onClick={handleAddText}
        tabIndex={isActive ? 0 : -1}
        onFocus={() => setIsFocusingQuick(true)}
        onBlur={() => setIsFocusingQuick(false)}
        onPointerOver={() => setIsHoveringQuick(true)}
        onPointerOut={() => setIsHoveringQuick(false)}
      >
        <AnimatedTextAddIcon isPrimary={isHoveringQuick || isFocusingQuick} />
      </QuickAction>
    </TextIconContainer>
  );
}

TextIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
};

export default TextIcon;
