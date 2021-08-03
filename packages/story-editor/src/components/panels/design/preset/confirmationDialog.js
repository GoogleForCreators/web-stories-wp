/*
 * Copyright 2021 Google LLC
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
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import styled from 'styled-components';
import { Text, Checkbox, THEME_CONSTANTS } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import Dialog from '../../../dialog';
import localStore, { LOCAL_STORAGE_PREFIX } from '../../../../utils/localStore';
import { PRESET_TYPES } from './constants';

const Label = styled.label`
  margin-left: 12px;
`;

const CheckboxWrapper = styled.footer`
  display: flex;
  margin-top: 12px;
  padding: 14px 0 0 9px;
  border-top: 1px solid ${({ theme }) => theme.colors.divider.primary};
`;

function ConfirmationDialog({ onClose, onPrimary, presetType }) {
  const isColor = PRESET_TYPES.COLOR === presetType;
  const storageKey =
    PRESET_TYPES.COLOR === presetType
      ? 'DELETE_COLOR_PRESET_DIALOG_DISMISSED'
      : 'DELETE_STYLE_PRESET_DIALOG_DISMISSED';
  const [isDialogDismissed, setIsDialogDismissed] = useState(
    localStore.getItemByKey(LOCAL_STORAGE_PREFIX[storageKey])
  );
  const dialogText = isColor
    ? __(
        'This is a global color. Deleting this color will remove it from the Saved Colors panel across all stories and the color will no longer be available to any other users on the site.',
        'web-stories'
      )
    : __(
        'This is a global style. Deleting this style will remove it from the Saved Styles panel across all stories and the style will no longer be available to any other users on the site.',
        'web-stories'
      );
  const cbId = `cb-${uuidv4()}`;
  return (
    <Dialog
      isOpen
      onClose={onClose}
      secondaryText={__('Cancel', 'web-stories')}
      onPrimary={onPrimary}
      primaryText={__('Delete', 'web-stories')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {dialogText}
      </Text>
      <CheckboxWrapper>
        <Checkbox
          id={cbId}
          checked={isDialogDismissed}
          onChange={() => {
            localStore.setItemByKey(
              LOCAL_STORAGE_PREFIX[storageKey],
              !isDialogDismissed
            );
            setIsDialogDismissed(!isDialogDismissed);
          }}
        />
        <Label htmlFor={cbId}>
          <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__("Don't ask for confirmation again.", 'web-stories')}
          </Text>
        </Label>
      </CheckboxWrapper>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onPrimary: PropTypes.func.isRequired,
  presetType: PropTypes.string.isRequired,
};

export default ConfirmationDialog;
