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
import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from '@googleforcreators/react';
import useApi from '../../../api/useApi';

/**
 * Internal dependencies
 */

export const filterContext = createContext({
  state: {},
});
// TODO: remove/update other taxonomy filter code
// TODO: maybe extract the taxonomy actions
const filterReducer = (state, { type, payload = {} }) => {
  let newState = state;
  switch (type) {
    case 'SET_TAXONOMIES': {
      newState = {
        ...state,
        taxonomy: { ...state.taxonomy, queriedTaxonomies: payload },
      };
      break;
    }
    case 'UPDATE_TAXONOMY_ID': {
      const { id, slug } = payload;
      console.log('id', id);
      console.log('slug', slug);
      newState = {
        ...state,
        taxonomy: { ...state.taxonomy, filterId: id, filterSlug: slug },
      };
      break;
    }
    case 'UPDATE_TAXONOMY_SEARCH': {
      const { search } = payload;
      console.log('search: ', search);
      newState = {
        ...state,
        taxonomy: { ...state.taxonomy, search },
      };
      break;
    }
  }
  return newState;
};

export default function FiltersProvider({ children }) {
  // TODO: extract all this logic and import the taxonomy functionality
  const taxonomies = useRef([]);

  const { getTaxonomies, getTaxonomyTerm } = useApi(
    ({
      actions: {
        taxonomyApi: { getTaxonomies, getTaxonomyTerm },
      },
    }) => ({
      getTaxonomies,
      getTaxonomyTerm,
    })
  );

  // TODO: refactor
  const fetchTaxonomies = useCallback(
    async (search) => {
      if (!Boolean(taxonomies.current.length)) {
        const data = await getTaxonomies();
        taxonomies.current = data.filter(({ hierarchical }) =>
          Boolean(hierarchical)
        );
      }
      const promises = taxonomies.current.map((d) => {
        return new Promise((res) =>
          getTaxonomyTerm(d.restPath, { search }).then(res)
        );
      });
      const fetched = await Promise.all(promises);
      const extraction = fetched
        .reduce((pre, cur) => {
          return [...pre, ...cur];
        }, [])
        // This is suppper ugly and only needed for 'verticals'
        // currently using the 'taxonomy' propery which is correct for categories
        // 'web_story_category', 'verticals' need 'story-verticals' the 'taxonomy' is 'story-vertical' though
        // I might be able to find and change on the backend, but I need to make sure this was a mess up
        .map((e) => {
          const t = taxonomies.current.find((i) => i.slug == e.taxonomy);
          return { ...e, taxonomy: t.restBase };
        });
      return extraction;
    },
    [getTaxonomies, getTaxonomyTerm, taxonomies.current]
  );

  const [state, dispatch] = useReducer(filterReducer, {
    taxonomy: {
      filterSlug: null,
      filterId: null,
      search: null,
      query: fetchTaxonomies,
      queriedTaxonomies: [],
    },
  });

  useEffect(() => {
    fetchTaxonomies().then((res) =>
      dispatch({ type: 'SET_TAXONOMIES', payload: res })
    );
  }, [fetchTaxonomies]);

  return (
    <filterContext.Provider value={[state, dispatch]}>
      {children}
    </filterContext.Provider>
  );
}
