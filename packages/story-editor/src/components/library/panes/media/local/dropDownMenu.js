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
  PLACEMENT,
  Popup,
  noop,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useLocalMedia } from '../../../../../app';
import { ActionButton } from '../../shared';
import DropDownKeyEvents from '../../../../panels/utils/dropDownKeyEvents';
import DeleteDialog from './deleteDialog';
import MediaEditDialog from './mediaEditDialog';

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
  EDIT: 'edit',
  DELETE: 'delete',
};

/**
 * Get a More icon that displays a dropdown menu on click.
 *
 * @param {Object} props Component props.
 * @param {Object} props.resource Selected media element's resource object.
 * @param {boolean} props.display Whether the more icon should be displayed.
 * @param {boolean} props.isMenuOpen If the dropdown menu is open.
 * @param {Function} props.onMenuOpen Callback for when menu is opened.
 * @param {Function} props.onMenuCancelled Callback for when menu is closed without any selections.
 * @param {Function} props.onMenuSelected Callback for when menu is closed and an option selected.
 * @param {Function} props.setParentActive Sets the parent element active.
 * @return {null|*} Element or null if should not display the More icon.
 */
function DropDownMenu({
  resource,
  display,
  isMenuOpen,
  onMenuOpen,
  onMenuCancelled,
  onMenuSelected,
  setParentActive = noop,
}) {
  const options = [
    {
      group: [
        {
          label: __('Edit meta data', 'web-stories'),
          value: MENU_OPTIONS.EDIT,
        },
        {
          label: __('Delete from library', 'web-stories'),
          value: MENU_OPTIONS.DELETE,
        },
      ],
    },
  ];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const moreButtonRef = useRef();

  const onClose = useCallback(() => {
    onMenuCancelled();
    moreButtonRef.current?.focus();
    // Activeness of the parent is lost then due to blurring, we need to set it active "manually"
    // to focus back on the original button.
    setParentActive();
  }, [onMenuCancelled, setParentActive]);

  const { canTranscodeResource } = useLocalMedia(
    ({ state: { canTranscodeResource } }) => ({
      canTranscodeResource,
    })
  );

  const handleCurrentValue = (evt, value) => {
    onMenuSelected();
    switch (value) {
      case MENU_OPTIONS.EDIT:
        setShowEditDialog(true);
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

  // On Edit dialog closing.
  const onEditDialogClose = useCallback(() => {
    setShowEditDialog(false);
    onClose();
  }, [setShowEditDialog, onClose]);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    canTranscodeResource(resource) && ( // Don't show menu if resource is being processed.
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
            placement={PLACEMENT.BOTTOM_START}
            isOpen={isMenuOpen}
          >
            <DropDownContainer>
              <Menu
                parentId={buttonId}
                listId={listId}
                onMenuItemClick={handleCurrentValue}
                options={options}
                onDismissMenu={onClose}
                hasMenuRole
                menuStylesOverride={menuStylesOverride}
              />
            </DropDownContainer>
          </Popup>
        )}
        {showDeleteDialog && (
          <DeleteDialog
            mediaId={resource.id}
            type={resource.type}
            onClose={onDeleteDialogClose}
          />
        )}
        {showEditDialog && (
          <MediaEditDialog resource={resource} onClose={onEditDialogClose} />
        )}
      </MenuContainer>
    )
  );
}

DropDownMenu.propTypes = {
  resource: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuCancelled: PropTypes.func.isRequired,
  onMenuSelected: PropTypes.func.isRequired,
  setParentActive: PropTypes.func,
};

export default DropDownMenu;
