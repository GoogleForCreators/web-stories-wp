/*
 * Copyright 2023 Google LLC
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
import { useState, useCallback, useEffect } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  ButtonSize,
  ButtonType,
  TextSize,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { validateMgidWidgetIdFormat } from '../../utils';
import {
  InlineForm,
  SaveButton,
  SettingsTextInput,
  TextInputHelperText,
  VisuallyHiddenLabel,
} from '../../components';

export const TEXT = {
  WIDGET_ID_CONTEXT: sprintf(
    /* translators: %s: example value. */
    __('Example: %s', 'web-stories'),
    '1234567'
  ),
  WIDGET_ID_PLACEHOLDER: __('Enter your MGID Widget ID', 'web-stories'),
  WIDGET_ID_LABEL: __('Widget ID', 'web-stories'),
  INPUT_ERROR: __('Invalid ID format', 'web-stories'),
  SUBMIT_BUTTON: __('Save', 'web-stories'),
};

function MgidSettings({ widgetId: mgidWidgetId, handleUpdate }) {
  const [widgetId, setWidgetId] = useState(mgidWidgetId);
  const [widgetIdInputError, setWidgetIdInputError] = useState('');
  const canSaveWidgetId = widgetId !== mgidWidgetId && !widgetIdInputError;
  const disableWidgetIdSaveButton = !canSaveWidgetId;

  useEffect(() => {
    setWidgetId(mgidWidgetId);
  }, [mgidWidgetId]);

  const onUpdateWidgetId = useCallback((event) => {
    const { value } = event.target;
    setWidgetId(value);

    if (value.length === 0 || validateMgidWidgetIdFormat(value)) {
      setWidgetIdInputError('');

      return;
    }

    setWidgetIdInputError(TEXT.INPUT_ERROR);
  }, []);

  const onSaveWidgetId = useCallback(() => {
    if (canSaveWidgetId) {
      handleUpdate(widgetId);
    }
  }, [canSaveWidgetId, widgetId, handleUpdate]);

  const onKeyDownWidgetId = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onSaveWidgetId();
      }
    },
    [onSaveWidgetId]
  );

  return (
    <>
      <InlineForm>
        <VisuallyHiddenLabel htmlFor="mgidWidgetId">
          {TEXT.WIDGET_ID_LABEL}
        </VisuallyHiddenLabel>
        <SettingsTextInput
          id="mgidWidgetId"
          aria-label={TEXT.WIDGET_ID_LABEL}
          value={widgetId}
          onChange={onUpdateWidgetId}
          onKeyDown={onKeyDownWidgetId}
          placeholder={TEXT.WIDGET_ID_PLACEHOLDER}
          hasError={Boolean(widgetIdInputError)}
          hint={widgetIdInputError}
        />
        <SaveButton
          type={ButtonType.Secondary}
          size={ButtonSize.Small}
          disabled={disableWidgetIdSaveButton}
          onClick={onSaveWidgetId}
        >
          {TEXT.SUBMIT_BUTTON}
        </SaveButton>
      </InlineForm>
      <TextInputHelperText size={TextSize.Small}>
        {TEXT.WIDGET_ID_CONTEXT}
      </TextInputHelperText>
    </>
  );
}
MgidSettings.propTypes = {
  handleUpdate: PropTypes.func,
  widgetId: PropTypes.string,
};

export default MgidSettings;
