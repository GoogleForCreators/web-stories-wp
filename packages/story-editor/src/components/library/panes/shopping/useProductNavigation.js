/*
 * Copyright 2022 Google LLC
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
  useCallback,
  useState,
  useEffect,
  useRef,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
function useProductNavigation({ isMenuFocused, products = [] }) {
  const currentRowsRef = useRef([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
  useEffect(() => {
    const el = currentRowsRef.current[`row-${currentFocusIndex}`];
    if (!el) {
      return;
    }
    if (!isMenuFocused || el.contains(document.activeElement)) {
      return;
    }
    el.focus();
  }, [currentFocusIndex, isMenuFocused]);

  // Handles managing the which `row` index has focus
  // Arrows move the index up or down by 1
  // unless we're at the start or the end
  // after we update the index using setCurrentFocusIndex
  // the element will get focus via the useEffect above el.focus();
  const handleListNav = useCallback(
    (evt) => {
      const { key } = evt;
      if (key === 'ArrowUp') {
        evt.preventDefault();
        setCurrentFocusIndex((index) => Math.max(0, index - 1));
      } else if (key === 'ArrowDown') {
        evt.preventDefault();
        setCurrentFocusIndex((index) =>
          Math.min(products.length - 1, index + 1)
        );
      }
    },
    [products]
  );

  return { handleListNav, currentRowsRef, setCurrentFocusIndex };
}

useProductNavigation.propTypes = {
  isMenuFocused: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object),
};

export default useProductNavigation;
