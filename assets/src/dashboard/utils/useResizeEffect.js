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
import { useCallback, useEffect, useState } from 'react';
/**
 * Internal dependencies
 */
import theme from '../theme';
import { PAGE_RATIO } from '../constants';

export default function useResizeEffect() {
  const [pageSize, setPageSize] = useState({ width: 100, height: 150 });
  const handleWindowResize = useCallback(() => {
    const { innerWidth } = window;
    let itemWidth = 0;

    if (innerWidth <= theme.breakpoint.raw.min) {
      itemWidth = theme.grid.min.itemWidth;
    } else if (innerWidth <= theme.breakpoint.raw.mobile) {
      itemWidth = theme.grid.mobile.itemWidth;
    } else if (innerWidth <= theme.breakpoint.raw.tablet) {
      itemWidth = theme.grid.tablet.itemWidth;
    } else {
      itemWidth = theme.grid.desktop.itemWidth;
    }

    setPageSize({
      width: itemWidth,
      height: itemWidth * PAGE_RATIO,
    });
  }, []);

  useEffect(() => {
    const unsubscribe = window.addEventListener('resize', handleWindowResize);
    handleWindowResize();
    return unsubscribe;
  }, [handleWindowResize]);

  return { pageSize };
}
