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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import {
  useCallback,
  useRef,
  useMemo,
  forwardRef,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { v4 as uuidv4 } from 'uuid';
import {
  Menu,
  PLACEMENT,
  Popup,
  useKeyDownEffect,
  noop,
  Button,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
  THEME_CONSTANTS,
  DROP_DOWN_ITEM,
  DefaultListItemInner,
  DefaultListItemLabelDisplayText,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../../app';
import useFocusCanvas from '../../../canvas/useFocusCanvas';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';

const MenuButton = styled(Button)`
  top: 4px;
  right: 4px;
`;

const DropDownContainer = styled.div`
  margin-top: 10px;
`;

const MenuContainer = styled.div`
  z-index: 1;
`;

const menuStylesOverride = css`
  min-width: 160px;
  margin-top: 0;
  li {
    display: block;
  }
`;

// This is used for nested roving tab index to detect parent siblings.
const BUTTON_NESTING_DEPTH = 3;

const CustomItemRenderer = forwardRef(function CustomItemRenderer(
  { option, isSelected, ...rest },
  ref
) {
  const { MediaUpload } = useConfig();

  if (option.mediaPickerProps) {
    return (
      <MediaUpload
        {...option.mediaPickerProps}
        render={(open) => (
          <DefaultListItemInner
            {...rest}
            ref={ref}
            isSelected={isSelected}
            disabled={option.disabled}
            aria-disabled={option.disabled}
            onClick={(evt) => {
              rest.onClick?.(evt);
              open(evt);
            }}
          >
            <DefaultListItemLabelDisplayText
              forwardedAs="span"
              size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            >
              {option.label}
            </DefaultListItemLabelDisplayText>
          </DefaultListItemInner>
        )}
      />
    );
  }

  return (
    <DefaultListItemInner
      {...rest}
      ref={ref}
      isSelected={isSelected}
      disabled={option.disabled}
      aria-disabled={option.disabled}
    >
      <DefaultListItemLabelDisplayText
        forwardedAs="span"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
      >
        {option.label}
      </DefaultListItemLabelDisplayText>
    </DefaultListItemInner>
  );
});

CustomItemRenderer.propTypes = {
  option: DROP_DOWN_ITEM,
  isSelected: PropTypes.bool,
};

/**
 * An icon button that displays a dropdown menu on click.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.display Whether the more icon should be displayed.
 * @param {boolean} props.isMenuOpen If the dropdown menu is open.
 * @param {Function} props.onMenuOpen Callback for when menu is opened.
 * @param {Function} props.onMenuClose Callback for when menu is closed without any selections.
 * @param {Function} props.onMenuSelected Callback for when menu is closed and an option selected.
 * @param {Function} props.setParentActive Sets the parent element active.
 * @param {Array} props.options Menu items.
 * @param {Object} props.children Children.
 * @return {null|*} Element or null.
 */
function DropDownMenu({
  display,
  isMenuOpen,
  onMenuOpen,
  onMenuClose,
  onMenuSelected,
  setParentActive = noop,
  options,
  children,
}) {
  const MenuButtonRef = useRef();

  const onClose = useCallback(() => {
    onMenuClose();
    MenuButtonRef.current?.focus();
    // Activeness of the parent is lost then due to blurring, we need to set it active "manually"
    // to focus back on the original button.
    setParentActive();
  }, [onMenuClose, setParentActive]);

  const onMenuItemClick = (evt, value) => {
    onMenuSelected(value);
  };

  useRovingTabIndex(
    { ref: MenuButtonRef.current || null },
    [],
    BUTTON_NESTING_DEPTH
  );
  const focusCanvas = useFocusCanvas();
  useKeyDownEffect(MenuButtonRef.current || null, 'tab', focusCanvas, [
    focusCanvas,
  ]);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <MenuContainer>
      <MenuButton
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.SQUARE}
        ref={MenuButtonRef}
        onClick={onMenuOpen}
        aria-label={__('More', 'web-stories')}
        aria-pressed={isMenuOpen}
        aria-haspopup
        aria-expanded={isMenuOpen}
        aria-owns={isMenuOpen ? listId : null}
        id={buttonId}
        $display={display}
        tabIndex={display || isMenuOpen ? 0 : -1}
      >
        {children}
      </MenuButton>
      {(display || isMenuOpen) && (
        <Popup
          anchor={MenuButtonRef}
          placement={PLACEMENT.BOTTOM_START}
          isOpen={isMenuOpen}
        >
          <DropDownContainer>
            <Menu
              parentId={buttonId}
              listId={listId}
              onMenuItemClick={onMenuItemClick}
              options={options}
              onDismissMenu={onClose}
              hasMenuRole
              menuStylesOverride={menuStylesOverride}
              renderItem={CustomItemRenderer}
            />
          </DropDownContainer>
        </Popup>
      )}
    </MenuContainer>
  );
}

DropDownMenu.propTypes = {
  display: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuClose: PropTypes.func.isRequired,
  onMenuSelected: PropTypes.func.isRequired,
  setParentActive: PropTypes.func,
  options: PropTypes.array,
  children: PropTypes.node,
};

export default DropDownMenu;
