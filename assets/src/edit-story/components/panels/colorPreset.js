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
/**
 * External dependencies
 */
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Panel, PanelTitle, PanelContent } from './panel';

const Color = styled.div`
  display: inline-block;
  background: ${({ color }) => color};
  width: 30px;
  height: 30px;
  border-radius: 15px;
  margin-right: 12px;
`;

const Colors = styled.div`
  display: block;
  overflow: auto;
`;

function ColorPresetPanel() {
  return (
    <Panel name="colorpreset">
      <PanelTitle isPrimary>{__('Color presets', 'web-stories')}</PanelTitle>
      <PanelContent isPrimary>
        <Colors>
          <Color color="#B4D3D8" />
          <Color color="#6F8F9F" />
          <Color color="#324F66" />
          <Color color="#312834" />
          <Color color="#B578B0" />
        </Colors>
      </PanelContent>
    </Panel>
  );
}

export default ColorPresetPanel;
