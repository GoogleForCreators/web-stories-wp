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
/**
 * Internal dependencies
 */
import {
  ExcerptPanel,
  SlugPanel,
  PageAdvancementPanel,
  BackgroundAudioPanel,
  TaxonomiesPanel,
  DOCUMENT_PANEL_NAMES,
} from '../../../../components/panels/document';

const availablePanels = {
  [DOCUMENT_PANEL_NAMES.EXCERPT]: ExcerptPanel,
  [DOCUMENT_PANEL_NAMES.SLUG]: SlugPanel,
  [DOCUMENT_PANEL_NAMES.PAGE_ADVANCEMENT]: PageAdvancementPanel,
  [DOCUMENT_PANEL_NAMES.BACKGROUND_AUDIO]: BackgroundAudioPanel,
  [DOCUMENT_PANEL_NAMES.TAXONOMIES]: TaxonomiesPanel,
};

function DocumentPane({ variant, hiddenPanels = [], isolatedPanel }) {
  if (isolatedPanel) {
    if (Object.keys(availablePanels).indexOf(isolatedPanel) < 0) {
      return null;
    }

    const Panel = availablePanels[isolatedPanel];
    return (
      <Panel
        name={variant ? `${variant}_${isolatedPanel}` : isolatedPanel}
        canCollapse={false}
        isPersistable={false}
      />
    );
  }

  return Object.entries(availablePanels).map(
    ([name, Panel]) =>
      hiddenPanels.indexOf(name) < 0 && (
        <Panel key={name} name={variant ? `${variant}_${name}` : name} />
      )
  );
}

export default DocumentPane;

DocumentPane.propTypes = {
  variant: PropTypes.string,
  hiddenPanels: PropTypes.arrayOf(PropTypes.string),
  isolatedPanel: PropTypes.oneOf(Object.keys(availablePanels)),
};
