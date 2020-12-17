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
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  OverlayPreset,
  OverlayType,
} from '../../../../utils/backgroundOverlay';
import { Row, ToggleButton, Color, Label } from '../../../form';
import { SimplePanel } from '../../panel';
import convertOverlay from './convertOverlay';

function BackgroundOverlayPanel({ selectedElements, pushUpdate }) {
  const overlay = selectedElements[0].backgroundOverlay || null;

  const overlayType =
    overlay === null ? OverlayType.NONE : overlay.type || OverlayType.SOLID;

  const updateOverlay = useCallback(
    (value) => pushUpdate({ backgroundOverlay: value }, true),
    [pushUpdate]
  );

  return (
    <SimplePanel name="backgroundOverlay" title={__('Overlay', 'web-stories')}>
      <Row>
        {Object.keys(OverlayPreset).map((type) => {
          const { label, icon } = OverlayPreset[type];
          return (
            <ToggleButton
              key={type}
              icon={icon}
              label={label}
              value={overlayType === type}
              onChange={() =>
                updateOverlay(convertOverlay(overlay, overlayType, type))
              }
              iconWidth={22}
              iconHeight={16}
              aria-label={sprintf(
                /* translators: %s: Overlay type */
                __('Set overlay: %s', 'web-stories'),
                label
              )}
            />
          );
        })}
      </Row>
      {overlayType !== OverlayType.NONE && (
        <Row>
          <Label>{__('Color', 'web-stories')}</Label>
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

BackgroundOverlayPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default BackgroundOverlayPanel;
