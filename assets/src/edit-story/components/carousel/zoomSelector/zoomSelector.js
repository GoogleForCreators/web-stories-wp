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
import { __, _x } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { ZOOM_SETTING } from '../../../constants';
import { useLayout } from '../../../app/layout';
import { DropDown } from '../../form';
import { Placement } from '../../popup';

const ZOOM_OPTIONS = [
  { name: _x('100%', 'zoom level', 'web-stories'), value: ZOOM_SETTING.SINGLE },
  { name: _x('200%', 'zoom level', 'web-stories'), value: ZOOM_SETTING.DOUBLE },
  { name: _x('300%', 'zoom level', 'web-stories'), value: ZOOM_SETTING.TRIPLE },
  { name: _x('Fill', 'zoom level', 'web-stories'), value: ZOOM_SETTING.FILL },
  { name: _x('Fit', 'zoom level', 'web-stories'), value: ZOOM_SETTING.FIT },
];

function ZoomSelector() {
  const { zoomSetting, setZoomSetting } = useLayout(
    ({ state: { zoomSetting }, actions: { setZoomSetting } }) => ({
      zoomSetting,
      setZoomSetting,
    })
  );

  const placeholder = useMemo(
    () => ZOOM_OPTIONS.find(({ value }) => value === zoomSetting).name,
    [zoomSetting]
  );

  const handleSetZoom = useCallback(
    (newSetting) => setZoomSetting(newSetting),
    [setZoomSetting]
  );

  return (
    <DropDown
      aria-label={__('Select Zoom Level', 'web-stories')}
      placeholder={placeholder}
      options={ZOOM_OPTIONS}
      placement={Placement.TOP}
      value={zoomSetting}
      onChange={handleSetZoom}
    />
  );
}

export default ZoomSelector;
