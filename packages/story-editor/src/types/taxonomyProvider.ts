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

export type Term = {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  _links: Record<string, string>;
};

export type Taxonomy = {
  restBase: 'web_story_category' | 'web_story_tag' | string;
  name: string;
  restNamespace: string;
  restPath: string;
  showCloud?: boolean;
  slug: string;
  types: string[];
  visibility: {
    public: boolean;
    publicly_queryable: boolean;
    show_admin_column: boolean;
    show_in_nav_menus: boolean;
    show_in_quick_edit: boolean;
    show_ui: boolean;
  };
  description: string;
  hierarchical: boolean;
  labels: {
    add_new_item: string;
    add_or_remove_items: string;
    all_items: string;
    back_to_items: string;
    choose_from_most_used: string;
    edit_item: string;
    items_list: string;
    items_list_navigation: string;
    most_used: string;
    name: string;
    new_item_name: string;
    no_terms: string;
    not_found: string;
    parent_item: string;
    parent_item_colon: string;
    popular_items: string;
    search_items: string;
    separate_items_with_commas: string;
    singular_name: string;
    update_item: string;
    view_item: string;
  };
  capabilities: {
    assign_terms: string;
    delete_terms: string;
    edit_terms: string;
    manage_terms: string;
  };
};

export type TaxonomiesBySlug = Record<string, Taxonomy>;
export type EmbeddedTerms = Record<string, Record<string, Term>>;

export type Terms = [Term[]];

export type TermsIds = (ids: number[]) => number[] | [];

export interface TaxonomyState {
  state: { taxonomies: TaxonomiesBySlug; termCache: TermsIds; terms: Terms };
  actions: {
    createTerm: (
      taxonomy: Taxonomy,
      termName: string,
      parent: { id?: number; slug: string; addToSelection: boolean },
      addNameToSelection?: boolean
    ) => Promise<void>;
    addSearchResultsToCache: (
      taxonomy: Taxonomy,
      args: { search?: string; per_page?: number },
      addNameToSelection?: boolean
    ) => void;
    setTerms: (taxonomy: Taxonomy, ids: [] | TermsIds) => void;
    addTermToSelection: (taxonomy: Taxonomy, selectedTerm: Term) => void;
  };
}
