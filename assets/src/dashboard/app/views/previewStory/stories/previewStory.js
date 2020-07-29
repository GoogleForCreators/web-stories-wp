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
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import completeTemplateObject from '../../../../dataUtils/completeTemplateObject';
import PreviewStory from '../';
import { ApiContext } from '../../../api/apiProvider';

export default {
  title: 'Dashboard/Views/PreviewStory',
};

export const _default = () => {
  return (
    <PreviewStory
      story={completeTemplateObject}
      isTemplate
      handleClose={action('close action triggered')}
    />
  );
};

export const NoStoryToPreview = () => {
  return <PreviewStory handleClose={action('close action triggered')} />;
};

export const ErrorRenderingPreview = () => {
  return (
    <ApiContext.Provider
      value={{
        state: {
          stories: {
            error: { message: { title: 'An error was returned!' } },
            isLoading: false,
            previewMarkup: '',
          },
        },
        actions: {
          storyApi: {
            createStoryPreviewFromTemplate: action(
              'create story from template'
            ),
            clearStoryPreview: action('clear preview from reducer'),
          },
        },
      }}
    >
      <PreviewStory
        story={completeTemplateObject}
        handleClose={action('close action triggered')}
      />
    </ApiContext.Provider>
  );
};

export const LoadingPreview = () => {
  return (
    <ApiContext.Provider
      value={{
        state: {
          stories: { error: {}, isLoading: true, previewMarkup: '' },
        },
        actions: {
          storyApi: {
            createStoryPreviewFromTemplate: action(
              'create story from template'
            ),
            clearStoryPreview: action('clear preview from reducer'),
          },
        },
      }}
    >
      <PreviewStory
        story={completeTemplateObject}
        handleClose={action('close action triggered')}
      />
    </ApiContext.Provider>
  );
};
