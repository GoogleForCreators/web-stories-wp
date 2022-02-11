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
import {
  ExcerptPanel,
  SlugPanel,
  PageAdvancementPanel,
  BackgroundAudioPanel,
  TaxonomiesPanel,
  DOCUMENT_PANEL_NAMES,
} from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import PublishPanel from './publish';
import StatusPanel from './status';
import { WP_DOCUMENT_PANEL_NAMES } from './constants';

function DocumentPane() {
  return (
    <>
      <StatusPanel />
      <PublishPanel />
      <ExcerptPanel />
      <SlugPanel />
      <PageAdvancementPanel />
      <BackgroundAudioPanel />
      <TaxonomiesPanel />
    </>
  );
}

export function PublishModalDocumentPane() {
  return (
    <>
      <PublishPanel name={`story_details_${WP_DOCUMENT_PANEL_NAMES.PUBLISH}`} />
      <SlugPanel name={`story_details_${DOCUMENT_PANEL_NAMES.SLUG}`} />
      <PageAdvancementPanel
        name={`story_details_${DOCUMENT_PANEL_NAMES.PAGE_ADVANCEMENT}`}
      />
      <BackgroundAudioPanel
        name={`story_details_${DOCUMENT_PANEL_NAMES.BACKGROUND_AUDIO}`}
      />
      <TaxonomiesPanel
        name={`story_details_${DOCUMENT_PANEL_NAMES.TAXONOMIES}`}
      />
    </>
  );
}

export function IsolatedStatusPanel() {
  return (
    <StatusPanel
      name={`story_details_${WP_DOCUMENT_PANEL_NAMES.STATUS}`}
      canCollapse={false}
      isPersistable={false}
    />
  );
}

export default DocumentPane;
