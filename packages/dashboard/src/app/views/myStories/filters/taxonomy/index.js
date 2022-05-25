import { useCallback, useEffect, useRef, useState } from 'react';
import useApi from '../../../../api/useApi';

const useTaxonomyFilter = () => {
  // all the taxonomy types should only need to fetch this once
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

  const fetchTaxonomies = useCallback(
    async (search) => {
      if (!Boolean(taxonomies.current.length)) {
        const data = await getTaxonomies();
        taxonomies.current = data.filter(({ hierarchical }) =>
          Boolean(hierarchical)
        );
      }
      const slugToRestBase = {};
      const promises = taxonomies.current.map((d) => {
        if (!(d.slug in slugToRestBase)) {
          slugToRestBase[d.slug] = d.restBase;
        }
        return new Promise((res) =>
          getTaxonomyTerm(d.restPath, { search }).then(res)
        );
      });
      const fetched = await Promise.all(promises);
      const extraction = fetched.reduce((pre, cur) => {
        return [...pre, ...cur];
      }, []);
      setQueriedTaxonomies(
        extraction.map((e) => ({
          ...e,
          restBase: slugToRestBase[e.taxonomy],
        }))
      );
    },
    [getTaxonomies, getTaxonomyTerm, setQueriedTaxonomies]
  );

  useEffect(() => [fetchTaxonomies()], [fetchTaxonomies]);

  useEffect(() => {
    setCachedTaxonomies();
  }, [queriedTaxonomies]);

  return {
    query: fetchTaxonomies,
    primaryOptions: cachedTaxonomies,
    queriedOptions: queriedTaxonomies,
  };
};

export default useTaxonomyFilter;
