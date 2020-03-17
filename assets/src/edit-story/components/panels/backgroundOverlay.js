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
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Row } from '../form';
import ToggleButton from '../form/toggleButton';
import { useStory } from '../../app';
import { OverlayPreset, OverlayType } from '../../utils/backgroundOverlay';
import { SimplePanel } from './panel';

function BackgroundOverlayPanel() {
  const {
    state: { currentPage },
    actions: { updateCurrentPageProperties },
  } = useStory();
  const [overlay, setOverlay] = useState(
    currentPage.backgroundOverlay || OverlayType.NONE
  );

  useEffect(() => {
    updateCurrentPageProperties({ properties: { backgroundOverlay: overlay } });
  }, [updateCurrentPageProperties, overlay]);

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
              isMultiple={false}
              onChange={() => setOverlay(type)}
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
