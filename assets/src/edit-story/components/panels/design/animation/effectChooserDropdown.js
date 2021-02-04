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
import React, { useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Dropdown as DropdownIcon } from '../../../../icons';
import { isKeyboardUser } from '../../../../utils/keyboardOnlyOutline';
import { DropDownSelect, DropDownTitle } from '../../../form/dropDown';
import { ScrollBarStyles } from '../../../library/common/scrollbarStyles';
import Popup, { Placement } from '../../../popup';
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
  onNoEffectSelected,
  isBackgroundEffects = false,
  selectedEffectTitle,
  selectedEffectType,
  disabledTypeOptionsMap,
  direction,
}) {
  const selectRef = useRef();
  const dropdownRef = useRef();
  const [isOpen, _setIsOpen] = useState(false);

  // Prevents following race condition:
  // -> mouseDown on select
  // -> focusOut popup fires -> isOpen = false
  // -> mouseUp on select
  // -> select click fires -> isOpen = !isOpen
  // while maintaining immediate first call to isOpen setter
  const [setIsOpen] = useDebouncedCallback(_setIsOpen, 300, {
    leading: true,
    trailing: false,
  });

  const closeDropDown = useCallback(() => {
    setIsOpen(false);
    if (isKeyboardUser()) {
      // Return keyboard focus to button when closing dropdown
      selectRef.current.focus();
    }
  }, [setIsOpen]);

  return (
    <>
      <DropDownSelect
        aria-label={__('Animation: Effect Chooser', 'web-stories')}
        ref={selectRef}
        onClick={() => setIsOpen(!isOpen)}
      >
        <DropDownTitle>
          {selectedEffectTitle || __('Select Animation', 'web-stories')}
        </DropDownTitle>
        <DropdownIcon />
      </DropDownSelect>
      <Popup
        anchor={selectRef}
        isOpen={isOpen}
        placement={Placement.BOTTOM_START}
      >
        <Container ref={dropdownRef}>
          <EffectChooser
            onNoEffectSelected={onNoEffectSelected}
            onAnimationSelected={onAnimationSelected}
            onDismiss={closeDropDown}
            isBackgroundEffects={isBackgroundEffects}
            disabledTypeOptionsMap={disabledTypeOptionsMap}
            value={selectedEffectType}
            direction={direction}
          />
        </Container>
      </Popup>
    </>
  );
}

EffectChooserDropdown.propTypes = {
  onAnimationSelected: PropTypes.func.isRequired,
  direction: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  isBackgroundEffects: PropTypes.bool,
  selectedEffectTitle: PropTypes.string,
  selectedEffectType: PropTypes.string,
  onNoEffectSelected: PropTypes.func.isRequired,
  disabledTypeOptionsMap: PropTypes.objectOf(
    PropTypes.shape({
      tooltip: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};
