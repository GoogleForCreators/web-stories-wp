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
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { Button } from '../../../../components';
import { ToastProvider } from '../../../../components/toaster';
import { ApiContext } from '../../../api/apiProvider';
import ToasterView from '../';

export default {
  title: 'Dashboard/Views/Toaster',
  component: ToasterView,
};

const storyErrors = [
  {
    message: {
      body: 'I am an error.',
      title: 'Unable to Load Stories',
    },
  },
  {
    message: {
      body: 'I am another error.',
      title: 'Unable to Load Stories',
    },
  },
  {
    message: {
      body: 'I am the third error.',
      title: 'Unable to Update Story',
    },
  },
  {
    message: {
      body: 'Something is really not working!',
      title: 'Oh No!',
    },
  },
  {
    message: {
      body: 'I am the last preloaded error for stories in this storybook.',
      title: 'Unable to Load Stories',
    },
  },
];

const templateErrors = [
  {
    message: {
      body: 'I am an error.',
      title: 'Unable to Load Templates',
    },
  },
  {
    message: {
      body: 'I am another error.',
      title: 'Unable to Load Templates',
    },
  },
  {
    message: {
      body: 'I am the third error.',
      title: 'Unable to Create Story From Template',
    },
  },
  {
    message: {
      body: 'Something is really not working!',
      title: 'Oh No!',
    },
  },
  {
    message: {
      body: 'I am the last preloaded error for templates in this storybook.',
      title: 'Unable to Load Templates',
    },
  },
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
        },
      }}
    >
      <Button
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
      <ToastProvider>
        <ToasterView />
      </ToastProvider>
    </ApiContext.Provider>
  );
};
