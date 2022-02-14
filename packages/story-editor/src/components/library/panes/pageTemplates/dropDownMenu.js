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
import { useRef, useMemo, useEffect } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  BUTTON_VARIANTS,
  Icons,
  Menu,
  PLACEMENT,
  Popup,
} from '@googleforcreators/design-system';

const MoreButton = styled(Button).attrs({ variant: BUTTON_VARIANTS.ICON })`
  display: flex;
  align-items: center;
  position: absolute;
  top: calc(50% - 16px);
  right: calc(50% - 16px);
  color: ${({ theme }) => theme.colors.fg.primary};
  border-radius: 100%;
  width: 28px;
  height: 28px;
`;

const IconContainer = styled.div`
  height: 32px;
  width: 32px;
`;

const DropDownContainer = styled.div`
  margin-top: 10px;
  min-width: 160px;
`;

const MenuContainer = styled.div`
  z-index: 1;
`;

const menuStylesOverride = css`
  min-width: 100px;
  margin-top: 0;
  li {
    display: block;
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  z-index: 1;
`;

/**
 * Get a More icon that displays a dropdown menu on click.
 *
 * @param {Object} props Component props.
 * @param {Function} props.onInsert Callback for using page template.
 * @param {Function} props.onDelete Callback for deleting page template.
 * @param {boolean} props.isMenuOpen If menu is open.
 * @param {Function} props.setIsMenuOpen Callback for opening/closing menu.
 * @param {Function} props.handleFocus Callback for when focusing on the dropdown.
 * @param {Function} props.handleClose Callback for when closing the dropdown.
 * @return {null|*} Element or null if should not display the More icon.
 */
function DropDownMenu({
  onInsert,
  onDelete,
  isMenuOpen,
  setIsMenuOpen,
  handleFocus,
  handleClose,
}) {
  const moreButtonRef = useRef();
  const containerRef = useRef();

  // Don't show edit options if resource is being processed.
  const options = [
    {
      group: [
        { label: 'Use page template', value: 'insert' },
        { label: __('Delete', 'web-stories'), value: 'delete' },
      ],
    },
  ];

  useEffect(() => {
    // If we open the menu and it was closed before, let's focus on the first item.
    if (isMenuOpen && containerRef.current) {
      handleFocus();
      const firstMenuItem = containerRef.current.querySelector(
        '[role="menuitem"][tabindex="0"]'
      );

      firstMenuItem?.focus();
    }
  }, [handleFocus, isMenuOpen]);

  const handleCurrentValue = (evt, value) => {
    evt.stopPropagation();
    setIsMenuOpen(false);
    switch (value) {
      case 'delete':
        onDelete(evt);
        break;
      case 'insert':
        onInsert(evt);
        break;
      default:
        break;
    }
  };

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <MenuContainer onFocus={(e) => e.stopPropagation()}>
      <ButtonWrapper>
        <MoreButton
          ref={moreButtonRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(true);
          }}
          aria-label={__('More', 'web-stories')}
          aria-pressed={isMenuOpen}
          aria-haspopup
          aria-expanded={isMenuOpen}
          aria-owns={isMenuOpen ? listId : null}
          id={buttonId}
        >
          <IconContainer>
            <Icons.PlusFilled />
          </IconContainer>
        </MoreButton>
      </ButtonWrapper>
      <Popup
        anchor={moreButtonRef}
        placement={PLACEMENT.BOTTOM_START}
        isOpen={isMenuOpen}
      >
        <DropDownContainer ref={containerRef}>
          <Menu
            parentId={buttonId}
            listId={listId}
            onMenuItemClick={handleCurrentValue}
            options={options}
            onDismissMenu={() => {
              handleClose();
              setIsMenuOpen(false);
            }}
            hasMenuRole
            menuStylesOverride={menuStylesOverride}
          />
        </DropDownContainer>
      </Popup>
    </MenuContainer>
  );
}

DropDownMenu.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onInsert: PropTypes.func.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  setIsMenuOpen: PropTypes.func.isRequired,
  handleFocus: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default DropDownMenu;
