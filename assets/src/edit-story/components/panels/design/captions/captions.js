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
import { useCallback } from 'react';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  Row,
  Button,
  TextInput,
  MULTIPLE_VALUE,
  MULTIPLE_DISPLAY_VALUE,
} from '../../../form';
import { useMediaPicker } from '../../../mediaPicker';
import { SimplePanel } from '../../panel';
import { getCommonValue } from '../../shared';

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
  flex-grow: 1;
  opacity: 1;
`;

function CaptionsPanel({ selectedElements, pushUpdate }) {
  const tracks = getCommonValue(selectedElements, 'tracks', []);

  const handleChangeTrack = useCallback(
    (attachment) => {
      const newTracks = {
        track: attachment?.url,
        trackId: attachment?.id,
        trackName: attachment?.filename,
        id: uuidv4(),
        kind: 'captions',
        srclang: '',
        label: '',
      };

      pushUpdate({ tracks: [...tracks, newTracks] }, true);
    },
    [tracks, pushUpdate]
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

  const captionText = __('Upload captions', 'web-stories');

  const UploadCaption = useMediaPicker({
    onSelect: handleChangeTrack,
    type: 'text/vtt',
    title: captionText,
    buttonInsertText: __('Select caption', 'web-stories'),
  });

  const isMixedValue = tracks === MULTIPLE_VALUE;
  return (
    <SimplePanel name="caption" title={__('Captions', 'web-stories')}>
      {isMixedValue && (
        <Row>
          <BoxedTextInput
            value={MULTIPLE_DISPLAY_VALUE}
            disabled
            aria-label={__('Filename', 'web-stories')}
            clear
            onChange={() => handleRemoveTrack()}
          />
        </Row>
      )}
      {tracks &&
        !isMixedValue &&
        tracks.map(({ id, trackName }) => (
          <Row key={`row-filename-${id}`}>
            <BoxedTextInput
              value={trackName}
              disabled
              aria-label={__('Filename', 'web-stories')}
              clear
              onChange={() => handleRemoveTrack(id)}
              key={`filename-${id}`}
            />
          </Row>
        ))}
      {!tracks.length && (
        <Row expand>
          <Button onClick={UploadCaption} fullWidth>
            {captionText}
          </Button>
        </Row>
      )}
    </SimplePanel>
  );
}

CaptionsPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default CaptionsPanel;
