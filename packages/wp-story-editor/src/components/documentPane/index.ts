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
} from '@googleforcreators/story-editor';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import PublishPanel from './publish';
import StatusPanel from './status';

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

// Panels require a name override to have their own local storage set for panel collapse
export function PublishModalDocumentPane() {
  return (
    <>
      <PublishPanel nameOverride="storyDetailsPublishing" />
      <SlugPanel nameOverride="storyDetailsExcerpt" />
      <PageAdvancementPanel nameOverride="storyDetailsPageAdvancement" />
      <BackgroundAudioPanel nameOverride="storyDetailsBackgroundAudio" />
      <TaxonomiesPanel nameOverride="storyDetailsTaxonomies" />
    </>
  );
}

// Isolated Status Panel should not collapse and
// should have its own name to prevent collapse
// based on other implementations that have default name

const IsolatedPanel = styled(StatusPanel)`
  padding: 4px 4px 8px;
`;

export function IsolatedStatusPanel() {
  return (
    <IsolatedPanel
      nameOverride="storyDetailsStatus"
      canCollapse={false}
      isPersistable={false}
      popupZIndex={11}
    />
  );
}

export default DocumentPane;
