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

export type TermId = number;

export type TaxonomySlug = string;

export type TermSlug = string;

export type Taxonomy = {
  name: string;
  slug: TaxonomySlug;
  capabilities: Record<string, string>;
  description?: string;
  labels: Record<string, string>;
  types: string[];
  showCloud?: boolean;
  hierarchical: boolean;
  restBase: string;
  restNamespace: string;
  visibility: Record<string, boolean>;
  restPath?: string;
};

export type Term = {
  id: TermId;
  link: string;
  name: string;
  slug: TermSlug;
  taxonomy: TaxonomySlug;
  parent?: number;
  _links: Record<string, string>;
};
