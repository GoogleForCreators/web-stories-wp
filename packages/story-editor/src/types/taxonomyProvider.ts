import type { APICallbacks } from './configProvider';

export type Term = {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  _links: Record<string, string>;
};

export type Terms = [Term[]];

export interface TaxonomyState {
  actions: APICallbacks;
}
