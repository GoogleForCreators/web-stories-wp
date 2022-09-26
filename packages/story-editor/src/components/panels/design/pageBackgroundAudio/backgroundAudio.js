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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../app';
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

function PageBackgroundAudioPanel() {
  const { backgroundAudio, currentPageId, updateCurrentPageProperties } =
    useStory((state) => ({
      updateCurrentPageProperties: state.actions.updateCurrentPageProperties,
      backgroundAudio: state.state.currentPage?.backgroundAudio,
      currentPageId: state.state.currentPage?.id,
    }));

  const { highlightBackgroundAudio, resetHighlight } = useHighlights(
    (state) => ({
      highlightBackgroundAudio: state[states.PAGE_BACKGROUND_AUDIO],
      resetHighlight: state.onFocusOut,
    })
  );

  const updateBackgroundAudio = useCallback(
    (updatedBackgroundAudio) => {
      updateCurrentPageProperties({
        properties: {
          backgroundAudio: updatedBackgroundAudio,
        },
      });
    },
    [updateCurrentPageProperties]
  );

  return (
    <SimplePanel
      name="pageBackgroundAudio"
      title={__('Page Background Audio', 'web-stories')}
      collapsedByDefault={false}
      isPersistable={!highlightBackgroundAudio}
    >
      <HighlightRow
        isHighlighted={highlightBackgroundAudio?.showEffect}
        onAnimationEnd={() => resetHighlight()}
      >
        <HelperText>
          {__(
            'Select an audio file that plays while this page is in view.',
            'web-stories'
          )}
        </HelperText>
      </HighlightRow>
      <BackgroundAudioPanelContent
        backgroundAudio={backgroundAudio}
        updateBackgroundAudio={updateBackgroundAudio}
        showCaptions
        showLoopControl
        audioId={`page-${currentPageId}-background-audio`}
      />
    </SimplePanel>
  );
}

export default PageBackgroundAudioPanel;
