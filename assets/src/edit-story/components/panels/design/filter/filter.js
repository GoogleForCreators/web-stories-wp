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
import { useCallback } from 'react';

/**
 * External dependencies
 */
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  OverlayPreset,
  OverlayType,
} from '../../../../utils/backgroundOverlay';
import { Row, Color, FilterToggle } from '../../../form';
import { SimplePanel } from '../../panel';
import { getDefinitionForType } from '../../../../elements';
import convertOverlay from './convertOverlay';

function FilterPanel({ selectedElements, pushUpdate }) {
  const overlay = selectedElements[0].backgroundOverlay || null;

  const overlayType =
    overlay === null ? OverlayType.NONE : overlay.type || OverlayType.SOLID;

  const updateOverlay = useCallback(
    (value) => pushUpdate({ backgroundOverlay: value }, true),
    [pushUpdate]
  );

  const { LayerIcon } = getDefinitionForType(selectedElements[0].type);
  return (
    <SimplePanel name="filter" title={__('Filters', 'web-stories')}>
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
              <LayerIcon element={selectedElements[0]} />
            </FilterToggle>
          );
        })}
      </Row>
      {overlayType !== OverlayType.NONE && (
        <Row>
          <Color
            label={__('Color', 'web-stories')}
            value={overlay}
            onChange={updateOverlay}
            hasGradient
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
