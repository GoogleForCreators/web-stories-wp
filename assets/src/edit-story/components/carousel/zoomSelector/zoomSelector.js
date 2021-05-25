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
import styled, { css } from 'styled-components';
import { __, _x } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { ZOOM_SETTING } from '../../../constants';
import { useLayout } from '../../../app/layout';
import { DropDown, PLACEMENT } from '../../../../design-system';

const selectButtonCSS = css`
  height: 36px;
  padding: 8px;

  span {
    padding: 0;
  }
`;

const StyledDropDown = styled(DropDown)`
  margin-right: 8px;
`;

const ZOOM_OPTIONS = [
  {
    label: _x('100%', 'zoom level', 'web-stories'),
    value: ZOOM_SETTING.SINGLE,
  },
  {
    label: _x('200%', 'zoom level', 'web-stories'),
    value: ZOOM_SETTING.DOUBLE,
  },
  { label: _x('Fill', 'zoom level', 'web-stories'), value: ZOOM_SETTING.FILL },
  { label: _x('Fit', 'zoom level', 'web-stories'), value: ZOOM_SETTING.FIT },
];

function ZoomSelector() {
  const { zoomSetting, setZoomSetting } = useLayout(
    ({ state: { zoomSetting }, actions: { setZoomSetting } }) => ({
      zoomSetting,
      setZoomSetting,
    })
  );

  const placeholder = useMemo(
    () => ZOOM_OPTIONS.find(({ value }) => value === zoomSetting).label,
    [zoomSetting]
  );

  const handleSetZoom = useCallback(
    (_event, value) => setZoomSetting(value),
    [setZoomSetting]
  );

  return (
    <StyledDropDown
      ariaLabel={__('Zoom Level', 'web-stories')}
      placeholder={placeholder}
      options={ZOOM_OPTIONS}
      placement={PLACEMENT.TOP_START}
      onMenuItemClick={handleSetZoom}
      selectedValue={zoomSetting}
      popupFillWidth={false}
      selectButtonStylesOverride={selectButtonCSS}
    />
  );
}

export default ZoomSelector;
