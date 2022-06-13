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
  Popup,
  useKeyDownEffect,
  noop,
  PLACEMENT,
  Icons,
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
`;

const ActiveIcon = styled(Icons.CheckmarkSmall)`
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
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
      {isSelected && (
        <ActiveIcon
          data-testid={'dropdownMenuItem_active_icon'}
          aria-label={__('Selected', 'web-stories')}
          width={32}
          height={32}
        />
      )}
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
 * @param {string} props.ariaLabel ARIA label for the toggle button.
 * @param {string} props.className Class name.
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
  ariaLabel = __('More', 'web-stories'),
  className,
  ...rest
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
    <MenuContainer className={className}>
      <MenuButton
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.SQUARE}
        ref={MenuButtonRef}
        onClick={onMenuOpen}
        aria-label={ariaLabel}
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
              {...rest}
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
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default DropDownMenu;
