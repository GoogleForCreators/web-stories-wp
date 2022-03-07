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
import PropTypes from 'prop-types';
import { useCallback } from '@googleforcreators/react';
import { OverlayType } from '@googleforcreators/design-system';
import { __, _x, sprintf } from '@googleforcreators/i18n';
import { getDefinitionForType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { Row, Color, FilterToggle } from '../../../form';
import { SimplePanel } from '../../panel';
import { useCommonColorValue } from '../../shared';
import useCORSProxy from '../../../../utils/useCORSProxy';
import { useStory } from '../../../../app';
import { MULTIPLE_VALUE } from '../../../../constants';
import convertOverlay from './convertOverlay';

const OverlayPreset = {
  [OverlayType.NONE]: {
    label: _x('None', 'overlay', 'web-stories'),
  },
  [OverlayType.SOLID]: {
    label: __('Tint', 'web-stories'),
  },
  [OverlayType.LINEAR]: {
    label: __('Linear', 'web-stories'),
  },
  [OverlayType.RADIAL]: {
    label: __('Vignette', 'web-stories'),
  },
};

function FilterPanel({ selectedElements, pushUpdate }) {
  const overlay = useCommonColorValue(selectedElements, 'overlay');
  const isMultiple = overlay === MULTIPLE_VALUE;
  const overlayType = !overlay
    ? OverlayType.NONE
    : overlay.type || OverlayType.SOLID;
  const { getProxiedUrl } = useCORSProxy();
  const { isDefaultBackground } = selectedElements[0];
  const currentPageBackgroundColor = useStory(
    (v) => !isDefaultBackground || v.state.currentPage?.backgroundColor
  );

  const updateOverlay = useCallback(
    (value) => pushUpdate({ overlay: value }, true),
    [pushUpdate]
  );

  // Enable eyedropper only for solid colors
  // https://github.com/googleforcreators/web-stories-wp/pull/9488#issuecomment-950679465
  const hasEyedropper =
    overlayType !== OverlayType.RADIAL && overlayType !== OverlayType.LINEAR;

  const { LayerIcon } = getDefinitionForType(selectedElements[0].type);
  return (
    <SimplePanel name="filter" title={__('Filters', 'web-stories')}>
      {!isMultiple && (
        <Row>
          {Object.keys(OverlayPreset).map((type) => {
            const { label } = OverlayPreset[type];
            return (
              <FilterToggle
                key={type}
                element={selectedElements[0]}
                label={label}
                isToggled={overlayType === type}
                onClick={() =>
                  updateOverlay(convertOverlay(overlay, overlayType, type))
                }
                filter={convertOverlay(overlay, OverlayType.NONE, type)}
                aria-label={sprintf(
                  /* translators: %s: Filter type */
                  __('Filter: %s', 'web-stories'),
                  label
                )}
              >
                <LayerIcon
                  element={selectedElements[0]}
                  getProxiedUrl={getProxiedUrl}
                  currentPageBackgroundColor={currentPageBackgroundColor}
                />
              </FilterToggle>
            );
          })}
        </Row>
      )}
      {overlayType !== OverlayType.NONE && (
        <Row>
          <Color
            label={__('Color', 'web-stories')}
            value={overlay}
            onChange={updateOverlay}
            allowsGradient
            hasEyedropper={hasEyedropper}
          />
        </Row>
      )}
    </SimplePanel>
  );
}

FilterPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default FilterPanel;
