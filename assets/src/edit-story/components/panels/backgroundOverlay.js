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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row, ToggleButton } from '../form';
import { useStory } from '../../app';
import { OverlayPreset, OverlayType } from '../../utils/backgroundOverlay';
import { SimplePanel } from './panel';

function BackgroundOverlayPanel() {
  const { currentPage, updateCurrentPageProperties } = useStory((state) => ({
    currentPage: state.state.currentPage,
    updateCurrentPageProperties: state.actions.updateCurrentPageProperties,
  }));
  const overlay = currentPage.backgroundOverlay || OverlayType.NONE;

  const updateOverlay = useCallback(
    (value) => {
      updateCurrentPageProperties({ properties: { backgroundOverlay: value } });
    },
    [updateCurrentPageProperties]
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
              value={overlay === type}
              onChange={() => updateOverlay(type)}
              iconWidth={22}
              iconHeight={16}
            />
          );
        })}
      </Row>
    </SimplePanel>
  );
}

BackgroundOverlayPanel.propTypes = {};

export default BackgroundOverlayPanel;
