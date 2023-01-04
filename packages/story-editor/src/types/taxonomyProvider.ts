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
} from '@googleforcreators/elements';

export type TaxonomiesBySlug = Record<TaxonomySlug, Taxonomy>;

export interface TaxonomySearchArgs {
  search?: string;
  per_page?: number;
}

export interface createTermProps {
  taxonomy: Taxonomy;
  termName: string;
  parent: { id?: TermId; slug: string; addToSelection: boolean };
  addToSelection?: boolean;
}

export interface setTermsProps {
  newTerms: Term[];
}

export interface removeTermsProps {
  removeTerms: Term[];
}

export interface addSearchResultsToCacheProps {
  taxonomy: Taxonomy;
  args: TaxonomySearchArgs;
  addNameToSelection?: boolean;
}

export interface addTermToSelectionProps {
  newTerms: Term[];
}

export interface TaxonomyState {
  state: { taxonomies: TaxonomiesBySlug; termCache: Term[]; terms: Term[] };
  actions: {
    createTerm: (props: createTermProps) => Promise<void>;
    addSearchResultsToCache: (
      props: addSearchResultsToCacheProps
    ) => Promise<void>;
    setTerms: (props: setTermsProps) => void;
    addTermToSelection: (props: addTermToSelectionProps) => void;
  };
}

export interface TaxonomyRestError {
  message?: string;
  data?: {
    status: 400 | 401 | 403 | 500;
  };
  code: string;
}
