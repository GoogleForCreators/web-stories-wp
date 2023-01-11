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
import styled from 'styled-components';
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { Text, TextSize } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app';
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import BackgroundAudioPanelContent from '../../shared/media/backgroundAudioPanelContent';

const HelperText = styled(Text.Paragraph).attrs({
  size: TextSize.Small,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function BackgroundAudioPanel({ nameOverride }) {
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
    (updatedBackgroundAudio) => {
      updateStory({
        properties: { backgroundAudio: updatedBackgroundAudio },
      });
    },
    [updateStory]
  );

  if (!backgroundAudio && !hasUploadMediaAction) {
    return null;
  }

  return (
    <SimplePanel
      name={nameOverride || 'backgroundAudio'}
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
      <Row>
        <BackgroundAudioPanelContent
          backgroundAudio={backgroundAudio}
          updateBackgroundAudio={updateBackgroundAudio}
        />
      </Row>
    </SimplePanel>
  );
}

export default BackgroundAudioPanel;

BackgroundAudioPanel.propTypes = {
  nameOverride: PropTypes.string,
};
