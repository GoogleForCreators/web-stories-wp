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
  useEffect,
  useMemo,
  useRef,
  useCallback,
  createContext,
} from '@googleforcreators/react';
import PropTypes from 'prop-types';

export const LayoutContext = createContext(null);

const Provider = ({ children }) => {
  const firstFocusableContentRef = useRef();
  const scrollFrameRef = useRef(null);

  // Get the first focusable content in the dashboard
  // so we can send focus there without having to
  // tab through the whole WordPress dashboard to get back.
  useEffect(() => {
    firstFocusableContentRef.current = document
      ?.getElementById('web-stories-dashboard')
      ?.querySelector(['button', 'a']);
  }, []);

  const scrollToTop = useCallback(() => {
    document.documentElement?.scrollTo?.({
      top: 0,
      behavior: 'smooth',
    });
    firstFocusableContentRef.current?.focus();
  }, []);

  const value = useMemo(
    () => ({
      state: {
        scrollFrameRef,
      },
      actions: {
        scrollToTop,
      },
    }),
    [scrollToTop]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node,
};

export default Provider;
