import type { APICallbacks } from './configProvider';

export type Term = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
};

export interface TaxonomyState {
  actions: APICallbacks;
}
