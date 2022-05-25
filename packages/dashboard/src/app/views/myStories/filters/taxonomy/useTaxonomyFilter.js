import { useCallback, useEffect, useRef, useState } from 'react';
import useApi from '../../../../api/useApi';

const useTaxonomyFilter = () => {
  const taxonomies = useRef([]);
  const [cachedTaxonomies, _setCachedTaxonomies] = useState([]);
  const [queriedTaxonomies, setQueriedTaxonomies] = useState([]);

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

  // keep track of the searched values
  const setCachedTaxonomies = useCallback(() => {
    _setCachedTaxonomies((current) => {
      const cached = current.map((c) => ({
        slug: c.filterSlug,
        id: c.filterId,
      }));
      const queried = queriedTaxonomies.filter(
        (q) =>
          !cached.find((c) => c.slug === q.filterSlug && c.id === q.filterId)
      );
      return [...current, ...queried];
    });
  }, [queriedTaxonomies]);

  const queryTaxonomies = useCallback(
    async (search) => {
      // all the taxonomy types should only need to be fetch once
      if (!Boolean(taxonomies.current.length)) {
        const data = await getTaxonomies();
        taxonomies.current = data.filter(({ hierarchical }) =>
          Boolean(hierarchical)
        );
      }

      // search within the taxonomies
      const slugToRestBase = {};
      const promises = taxonomies.current.map((c) => {
        if (!(c.slug in slugToRestBase)) {
          slugToRestBase[c.slug] = c.restBase;
        }
        return new Promise((res) =>
          getTaxonomyTerm(c.restPath, { search }).then(res)
        );
      });
      const fetched = await Promise.all(promises);

      // flatten the taxonomy arrays
      // restBase is needed for filtering
      const extraction = fetched
        .reduce((pre, cur) => {
          return [...pre, ...cur];
        }, [])
        .map((e) => ({
          ...e,
          restBase: slugToRestBase[e.taxonomy],
        }));

      setQueriedTaxonomies(extraction);
    },
    [getTaxonomies, getTaxonomyTerm, setQueriedTaxonomies]
  );

  useEffect(() => {
    queryTaxonomies();
  }, [queryTaxonomies]);

  useEffect(() => {
    setCachedTaxonomies();
  }, [queriedTaxonomies]);

  return {
    query: queryTaxonomies,
    primaryOptions: cachedTaxonomies,
    queriedOptions: queriedTaxonomies,
  };
};

export default useTaxonomyFilter;
