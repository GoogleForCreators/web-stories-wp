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
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app/story';
import { useConfig } from '../../../../app';
import { Row } from '../../../form';
import { SimplePanel } from '../../panel';
import BackgroundAudioPanelContent from '../../shared/media/backgroundAudioPanelContent';
import useHighlights from '../../../../app/highlights/useHighlights';
import states from '../../../../app/highlights/states';
import { styles } from '../../../../app/highlights';

const HelperText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

const HighlightRow = styled(Row).attrs({
  spaceBetween: false,
})`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    bottom: -10px;
    left: -20px;
    right: -10px;
    ${({ isHighlighted }) => isHighlighted && styles.FLASH}
    pointer-events: none;
  }
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

  const { highlightBackgroundAudio, resetHighlight } = useHighlights(
    (state) => ({
      highlightBackgroundAudio: state[states.BACKGROUND_AUDIO],
      resetHighlight: state.onFocusOut,
    })
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
      isPersistable={!highlightBackgroundAudio}
    >
      <Row>
        <HelperText>
          {__(
            'Select an audio file that plays throughout the story.',
            'web-stories'
          )}
        </HelperText>
      </Row>
      <HighlightRow
        isHighlighted={highlightBackgroundAudio?.showEffect}
        onAnimationEnd={() => resetHighlight()}
      >
        <BackgroundAudioPanelContent
          backgroundAudio={backgroundAudio}
          updateBackgroundAudio={updateBackgroundAudio}
        />
      </HighlightRow>
    </SimplePanel>
  );
}

export default BackgroundAudioPanel;

BackgroundAudioPanel.propTypes = {
  nameOverride: PropTypes.string,
};
