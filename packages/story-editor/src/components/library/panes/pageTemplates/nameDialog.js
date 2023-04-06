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
import { __ } from '@googleforcreators/i18n';
import { Input } from '@googleforcreators/design-system';
import { useState } from '@googleforcreators/react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Dialog from '../../../dialog';

const InputWrapper = styled.form`
  margin: 16px 4px;
  width: 470px;
  height: 100px;
`;

/**
 * Display a dialog for when a user wants to rename a template.
 *
 * @param {Object} props Component props.
 * @param {Function} props.onClose Callback to toggle dialog display on close.
 * @param {Function} props.onSave Callback to save template. Template name will be the argument
 * @param {string} props.title Previous name of the template
 * @param {string} props.placeholder Placeholder input text.
 * @param {string} props.previousInput Prefill input text.
 * @return {null|*} The dialog element.
 */
function NameDialog({ onClose, onSave, title, placeholder, previousInput }) {
  const [templateName, setTemplateName] = useState(previousInput);
  return (
    <Dialog
      isOpen
      title={title}
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
          value={templateName}
          label={__('Template name', 'web-stories')}
          placeholder={placeholder}
          type="text"
        />
      </InputWrapper>
    </Dialog>
  );
}

NameDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  title: PropTypes.string,
  placeholder: PropTypes.string,
  previousInput: PropTypes.string,
};

export default NameDialog;
