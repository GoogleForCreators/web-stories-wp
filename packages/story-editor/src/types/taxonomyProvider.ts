/*
 * Copyright 2022 Google LLC
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
import type {
  Taxonomy,
  TaxonomySlug,
  Term,
  TermId,
  TermSlug,
} from '@googleforcreators/elements';

export type TaxonomiesBySlug = Record<TaxonomySlug, Taxonomy>;

export type EmbeddedTerms = Record<TaxonomySlug, Record<TermSlug, Term>>;

export interface TaxonomySearchArgs {
  search?: string;
  per_page?: number;
}

export interface TaxonomyState {
  state: { taxonomies: TaxonomiesBySlug; termCache: TermId[]; terms: Term[] };
  actions: {
    createTerm: (
      taxonomy: Taxonomy,
      termName: string,
      parent: { id?: TermId; slug: string; addToSelection: boolean },
      addNameToSelection?: boolean
    ) => Promise<void>;
    addSearchResultsToCache: (
      taxonomy: Taxonomy,
      args: TaxonomySearchArgs,
      addNameToSelection?: boolean
    ) => Promise<void>;
    setTerms: (taxonomy: Taxonomy, ids: TermId[]) => void;
    addTermToSelection: (taxonomy: Taxonomy, selectedTerm: Term) => void;
  };
}

export interface TaxonomyRestError {
  message?: string;
  data?: {
    status: 400 | 401 | 403 | 500;
  };
  code: string;
}
