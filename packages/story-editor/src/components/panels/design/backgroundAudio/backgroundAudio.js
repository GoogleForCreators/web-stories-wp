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
import { __ } from '@web-stories-wp/i18n';
import { Text, THEME_CONSTANTS } from '@web-stories-wp/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useConfig, useStory } from '../../../../app';
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import BackgroundAudioPanelContent from '../../shared/backgroundAudioPanelContent';

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function BackgroundAudioPanel() {
  const {
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const { backgroundAudio, updateCurrentPageProperties } = useStory(
    (state) => ({
      updateCurrentPageProperties: state.actions.updateCurrentPageProperties,
      backgroundAudio: state.state.currentPage?.backgroundAudio,
    })
  );

  const updateBackgroundAudio = useCallback(
    (media) => {
      updateCurrentPageProperties({
        properties: { backgroundAudio: media?.url },
      });
    },
    [updateCurrentPageProperties]
  );

  if (!hasUploadMediaAction) {
    return null;
  }

  return (
    <SimplePanel
      name="backgroundAudio"
      title={__('Background Audio', 'web-stories')}
    >
      <Row>
        <HelperText>
          {__(
            'Select an audio file that plays while this page is in view.',
            'web-stories'
          )}
        </HelperText>
      </Row>
      <BackgroundAudioPanelContent
        backgroundAudio={backgroundAudio}
        updateBackgroundAudio={updateBackgroundAudio}
      />
    </SimplePanel>
  );
}

export default BackgroundAudioPanel;
