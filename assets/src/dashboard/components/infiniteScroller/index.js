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

// TODO
const ScrollMessage = styled.div`
  margin: 20px 0;
  text-align: center;
  width: 100%;
`;

const machine = {
  loadable: {
    LOADING_INTERNAL: 'load_internal',
    LOADING_EXTERNAL: 'load_external',
  },
  load_internal: {
    COMPLETE: 'complete',
    LOADABLE: 'loadable',
  },
  load_external: {
    COMPLETE: 'complete',
    LOADABLE: 'loadable',
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

  const [loadState, dispatch] = useReducer(loadReducer, 'loadable');

  useEffect(() => {
    if (loadState === 'loading_internal') {
      onLoadMoreRef.current();
    }
  }, [loadState]);

  useEffect(() => {
    if (isLoading) {
      dispatch('LOADING_EXTERNAL');
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(canLoadMore ? 'LOADABLE' : 'COMPLETE');
    }
  }, [isLoading, canLoadMore]);

  useEffect(() => {
    if (!loadingRef.current) {
      return () => {};
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            dispatch('LOADING_INTERNAL');
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
