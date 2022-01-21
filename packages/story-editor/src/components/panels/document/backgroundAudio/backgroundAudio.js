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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import { useConfig } from '../../../../app';
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

  const { backgroundAudio, updateStory } = useStory(
    ({
      state: {
        story: { backgroundAudio },
      },
      actions: { updateStory },
    }) => ({ backgroundAudio, updateStory })
  );

  const updateBackgroundAudio = useCallback(
    (audioResource) => {
      updateStory({ properties: { backgroundAudio: audioResource } });
    },
    [updateStory]
  );

  if (!backgroundAudio && !hasUploadMediaAction) {
    return null;
  }

  return (
    <SimplePanel
      name="backgroundAudio"
      title={__('Background Audio', 'web-stories')}
      collapsedByDefault
    >
      <Row>
        <HelperText>
          {__(
            'Select an audio file that plays throughout the story.',
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
