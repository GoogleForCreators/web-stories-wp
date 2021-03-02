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
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Panel, PanelContent } from '../../panel';
import { Text, THEME_CONSTANTS } from '../../../../../design-system';

const Note = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  text-align: center;
  margin-top: 150px;
`;

function NoSelectionPanel() {
  return (
    <Panel name="noselection" isPersistable={false} noBorder>
      <PanelContent>
        <Note size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}>
          {__('Nothing selected', 'web-stories')}
        </Note>
      </PanelContent>
    </Panel>
  );
}

export default NoSelectionPanel;
