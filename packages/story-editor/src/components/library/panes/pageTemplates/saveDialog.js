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
import { __ } from '@googleforcreators/i18n';
import { Input } from '@googleforcreators/design-system';
import { useState } from '@googleforcreators/react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Dialog from '../../../dialog';

/**
 * Display a confirmation dialog for when a user wants to delete a template.
 *
 * @param {Function} props.onClose Callback to toggle dialog display on close.
 * @param {Function} props.onSave Callback to save template. Template name will be the argument
 * @return {null|*} The dialog element.
 */

const InputWrapper = styled.form`
  margin: 16px 4px;
  width: 470px;
  height: 100px;
`;

function SaveDialog({ onClose, onSave }) {
  const [templateName, setTemplateName] = useState('');
  return (
    <Dialog
      isOpen
      title={__('Save Page Template', 'web-stories')}
      primaryText={__('Save', 'web-stories')}
      onPrimary={() => {
        onSave(templateName);
      }}
      secondaryText={__('Cancel', 'web-stories')}
      onSecondary={onClose}
      onClose={onClose}
    >
      <InputWrapper
        onSubmit={(e) => {
          e.preventDefault();
          onSave(templateName);
        }}
      >
        <Input
          onChange={(e) => {
            setTemplateName(e.target.value);
          }}
          ariaLabel={__('Template name field', 'web-stories')}
          value={templateName}
          label={__('Template name', 'web-stories')}
          placeholder="Untitled"
          type="text"
        />
      </InputWrapper>
    </Dialog>
  );
}

SaveDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default SaveDialog;
