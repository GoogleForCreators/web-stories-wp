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
import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ScrollMessage = styled.div`
  margin: 20px 0;
  text-align: center;
  width: 100%;
  border: 1px solid green;
  background-color: yellow;
`;
const InfiniteScroller = ({
  allDataLoadedMessage = __('No More Stories', 'web-stories'),
  children,
  handleGetData,
  isAllDataLoaded,
  loadingMessage = __('Loading…', 'web-stories'),
}) => {
  const [loadMore, setLoadMore] = useState(false);
  const loadingRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (loadMore) {
      handleGetData(loadMore);
    }
    setLoadMore(false);
  }, [loadMore, handleGetData]);

  const observer = new IntersectionObserver(
    useCallback(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoadMore(true);
          }
        });
      },
      [setLoadMore]
    ),
    {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 1,
    }
  );

  useEffect(() => {
    const currentIntersectingRef = loadingRef.current;

    if (!isAllDataLoaded && currentIntersectingRef) {
      observer.observe(currentIntersectingRef);
      return () => {
        observer.unobserve(currentIntersectingRef);
      };
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAllDataLoaded,
    loadingRef,
    containerRef,
    observer.observe,
    observer.unobserve,
  ]);
  // we intentionally do not want to watch on just the observer, it will cause everything to load immediately, the observer will just keep getting triggered

  return (
    <div ref={containerRef}>
      {children}

      <ScrollMessage data-testid="load-more-on-scroll" ref={loadingRef}>
        {isAllDataLoaded ? allDataLoadedMessage : loadingMessage}
      </ScrollMessage>
    </div>
  );
};

InfiniteScroller.propTypes = {
  children: PropTypes.node.isRequired,
  handleGetData: PropTypes.func.isRequired,
  allDataLoadedMessage: PropTypes.string,
  isAllDataLoaded: PropTypes.bool,
  loadingMessage: PropTypes.string,
};
export default InfiniteScroller;
