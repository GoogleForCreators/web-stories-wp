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
import { useTaxonomy } from '../../../../app/taxonomy';
import { SimplePanel } from '../../panel';
import HierarchicalTermSelector from './HierarchicalTermSelector';
import FlatTermSelector from './FlatTermSelector';

function TaxonomiesPanel(props) {
  const { taxonomies } = useTaxonomy(({ state: { taxonomies } }) => ({
    taxonomies,
  }));

  if (!taxonomies.length) {
    return null;
  }

  const allowedTaxonomies = taxonomies.filter((taxonomy) =>
    ['story-categories', 'story-tags'].includes(taxonomy.rest_base)
  );
  allowedTaxonomies.reverse();

  return (
    <SimplePanel
      name="taxonomies"
      title={__('Categories and Tags', 'web-stories')}
      {...props}
    >
      {allowedTaxonomies.map((taxonomy) => {
        switch (taxonomy.rest_base) {
          case 'story-categories':
            return (
              <HierarchicalTermSelector
                taxonomy={taxonomy}
                key={taxonomy.slug}
              />
            );
          case 'story-tags':
            return <FlatTermSelector taxonomy={taxonomy} key={taxonomy.slug} />;
          default:
            return null;
        }
      })}
    </SimplePanel>
  );
}

export default TaxonomiesPanel;
