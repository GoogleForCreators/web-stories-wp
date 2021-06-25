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
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { THEME_CONSTANTS } from '../../../../../$term = $this->call_private_method( $object, 'get_term' );src/theme/constants';
import { Text } from '../../../../../$term = $this->call_private_method( $object, 'get_term' );src/components/typography/text';
import useDesignPanels from './useDesignPanels';
import DesignPanel from './designPanel';

const NoSelection = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Note = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function DesignPanels() {
  const { panels, createSubmitHandlerForPanel, panelProperties } =
    useDesignPanels();
  if (!panels?.length) {
    return (
      <NoSelection>
        <Note size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.MEDIUM}>
          {__('Nothing selected', 'web-stories')}
        </Note>
      </NoSelection>
    );
  }
  return panels.map(({ Panel, type }) => (
    <DesignPanel
      key={type}
      panelType={Panel}
      registerSubmitHandler={createSubmitHandlerForPanel(type)}
      {...panelProperties}
    />
  ));
}

export default DesignPanels;
