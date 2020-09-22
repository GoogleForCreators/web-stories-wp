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
import { TransformProvider } from '../../../../../../../edit-story/components/transform';
import {
  formattedTemplatesArray,
  STORYBOOK_PAGE_SIZE,
} from '../../../../../../storybookUtils';
import FontProvider from '../../../../../font/fontProvider';
import RelatedGrid from '../';

export default {
  title: 'Dashboard/Views/TemplateDetails/Content/RelatedGrid',
};

export const _default = () => (
  <FontProvider>
    <TransformProvider>
      <RelatedGrid
        pageSize={STORYBOOK_PAGE_SIZE}
        relatedTemplates={formattedTemplatesArray.slice(0, 4)}
        templateActions={{
          createStoryFromTemplate: action('create story from template clicked'),
          handlePreviewTemplate: action('handle preview template clicked'),
        }}
      />
    </TransformProvider>
  </FontProvider>
);
