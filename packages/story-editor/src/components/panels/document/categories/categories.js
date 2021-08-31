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
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { useHighlights, states, styles } from '../../../../app/highlights';
import { SimplePanel } from '../../panel';

function CategoriesPanel() {
  const { highlight, resetHighlight } = useHighlights((state) => ({
    highlight: state[states.EXCERPT],
    resetHighlight: state.onFocusOut,
  }));

  return (
    <SimplePanel
      name="categories"
      title={__('Categories and Tags', 'web-stories')}
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      collapsedByDefault={false}
      isPersistable={!highlight}
    />
  );
}

export default CategoriesPanel;
