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

const availablePanels = {
  [WP_DOCUMENT_PANEL_NAMES.STATUS]: StatusPanel,
  [WP_DOCUMENT_PANEL_NAMES.PUBLISH]: PublishPanel,
  [DOCUMENT_PANEL_NAMES.EXCERPT]: ExcerptPanel,
  [DOCUMENT_PANEL_NAMES.SLUG]: SlugPanel,
  [DOCUMENT_PANEL_NAMES.PAGE_ADVANCEMENT]: PageAdvancementPanel,
  [DOCUMENT_PANEL_NAMES.BACKGROUND_AUDIO]: BackgroundAudioPanel,
  [DOCUMENT_PANEL_NAMES.TAXONOMIES]: TaxonomiesPanel,
};

/**
 *
 * @param {Object} props Props.
 * @param {string} props.variant When present, will update panel name from default name (key from available panels).
 * @param {Array.<string>} props.hiddenPanels An array of panel names that when present, will prevent the panel the name corresponds to from rendering.
 * @return {Node} panel to display.
 */
function DocumentPane({ variant, hiddenPanels = [] }) {
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
};
