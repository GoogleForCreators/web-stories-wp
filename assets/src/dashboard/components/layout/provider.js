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

const generateThreshold = (steps) => {
  return Array.from({ length: steps + 1 }, (_, i) => i / steps);
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
            const event = new CustomEvent('squish');
            event.data = {
              progress: 1 - entry.intersectionRatio,
            };
            squishDriverEl.dispatchEvent(event);
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
      },
    }),
    [addSquishListener, removeSquishListener, squishContentHeight]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default Provider;
