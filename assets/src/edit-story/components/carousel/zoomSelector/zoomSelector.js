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
import { useCallback, useMemo } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ALLOWED_EDITOR_PAGE_WIDTHS, PAGE_RATIO } from '../../../constants';
import { useLayout } from '../../../app/layout';
import { DropDown } from '../../form';
import { Placement } from '../../popup';

const ZOOM_OPTIONS = [
  { name: '100%', value: ALLOWED_EDITOR_PAGE_WIDTHS[0] },
  { name: '66%', value: ALLOWED_EDITOR_PAGE_WIDTHS[1] },
  { name: '33%', value: ALLOWED_EDITOR_PAGE_WIDTHS[2] },
];

function ZoomSelector() {
  const { canvasPageSize, setCanvasPageSize } = useLayout(
    ({ state: { canvasPageSize }, actions: { setCanvasPageSize } }) => ({
      canvasPageSize,
      setCanvasPageSize,
    })
  );

  const placeholder = useMemo(
    () =>
      ZOOM_OPTIONS.find(({ value }) => value === canvasPageSize.width)?.name ||
      'Fit',
    [canvasPageSize]
  );

  const handleSetZoom = useCallback(
    (pageWidth) => {
      setCanvasPageSize({
        width: pageWidth,
        height: pageWidth / PAGE_RATIO,
      });
    },
    [setCanvasPageSize]
  );

  return (
    <DropDown
      aria-label={__('Select Zoom Level', 'web-stories')}
      placeholder={placeholder}
      options={ZOOM_OPTIONS}
      placement={Placement.TOP}
      value={canvasPageSize}
      onChange={handleSetZoom}
    />
  );
}

export default ZoomSelector;
