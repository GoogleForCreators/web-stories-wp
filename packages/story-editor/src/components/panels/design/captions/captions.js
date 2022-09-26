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
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  themeHelpers,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { usePresubmitHandler } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';
import { states, styles, useHighlights } from '../../../../app/highlights';
import CaptionsPanelContent from '../../shared/media/captionsPanelContent';
import { MULTIPLE_VALUE } from '../../../../constants';

const StyledButton = styled(Button)`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

const UploadButton = styled(StyledButton)`
  padding: 12px 8px;
`;

export const MIN_MAX = {
  ALT_TEXT: {
    MAX: 1000,
  },
};

function CaptionsPanel({ selectedElements, pushUpdate }) {
  const tracks = getCommonValue(selectedElements, 'tracks', []);
  const isIndeterminate = tracks === MULTIPLE_VALUE;

  usePresubmitHandler(
    ({ resource: newResource }) => ({
      resource: {
        ...newResource,
        alt: newResource.alt?.slice(0, MIN_MAX.ALT_TEXT.MAX),
      },
    }),
    []
  );

  const handleRemoveTrack = useCallback(
    (idToDelete) => {
      let newTracks = [];
      if (idToDelete) {
        const trackIndex = tracks.findIndex(({ id }) => id === idToDelete);
        newTracks = [
          ...tracks.slice(0, trackIndex),
          ...tracks.slice(trackIndex + 1),
        ];
      }
      pushUpdate({ tracks: newTracks }, true);
    },
    [tracks, pushUpdate]
  );

  const handleChangeTrack = useCallback(
    ({ src = '', id, needsProxy = false }) => {
      const newTrack = {
        track: src,
        trackId: id,
        id: uuidv4(),
        kind: 'captions',
        srclang: '',
        label: '',
        needsProxy,
      };

      pushUpdate({ tracks: [newTrack] }, true);
    },
    [pushUpdate]
  );

  const { highlight, resetHighlight } = useHighlights((state) => ({
    highlight: state[states.CAPTIONS],
    resetHighlight: state.onFocusOut,
    cancelHighlight: state.cancelEffect,
  }));

  const renderUploadButton = useCallback(
    (open) => (
      <UploadButton
        css={highlight?.showEffect && styles.OUTLINE}
        onAnimationEnd={() => resetHighlight()}
        ref={(node) => {
          if (node && highlight?.focus && highlight?.showEffect) {
            node.focus();
          }
        }}
        onClick={open}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        variant={BUTTON_VARIANTS.RECTANGLE}
      >
        {__('Upload a file', 'web-stories')}
      </UploadButton>
    ),
    [resetHighlight, highlight?.focus, highlight?.showEffect]
  );

  return (
    <SimplePanel
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name="caption"
      title={__('Caption and Subtitles', 'web-stories')}
      isPersistable={!highlight}
    >
      <CaptionsPanelContent
        isIndeterminate={isIndeterminate}
        tracks={!isIndeterminate ? tracks : []}
        handleChangeTrack={handleChangeTrack}
        handleRemoveTrack={handleRemoveTrack}
        renderUploadButton={renderUploadButton}
      />
    </SimplePanel>
  );
}

CaptionsPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default CaptionsPanel;
