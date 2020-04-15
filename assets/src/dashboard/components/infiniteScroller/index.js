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
import 'intersection-observer';

const InfiniteScroller = ({
  allDataLoadedMessage = 'No More Stories',
  children,
  handleGetData,
  isAllDataLoaded,
  loadingMessage = 'Loading...',
}) => {
  const [loadMore, setLoadMore] = useState(false);
  const loadingRef = useRef(null);

  useEffect(() => {
    if (loadMore) {
      handleGetData(loadMore);
      setLoadMore(false);
    }
  }, [loadMore, handleGetData]);

  const options = {
    root: null,
    threshold: 1.0,
  };
  // IntersectionObserver is in the native browser, imported above is a polyfill to ensure older browser compatibility
  // eslint-disable-next-line no-undef
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
      observer.observe(loadingRef.current);
      return () => {
        // eslint-disable-next-line no-unused-expressions
        currentRef && observer.unobserve(currentRef);
      };
    }
    return () => {};
  }, [isAllDataLoaded, loadingRef, observer]);

  return (
    <>
      {children}

      {isAllDataLoaded ? (
        <div>{allDataLoadedMessage}</div>
      ) : (
        <div data-testid="load-more-on-scroll" ref={loadingRef}>
          {loadingMessage}
        </div>
      )}
    </>
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
