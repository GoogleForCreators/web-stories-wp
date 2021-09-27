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
import styled, { css } from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from '@web-stories-wp/react';
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Input,
  Text,
  THEME_CONSTANTS,
  themeHelpers,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';
import { Row, usePresubmitHandler } from '../../../form';
import { SimplePanel } from '../../panel';
import { focusStyle, getCommonValue } from '../../shared';
import { states, styles, useHighlights } from '../../../../app/highlights';
import Tooltip from '../../../tooltip';
import { useConfig } from '../../../../app';

const InputRow = styled.div`
  display: flex;
  flex-grow: 1;
  margin-right: 8px;
`;

const StyledFileInput = styled(Input)(
  ({ hasMixedValue, theme }) => css`
    ${focusStyle};
    ${!hasMixedValue &&
    css`
      * > input:disabled {
        color: ${theme.colors.fg.primary};
      }
    `};
  `
);

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

const ErrorText = styled(Text).attrs({
  as: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.negative};
`;

export const MIN_MAX = {
  ALT_TEXT: {
    MAX: 1000,
  },
};

function CaptionsPanel({ selectedElements, pushUpdate }) {
  const tracks = getCommonValue(selectedElements, 'tracks', []);
  const isMixedValue = tracks === MULTIPLE_VALUE;
  /* @TODO: Implement error handling after removing modal and
  using native browser upload. */
  const uploadError = false;

  const {
    capabilities: { hasUploadMediaAction },
    MediaUpload,
  } = useConfig();

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
    ({ src = '', id }) => {
      const newTracks = {
        track: src,
        trackId: id,
        trackName: src.split('/').pop(),
        id: uuidv4(),
        kind: 'captions',
        srclang: '',
        label: '',
      };

      pushUpdate({ tracks: [...tracks, newTracks] }, true);
    },
    [tracks, pushUpdate]
  );

  const { highlight, resetHighlight } = useHighlights((state) => ({
    highlight: state[states.CAPTIONS],
    resetHighlight: state.onFocusOut,
    cancelHighlight: state.cancelEffect,
  }));

  const captionText = __('Upload a file', 'web-stories');

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
        {captionText}
      </UploadButton>
    ),
    [resetHighlight, captionText, highlight?.focus, highlight?.showEffect]
  );

  if (!hasUploadMediaAction && !tracks.length) {
    return null;
  }

  const clearFileText = __('Remove file', 'web-stories');

  return (
    <SimplePanel
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name="caption"
      title={__('Caption and Subtitles', 'web-stories')}
      isPersistable={!highlight}
    >
      {isMixedValue && (
        <Row>
          <StyledFileInput
            value={MULTIPLE_DISPLAY_VALUE}
            disabled
            aria-label={__('Filename', 'web-stories')}
            onChange={() => handleRemoveTrack()}
            hasMixedValue={isMixedValue}
          />
        </Row>
      )}
      {tracks &&
        !isMixedValue &&
        tracks.map(({ id, trackName }) => (
          <Row key={`row-filename-${id}`}>
            <InputRow>
              <StyledFileInput
                value={trackName}
                aria-label={__('Filename', 'web-stories')}
                onChange={() => handleRemoveTrack(id)}
                hasMixedValue={isMixedValue}
                disabled
              />
            </InputRow>
            <Tooltip hasTail title={clearFileText}>
              <StyledButton
                aria-label={clearFileText}
                type={BUTTON_TYPES.TERTIARY}
                size={BUTTON_SIZES.SMALL}
                variant={BUTTON_VARIANTS.SQUARE}
                onClick={() => handleRemoveTrack(id)}
              >
                <Icons.Trash />
              </StyledButton>
            </Tooltip>
          </Row>
        ))}
      {!tracks.length && (
        <>
          <Row expand>
            <MediaUpload
              onSelect={handleChangeTrack}
              onSelectErrorMessage={__(
                'Please choose a VTT file to use as caption.',
                'web-stories'
              )}
              type={['text/vtt']}
              title={captionText}
              buttonInsertText={__('Select caption', 'web-stories')}
              render={renderUploadButton}
            />
          </Row>
          {uploadError && (
            <Row expand>
              <ErrorText role="alert">
                {__('Upload error. Please try again', 'web-stories')}
              </ErrorText>
            </Row>
          )}
        </>
      )}
    </SimplePanel>
  );
}

CaptionsPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default CaptionsPanel;
