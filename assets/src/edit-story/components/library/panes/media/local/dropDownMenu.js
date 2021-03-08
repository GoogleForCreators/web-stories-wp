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
import { useCallback, useRef, useState, useMemo } from 'react';
import { __ } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Menu, PLACEMENT, Popup } from '../../../../../../design-system';
import { More } from '../../../../button';
import DeleteDialog from './deleteDialog';
import MediaEditDialog from './mediaEditDialog';

const MoreButton = styled(More)`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.panel};
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  border-radius: 100%;
`;

const DropDownContainer = styled.div`
  margin-top: 10px;
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
 * @return {null|*} Element or null if should not display the More icon.
 */
function DropDownMenu({
  resource,
  display,
  isMenuOpen,
  onMenuOpen,
  onMenuCancelled,
  onMenuSelected,
}) {
  const options = [
    {
      group: [
        { label: __('Edit', 'web-stories'), value: 'edit' },
        { label: __('Delete', 'web-stories'), value: 'delete' },
      ],
    },
  ];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const moreButtonRef = useRef();

  const handleCurrentValue = (evt, value) => {
    onMenuSelected();
    switch (value) {
      case 'edit':
        setShowEditDialog(true);
        break;
      case 'delete':
        setShowDeleteDialog(true);
        break;
      default:
        break;
    }
  };

  // On Delete dialog closing.
  const onDeleteDialogClose = useCallback(() => setShowDeleteDialog(false), [
    setShowDeleteDialog,
  ]);

  // On Edit dialog closing.
  const onEditDialogClose = useCallback(() => setShowEditDialog(false), [
    setShowEditDialog,
  ]);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    !resource.local && ( // Don't show menu if resource not uploaded to server yet.
      <MenuContainer>
        {(display || isMenuOpen) && (
          <>
            <MoreButton
              ref={moreButtonRef}
              width="28"
              height="28"
              onClick={onMenuOpen}
              aria-label={__('More', 'web-stories')}
              aria-pressed={isMenuOpen}
              aria-haspopup={true}
              aria-expanded={isMenuOpen}
              aria-owns={isMenuOpen ? listId : null}
              id={buttonId}
            />
            <Popup
              anchor={moreButtonRef}
              placement={PLACEMENT.BOTTOM_START}
              isOpen={isMenuOpen}
              width={160}
            >
              <DropDownContainer>
                <Menu
                  parentId={buttonId}
                  listId={listId}
                  onMenuItemClick={handleCurrentValue}
                  options={options}
                  onDismissMenu={onMenuCancelled}
                  hasMenuRole
                  menuStylesOverride={menuStylesOverride}
                />
              </DropDownContainer>
            </Popup>
          </>
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
};

export default DropDownMenu;
