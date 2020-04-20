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
import {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

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
      setLoadMore(false);
    }
  }, [loadMore, handleGetData]);

  const options = {
    root: containerRef.current,
    threshold: 1.0,
  };

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
    options
  );

  useLayoutEffect(() => {
    const currentRef = loadingRef.current;
    if (!isAllDataLoaded) {
      observer.observe(currentRef);
      return () => {
        currentRef && observer.unobserve(currentRef);
      };
    }
    return () => {};
  }, [isAllDataLoaded, loadingRef, observer]);

  return (
    <div ref={containerRef}>
      {children}

      {isAllDataLoaded ? (
        <div>{allDataLoadedMessage}</div>
      ) : (
        <div data-testid="load-more-on-scroll" ref={loadingRef}>
          {loadingMessage}
        </div>
      )}
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
