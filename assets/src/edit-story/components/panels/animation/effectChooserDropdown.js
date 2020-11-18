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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import React, { useRef, useState } from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { DropDownSelect, DropDownTitle } from '../../form/dropDown';
import { Dropdown as DropdownIcon } from '../../../icons';
import Popup, { Placement } from '../../popup';
import { ScrollBarStyles } from '../../library/common/scrollbarStyles';
import EffectChooser from './effectChooser';

const Container = styled.div`
  overflow-y: scroll;
  max-height: 240px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 8px;

  ${ScrollBarStyles}
`;

export default function EffectChooserDropdown({
  onAnimationSelected,
  isBackgroundEffects = false,
}) {
  const selectRef = useRef();
  const dropdownRef = useRef();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropDownSelect ref={selectRef} onClick={() => setIsOpen(!isOpen)}>
      <DropDownTitle>{__('Select Animation', 'web-stories')}</DropDownTitle>
      <DropdownIcon />
      <Popup
        anchor={selectRef}
        isOpen={isOpen}
        placement={Placement.BOTTOM_START}
      >
        <Container ref={dropdownRef}>
          <EffectChooser
            onAnimationSelected={onAnimationSelected}
            onDismiss={() => setIsOpen(false)}
            isBackgroundEffects={isBackgroundEffects}
          />
        </Container>
      </Popup>
    </DropDownSelect>
  );
}

EffectChooserDropdown.propTypes = {
  onAnimationSelected: propTypes.func.isRequired,
  isBackgroundEffects: propTypes.bool,
};
