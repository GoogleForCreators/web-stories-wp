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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import Dialog from '../../../dialog';
import { Plain } from '../../../button';

const DialogBody = styled.p`
  margin: 0;
`;

function ConfirmPageLayoutDialog(props) {
  const { onClose, onConfirm } = props;

  return (
    <Dialog
      open
      onClose={onClose}
      title={__('Confirm Page Layout', 'web-stories')}
      actions={
        <>
          <Plain onClick={onClose}>{__('Cancel', 'web-stories')}</Plain>
          <Plain onClick={onConfirm}>
            {__('Apply Page Layout', 'web-stories')}
          </Plain>
        </>
      }
    >
      <DialogBody>
        {__(
          'Applying page layout will clear all existing design elements and background colors on this page. Want to keep going?',
          'web-stories'
        )}
      </DialogBody>
    </Dialog>
  );
}

ConfirmPageLayoutDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmPageLayoutDialog;
