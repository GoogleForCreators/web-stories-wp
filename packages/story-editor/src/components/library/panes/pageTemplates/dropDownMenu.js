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
  useState,
  useMemo,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { v4 as uuidv4 } from 'uuid';
import {
  Icons,
  Menu,
  Placement,
  Popup,
  noop,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { ActionButton } from '../shared';
import DropDownKeyEvents from '../../../panels/utils/dropDownKeyEvents';
import DeleteDialog from './deleteDialog';
import NameDialog from './nameDialog';

const MoreButton = styled(ActionButton)`
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

const MENU_OPTIONS = {
  RENAME: 'Rename',
  DELETE: 'delete',
};

/**
 * Get a More icon that displays a dropdown menu on click.
 *
 * @param {Object} props Component props.
 * @param {boolean} props.display Whether the more icon should be displayed.
 * @param {boolean} props.isMenuOpen If the dropdown menu is open.
 * @param {Function} props.onMenuOpen Callback for when menu is opened.
 * @param {Function} props.onMenuCancelled Callback for when menu is closed without any selections.
 * @param {Function} props.onMenuSelected Callback for when menu is closed and an option selected.
 * @param {Function} props.setParentActive Sets the parent element active.
 * @param {Function} props.onDelete Deletes template.
 * @param {Function} props.onUpdateName updates template name.
 * @param {string} props.previousName Previous name of the template.
 * @return {null|*} Element or null if should not display the More icon.
 */
function DropDownMenu({
  display,
  isMenuOpen,
  onMenuOpen,
  onMenuCancelled,
  onMenuSelected,
  setParentActive = noop,
  onDelete,
  onUpdateName,
  previousName,
}) {
  const groups = [
    {
      options: [
        {
          label: __('Rename Template', 'web-stories'),
          value: MENU_OPTIONS.EDIT,
        },
        {
          label: __('Delete Template', 'web-stories'),
          value: MENU_OPTIONS.DELETE,
        },
      ],
    },
  ];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const moreButtonRef = useRef();

  const onClose = useCallback(() => {
    onMenuCancelled();
    moreButtonRef.current?.focus();
    // Activeness of the parent is lost then due to blurring, we need to set it active "manually"
    // to focus back on the original button.
    setParentActive();
  }, [onMenuCancelled, setParentActive]);

  const handleCurrentValue = (evt, value) => {
    evt.stopPropagation();
    onMenuSelected();
    switch (value) {
      case MENU_OPTIONS.EDIT:
        setShowRenameDialog(true);
        break;
      case MENU_OPTIONS.DELETE:
        setShowDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  // On Delete dialog closing.
  const onDeleteDialogClose = useCallback(() => {
    setShowDeleteDialog(false);
    onClose();
  }, [setShowDeleteDialog, onClose]);

  // On Rename dialog closing.
  const onRenameDialogClose = useCallback(() => {
    setShowRenameDialog(false);
    onClose();
  }, [setShowRenameDialog, onClose]);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <MenuContainer>
      {moreButtonRef.current && (
        <DropDownKeyEvents target={moreButtonRef.current} />
      )}
      <MoreButton
        ref={moreButtonRef}
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
        <Icons.DotsFillSmall />
      </MoreButton>
      {(display || isMenuOpen) && (
        <Popup
          anchor={moreButtonRef}
          placement={Placement.BottomStart}
          isOpen={isMenuOpen}
        >
          <DropDownContainer>
            <Menu
              parentId={buttonId}
              listId={listId}
              handleMenuItemSelect={handleCurrentValue}
              groups={groups}
              onDismissMenu={onClose}
              hasMenuRole
              menuStylesOverride={menuStylesOverride}
            />
          </DropDownContainer>
        </Popup>
      )}
      {showDeleteDialog && (
        <DeleteDialog onClose={onDeleteDialogClose} onDelete={onDelete} />
      )}
      {showRenameDialog && (
        <NameDialog
          onClose={onRenameDialogClose}
          onUpdateName={(name) => {
            onUpdateName(name);
            onRenameDialogClose();
          }}
          title={__('Rename Page Template', 'web-stories')}
          placeholder={previousName}
        />
      )}
    </MenuContainer>
  );
}

DropDownMenu.propTypes = {
  display: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuCancelled: PropTypes.func.isRequired,
  onMenuSelected: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateName: PropTypes.func.isRequired,
  setParentActive: PropTypes.func,
  previousName: PropTypes.string,
};

export default DropDownMenu;
