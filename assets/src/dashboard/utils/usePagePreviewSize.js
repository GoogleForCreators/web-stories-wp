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
import { useEffect, useState, useMemo } from 'react';
/**
 * Internal dependencies
 */
import theme from '../theme';
import { PAGE_RATIO } from '../constants';

const sizeFromWidth = (width) => ({
  width,
  height: PAGE_RATIO * width,
});

const ascendingBreakpointKeys = Object.keys(theme.breakpoint.raw).sort(
  (a, b) => theme.breakpoint.raw[a] - theme.breakpoint.raw[b]
);

export default function usePagePreviewSize(options = {}) {
  const [bp, setBp] = useState('desktop');
  const { thumbnailMode = false } = options;

  useEffect(() => {
    if (thumbnailMode) {
      return () => {};
    }

    const handleResize = () => {
      setBp('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [thumbnailMode]);

  return useMemo(() => {
    const pageWidth =
      thumbnailMode && !bp && ascendingBreakpointKeys ? 33 : 100;
    return {
      pageSize: sizeFromWidth(pageWidth),
    };
  }, [bp, thumbnailMode]);
}
