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
import { useEffect } from 'react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { Toaster, useToastContext } from '../../../components/toaster';
import { ALERT_SEVERITY } from '../../../constants';
import useApi from '../../api/useApi';

function ToasterView() {
  const { storyError, templateError, settingsError } = useApi(
    ({
      state: {
        stories: { error: storyError },
        templates: { error: templateError },
        settings: { error: settingsError },
      },
    }) => ({ storyError, templateError, settingsError })
  );

  const {
    actions: { removeToast, addToast },
    state: { activeToasts },
  } = useToastContext();

  const enableSettingsView = useFeature('enableSettingsView');

  useEffect(() => {
    if (storyError?.id) {
      addToast({
        message: storyError.message,
        severity: ALERT_SEVERITY.ERROR,
        id: storyError.id,
      });
    }
  }, [storyError, addToast]);

  useEffect(() => {
    if (templateError?.id) {
      addToast({
        message: templateError.message,
        severity: ALERT_SEVERITY.ERROR,
        id: templateError.id,
      });
    }
  }, [templateError, addToast]);

  useEffect(() => {
    if (enableSettingsView && settingsError?.id) {
      addToast({
        message: settingsError.message,
        severity: ALERT_SEVERITY.ERROR,
        id: settingsError.id,
      });
    }
  }, [settingsError, addToast, enableSettingsView]);

  return (
    <Toaster
      activeToasts={activeToasts}
      handleRemoveToast={removeToast}
      isAllowEarlyDismiss
    />
  );
}

export default ToasterView;
