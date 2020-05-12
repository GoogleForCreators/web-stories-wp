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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useCallback, useState, useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { More } from '../../../../components/button';
import DropDownList from '../../../../components/form/dropDown/list';
import Popup from '../../../../components/popup';
import DeleteDialog from './deleteDialog';
import MediaEditDialog from './mediaEditDialog';

const MoreButton = styled(More)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const DropDownContainer = styled.div`
  margin-top: 10px;
`;

/**
 * Get a More icon that displays a dropdown menu on click.
 *
 * @param {Object} props Component props.
 * @param {Object} props.resource Selected media element's resource object.
 * @param {boolean} props.pointerEntered If the user's pointer is in the media element.
 * @param {boolean} props.isMenuOpen If the dropdown menu is open.
 * @param {Function} props.onMenuOpen Callback for when menu is opened.
 * @param {Function} props.onMenuCancelled Callback for when menu is closed without any selections.
 * @param {Function} props.onMenuSelected Callback for when menu is closed and an option selected.
 * @return {null|*} Element or null if should not display the More icon.
 */
function DropDownMenu({
  resource,
  pointerEntered,
  isMenuOpen,
  onMenuOpen,
  onMenuCancelled,
  onMenuSelected,
}) {
  const options = [
    { name: __('Edit', 'web-stories'), value: 'edit' },
    { name: __('Delete', 'web-stories'), value: 'delete' },
  ];

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const moreButtonRef = useRef();

  const handleCurrentValue = (value) => {
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

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    !resource.local && ( // Don't show menu if resource not uploaded to server yet.
      <div>
        {(pointerEntered || isMenuOpen) && (
          <>
            <MoreButton
              ref={moreButtonRef}
              width="28"
              height="28"
              onClick={onMenuOpen}
              aria-pressed={isMenuOpen}
              aria-haspopup={true}
              aria-expanded={isMenuOpen}
            />
            <Popup anchor={moreButtonRef} isOpen={isMenuOpen} width={160}>
              <DropDownContainer>
                <DropDownList
                  handleCurrentValue={handleCurrentValue}
                  options={options}
                  value={options[0].value}
                  toggleOptions={onMenuCancelled}
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
          <MediaEditDialog
            resource={resource}
            showEditDialog={showEditDialog}
            setShowEditDialog={setShowEditDialog}
          />
        )}
      </div>
    )
  );
}

DropDownMenu.propTypes = {
  resource: PropTypes.object.isRequired,
  pointerEntered: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuCancelled: PropTypes.func.isRequired,
  onMenuSelected: PropTypes.func.isRequired,
};

export default DropDownMenu;
