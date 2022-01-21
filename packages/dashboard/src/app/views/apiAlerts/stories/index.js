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
import { useState } from '@googleforcreators/react';
import {
  Button,
  BUTTON_TYPES,
  SnackbarProvider,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { ApiContext } from '../../../api/apiProvider';
import useApiAlerts from '../../../api/useApiAlerts';

const SnackbarView = () => {
  useApiAlerts();
  return <div />;
};

export default {
  title: 'Dashboard/Views/DashboardSnackbar',
  component: SnackbarView,
};

const storyErrors = [
  { message: 'I am an error about loading stories.' },
  { message: 'I am another error about loading stories.' },
  { message: 'Error updating story.' },
  { message: 'Something is really not working!' },
  { message: 'I am the last preloaded error for stories in this storybook.' },
];

const templateErrors = [
  { message: 'I am a template error.' },
  { message: 'I am another template error.' },
  { message: 'I am the third template error.' },
  { message: 'Something is really not working (still)!' },
  { message: 'I am the last preloaded error for templates in this storybook.' },
];

export const _default = () => {
  const [storyError, setStoryError] = useState();
  const [storyErrorIndexToAdd, setStoryErrorIndexToAdd] = useState(0);
  const [templateError, setTemplateError] = useState();
  const [templateErrorIndexToAdd, setTemplateErrorIndexToAdd] = useState(0);

  return (
    <ApiContext.Provider
      value={{
        state: {
          stories: { error: storyError },
          templates: { error: templateError },
          settings: { error: {} },
          media: { error: {} },
        },
      }}
    >
      <Button
        type={BUTTON_TYPES.PRIMARY}
        onClick={() => {
          setStoryErrorIndexToAdd(storyErrorIndexToAdd + 1);
          setStoryError({
            ...storyErrors[storyErrorIndexToAdd],
            id: Date.now(),
          });
        }}
        isDisabled={storyErrorIndexToAdd > storyErrors.length - 1}
      >
        {storyErrorIndexToAdd > storyErrors.length - 1
          ? 'No more practice story alerts'
          : 'Add practice story alert'}
      </Button>
      <br />
      <Button
        type={BUTTON_TYPES.PRIMARY}
        onClick={() => {
          setTemplateErrorIndexToAdd(templateErrorIndexToAdd + 1);
          setTemplateError({
            ...templateErrors[templateErrorIndexToAdd],
            id: Date.now(),
          });
        }}
        isDisabled={templateErrorIndexToAdd > templateErrors.length - 1}
      >
        {templateErrorIndexToAdd > templateErrors.length - 1
          ? 'No more practice template alerts'
          : 'Add practice template alert'}
      </Button>
      <SnackbarProvider>
        <SnackbarView />
      </SnackbarProvider>
    </ApiContext.Provider>
  );
};
