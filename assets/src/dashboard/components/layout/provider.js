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
import React, {
  createContext,
  useMemo,
  useRef,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';
/**
 * Internal dependencies
 */
import { DASHBOARD_TOP_MARGIN } from '../../constants/pageStructure';
import { clamp, throttleToAnimationFrame } from '../../utils';

export const SQUISH_LENGTH = DASHBOARD_TOP_MARGIN;
export const SQUISH_CSS_VAR = '--squish-progress';

export const dispatchSquishEvent = (el, progress) => {
  /**
   * Will need a polyfill for the `CustomEvent`
   * here If we decide to support ie.
   */
  const event = new CustomEvent('squish');
  event.data = { progress };
  el.dispatchEvent(event);
};

export const LayoutContext = createContext(null);

const Provider = ({ children }) => {
  const [squishContentHeight, setSquishContentHeight] = useState(0);
  const scrollFrameRef = useRef(null);

  useLayoutEffect(() => {
    const scrollFrameEl = scrollFrameRef.current;
    if (!scrollFrameEl) {
      return () => {};
    }

    let prevProgress;
    const handleScroll = throttleToAnimationFrame((e) => {
      const progress = clamp(e.target.scrollTop / SQUISH_LENGTH, [0, 1]);
      /**
       * Only dispatch squish event if we're within
       * the squish range.
       */
      if (!(progress === 1 && prevProgress === 1)) {
        dispatchSquishEvent(scrollFrameEl, progress);
      }
      prevProgress = progress;
    });

    scrollFrameEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      scrollFrameEl.removeEventListener('scroll', handleScroll, {
        passive: true,
      });
    };
  }, []);

  const addSquishListener = useCallback((listener) => {
    if (!scrollFrameRef.current) {
      return;
    }
    scrollFrameRef.current.addEventListener('squish', listener);
  }, []);

  const removeSquishListener = useCallback((listener) => {
    if (!scrollFrameRef.current) {
      return;
    }
    scrollFrameRef.current.removeEventListener('squish', listener);
  }, []);

  const scrollToTop = useCallback(() => {
    const scrollFrameEl = scrollFrameRef.current;
    if (!scrollFrameEl) {
      return;
    }
    scrollFrameEl.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const value = useMemo(
    () => ({
      state: {
        scrollFrameRef,
        squishContentHeight,
      },
      actions: {
        /**
         * @typedef {{progress: number}} SquishEvent
         * @typedef {(event: SquishEvent) => void} SquishListener
         *
         * @param {SquishListener} listener - Takes `squish` event which contains a progress value in range `[0, 1]`
         * @return {void}
         */
        addSquishListener,
        /**
         * @param {SquishListener} listener - Takes `squish` event which contains a progress value in range `[0, 1]`
         * @return {void}
         */
        removeSquishListener,
        setSquishContentHeight,
        scrollToTop,
      },
    }),
    [addSquishListener, removeSquishListener, squishContentHeight, scrollToTop]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node,
};

export default Provider;
