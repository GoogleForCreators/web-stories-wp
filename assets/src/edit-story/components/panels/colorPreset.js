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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
// import Switch from '../form/switch';
import Switch from '../switch';
import { Panel, PanelTitle, PanelContent } from './panel';

function ColorPresetPanel() {
  const [value, setValue] = useState(false);
  return (
    <Panel name="colorpreset">
      <PanelTitle isPrimary>{__('Color presets', 'web-stories')}</PanelTitle>
      <PanelContent>
        <Switch checked={value} onChange={setValue} label="" />
        <p>{__('Color presets go here', 'web-stories')}</p>
      </PanelContent>
    </Panel>
  );
}

export default ColorPresetPanel;
