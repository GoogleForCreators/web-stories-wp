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

export const SQUISH_LENGTH = 90;
export const SQUISH_CSS_VAR = '--squish-progress';

const generateThreshold = (steps) => {
  return Array.from({ length: steps + 1 }, (_, i) => i / steps);
};

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
  const squishDriverRef = useRef(null);

  useLayoutEffect(() => {
    const squishDriverEl = squishDriverRef.current;
    const scrollFrameEl = scrollFrameRef.current;
    if (!(squishDriverEl || scrollFrameEl)) {
      return () => {};
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio) {
            dispatchSquishEvent(squishDriverEl, 1 - entry.intersectionRatio);
          }
        });
      },
      {
        root: scrollFrameEl,
        threshold: generateThreshold(1000),
      }
    );

    observer.observe(squishDriverEl);
    return () => {
      observer.unobserve(squishDriverEl);
    };
  }, []);

  const addSquishListener = useCallback((listener) => {
    if (!squishDriverRef.current) {
      return;
    }
    squishDriverRef.current.addEventListener('squish', listener);
  }, []);

  const removeSquishListener = useCallback((listener) => {
    if (!squishDriverRef.current) {
      return;
    }
    squishDriverRef.current.removeEventListener('squish', listener);
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
        squishDriverRef,
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
