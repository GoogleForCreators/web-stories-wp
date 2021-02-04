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
  useCallback,
  useState,
} from 'react';
import PropTypes from 'prop-types';

export const LayoutContext = createContext(null);

const Provider = ({ children }) => {
  const scrollFrameRef = useRef(null);
  const [telemetryBannerOpen, setTelemetryBannerOpen] = useState(false);

  const scrollToTop = useCallback(() => {
    const scrollFrameEl = scrollFrameRef.current;
    document.documentElement?.scrollTo?.({
      top: 0,
      behavior: 'smooth',
    });
    scrollFrameEl?.children[0]?.focus();
  }, []);

  const value = useMemo(
    () => ({
      state: {
        scrollFrameRef,
        telemetryBannerOpen,
      },
      actions: {
        scrollToTop,
        setTelemetryBannerOpen,
      },
    }),
    [setTelemetryBannerOpen, telemetryBannerOpen, scrollToTop]
  );

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

Provider.propTypes = {
  children: PropTypes.node,
};

export default Provider;
