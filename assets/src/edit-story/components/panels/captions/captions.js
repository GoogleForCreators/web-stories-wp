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
import { DropDown, Row, Button } from '../../form';
import { ExpandedTextInput } from '../shared';
import { SimplePanel } from '../panel';
import { getCommonValue } from '../utils';
import { useConfig } from '../../../app';
import { useMediaPicker } from '../../mediaPicker';

const Section = styled.div`
  display: grid;
  grid-template-areas: 'Options Remove';
  grid-template-columns: auto 30px;
`;
const Options = styled.div`
  grid-area: Options;
`;
const Remove = styled.div`
  grid-area: Remove;
  justify-self: center;
  align-self: center;
`;
const RemoveButton = styled.button`
  border: 0px;
  background: none;
  padding: 0;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.white};
`;

function CaptionsPanel({ selectedElements, pushUpdate }) {
  const tracks = getCommonValue(selectedElements, 'tracks', []);

  const {
    languages,
    locale: { localeFormatted },
  } = useConfig();

  const handleChangeLanguage = useCallback(
    (inputValue, idToUpdate) => {
      const trackIndex = tracks.findIndex(({ id }) => id === idToUpdate);
      const languagesIndex = languages.findIndex(
        ({ value }) => value === inputValue
      );
      const language = languages[languagesIndex];
      const currentTrack = tracks[trackIndex];
      const newTracks = [
        ...tracks.slice(0, trackIndex),
        { ...currentTrack, srclang: language.value, label: language.name },
        ...tracks.slice(trackIndex + 1),
      ];
      pushUpdate({ tracks: newTracks }, true);
    },
    [tracks, pushUpdate, languages]
  );

  const handleChangeTrack = useCallback(
    (attachment) => {
      const languagesIndex = languages.findIndex(
        ({ value }) => value === localeFormatted
      );

      const language = languages[languagesIndex];

      const newTracks = {
        track: attachment?.url,
        trackId: attachment?.id,
        trackName: attachment?.filename,
        id: uuidv4(),
        kind: 'captions',
        srclang: language.value,
        label: language.name,
      };

      pushUpdate({ tracks: [...tracks, newTracks] }, true);
    },
    [tracks, pushUpdate, languages, localeFormatted]
  );

  const handleRemoveTrack = useCallback(
    (idToDelete) => {
      const trackIndex = tracks.findIndex(({ id }) => id === idToDelete);
      const newTracks = [
        ...tracks.slice(0, trackIndex),
        ...tracks.slice(trackIndex + 1),
      ];
      pushUpdate({ tracks: newTracks }, true);
    },
    [tracks, pushUpdate]
  );

  const subtitleText = __('Upload subtitles', 'web-stories');

  const UploadCaption = useMediaPicker({
    onSelect: handleChangeTrack,
    type: 'text/vtt',
    title: subtitleText,
    buttonInsertText: __('Select subtitle', 'web-stories'),
  });

  return (
    <SimplePanel name="caption" title={__('Captions', 'web-stories')}>
      {tracks &&
        tracks.map(({ id, srclang, trackName }) => (
          <Section key={`section-${id}`}>
            <Options>
              <Row>
                <ExpandedTextInput
                  value={trackName}
                  onChange={() => {}}
                  readonly
                  aria-label={__('Filename', 'web-stories')}
                  key={`filename-${id}`}
                />
              </Row>
              <Row>
                <DropDown
                  options={languages}
                  value={srclang}
                  onChange={(value) => handleChangeLanguage(value, id)}
                  lightMode={true}
                  key={`dropdown-${id}`}
                />
              </Row>
            </Options>
            <Remove>
              <Row>
                <RemoveButton
                  onClick={() => handleRemoveTrack(id)}
                  key={`remove-${id}`}
                >
                  {'x'}
                </RemoveButton>
              </Row>
            </Remove>
          </Section>
        ))}

      <Row expand>
        <Button onClick={UploadCaption} fullWidth>
          {subtitleText}
        </Button>
      </Row>
    </SimplePanel>
  );
}

CaptionsPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default CaptionsPanel;
