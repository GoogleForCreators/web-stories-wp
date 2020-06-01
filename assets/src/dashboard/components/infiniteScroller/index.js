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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import { useEffect, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { TypographyPresets } from '../typography';

const ScrollMessage = styled.div`
  ${TypographyPresets.Small};
  width: 100%;
  margin: 40px auto;
  text-align: center;
  color: ${({ theme }) => theme.colors.gray500};
`;

const STATE = {
  loadable: 'loadable',
  loading_internal: 'loading_internal',
  loading_external: 'loading_external',
  complete: 'complete',
};

const ACTION = {
  ON_INTERNAL_LOAD: 'internal on load',
  ON_EXTERNAL_LOAD: 'external on load',
  ON_ALL_LOADED: 'all loaded',
  ON_LOAD_SUCCESS: 'load success',
  ON_CAN_LOAD_MORE: 'can load more',
};

const machine = {
  [STATE.loadable]: {
    [ACTION.ON_INTERNAL_LOAD]: STATE.loading_internal,
    [ACTION.ON_EXTERNAL_LOAD]: STATE.loading_external,
  },
  [STATE.loading_internal]: {
    [ACTION.ON_ALL_LOADED]: STATE.complete,
    [ACTION.ON_LOAD_SUCCESS]: STATE.loadable,
  },
  [STATE.loading_external]: {
    [ACTION.ON_ALL_LOADED]: STATE.complete,
    [ACTION.ON_LOAD_SUCCESS]: STATE.loadable,
  },
  [STATE.complete]: {
    [ACTION.ON_CAN_LOAD_MORE]: STATE.loadable,
  },
};

const loadReducer = (state, action) => {
  return machine[state][action] || state;
};

const InfiniteScroller = ({
  allDataLoadedMessage = __('No More Stories', 'web-stories'),
  onLoadMore,
  canLoadMore,
  isLoading,
  loadingMessage = __('Loading…', 'web-stories'),
}) => {
  const loadingRef = useRef(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  const [loadState, dispatch] = useReducer(loadReducer, STATE.loadable);

  useEffect(() => {
    if (loadState === STATE.loading_internal) {
      onLoadMoreRef.current();
    }
  }, [loadState]);

  useEffect(() => {
    if (isLoading) {
      dispatch(ACTION.ON_EXTERNAL_LOAD);
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(canLoadMore ? ACTION.ON_LOAD_SUCCESS : ACTION.ON_ALL_LOADED);
    }
  }, [isLoading, canLoadMore]);

  useEffect(() => {
    if (canLoadMore) {
      dispatch(ACTION.ON_CAN_LOAD_MORE);
    }
  }, [canLoadMore, loadState]);

  useEffect(() => {
    if (!loadingRef.current) {
      return () => {};
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dispatch(ACTION.ON_INTERNAL_LOAD);
          }
        });
      },
      {
        rootMargin: '0px',
        threshold: 1,
      }
    );

    const triggerEl = loadingRef.current;
    observer.observe(triggerEl);
    return () => {
      observer.unobserve(triggerEl);
    };
  }, []);

  return (
    <ScrollMessage data-testid="load-more-on-scroll" ref={loadingRef}>
      {!canLoadMore ? allDataLoadedMessage : loadingMessage}
    </ScrollMessage>
  );
};

InfiniteScroller.propTypes = {
  isLoading: PropTypes.bool,
  onLoadMore: PropTypes.func.isRequired,
  allDataLoadedMessage: PropTypes.string,
  canLoadMore: PropTypes.bool,
  loadingMessage: PropTypes.string,
};
export default InfiniteScroller;
