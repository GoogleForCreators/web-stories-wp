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
import { useCallback, useMemo } from '@googleforcreators/react';
import { css } from 'styled-components';
import { __, _x, sprintf } from '@googleforcreators/i18n';
import { DropDown, PLACEMENT } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { ZOOM_SETTING } from '../../../constants';
import { useLayout } from '../../../app/layout';

const selectButtonCSS = css`
  height: 36px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.bg.primary};

  span {
    padding: 0;
  }
`;

const ZOOM_OPTIONS = [
  {
    label: _x('100%', 'zoom level', 'web-stories'),
    value: 1,
  },
  {
    label: _x('200%', 'zoom level', 'web-stories'),
    value: 2,
  },
  { label: _x('Fill', 'zoom level', 'web-stories'), value: ZOOM_SETTING.FILL },
  { label: _x('Fit', 'zoom level', 'web-stories'), value: ZOOM_SETTING.FIT },
];

function ZoomSelector() {
  const { zoomSetting, zoomLevel, setZoomSetting, setZoomLevel } = useLayout(
    ({
      state: { zoomSetting, zoomLevel },
      actions: { setZoomSetting, setZoomLevel },
    }) => ({
      zoomSetting,
      zoomLevel,
      setZoomSetting,
      setZoomLevel,
    })
  );

  const placeholder = useMemo(() => {
    const option = ZOOM_OPTIONS.find(({ value }) => {
      if (zoomSetting === ZOOM_SETTING.FIXED) {
        return value === zoomLevel;
      }
      return value === zoomSetting;
    });
    if (option) {
      return option.label;
    }

    // eslint-disable-next-line @wordpress/valid-sprintf -- False positive.
    return sprintf(
      /* translators: %d: zoom level percentage value. */
      _x('%d%%', 'zoom level', 'web-stories'),
      Math.round(zoomLevel * 100)
    );
  }, [zoomSetting, zoomLevel]);

  const handleSetZoom = useCallback(
    (_event, value) => {
      if (Object.prototype.hasOwnProperty.call(ZOOM_SETTING, value)) {
        setZoomSetting(value);
      } else {
        setZoomLevel(value);
      }
    },
    [setZoomSetting, setZoomLevel]
  );

  return (
    <DropDown
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
