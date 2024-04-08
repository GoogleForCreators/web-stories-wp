/*
 * Copyright 2023 Google LLC
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
import PropTypes from 'prop-types';
import { useCallback } from '@googleforcreators/react';
import { __, sprintf } from '@googleforcreators/i18n';
import {
  AUDIO_STICKERS,
  AUDIO_STICKER_LABELS,
} from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import { Row, FilterToggle } from '../../../form';
import { SimplePanel } from '../../panel';
import { states, useHighlights } from '../../../../app/highlights';
import styles from '../../../../app/highlights/styles';

export const AudioStickerPreset = {
  'headphone-cat': {
    label: __('Headphone Cat', 'web-stories'),
  },
  'tape-player': {
    label: __('Tape Player', 'web-stories'),
  },
  'loud-speaker': {
    label: __('Loud Speaker', 'web-stories'),
  },
  'audio-cloud': {
    label: __('Audio Cloud', 'web-stories'),
  },
};

const StickerImage = styled.img`
  width: 100%;
`;

function StickerType({ selectedElements, pushUpdate }) {
  const stickerObj = selectedElements[0];

  const { highlight, resetHighlight } = useHighlights((state) => ({
    highlight: state[states.Style],
    resetHighlight: state.onFocusOut,
  }));

  const onStickerTypeChange = useCallback(
    (stickerType) => {
      pushUpdate(
        {
          sticker: stickerType,
        },
        true
      );
    },
    [pushUpdate]
  );

  return (
    <SimplePanel
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name="audioStickerType"
      title={__('Type', 'web-stories')}
      isPersistable={!highlight}
      aria-labelledby={null}
      aria-label={__('Audio Sticker Type', 'web-stories')}
    >
      <Row>
        {Object.keys(AudioStickerPreset).map((type) => {
          const { label } = AudioStickerPreset[type];
          return (
            <FilterToggle
              key={type}
              element={stickerObj}
              label={label}
              isToggled={type === stickerObj.sticker}
              onClick={() => {
                onStickerTypeChange(type);
              }}
              aria-label={sprintf(
                /* translators: %s: Sticker type */
                __('Sticker Type: %s', 'web-stories'),
                label
              )}
            >
              <StickerImage
                src={AUDIO_STICKERS[type]}
                alt={AUDIO_STICKER_LABELS[type].label}
              />
            </FilterToggle>
          );
        })}
      </Row>
    </SimplePanel>
  );
}

export default StickerType;

StickerType.propTypes = {
  selectedElements: PropTypes.array,
  pushUpdate: PropTypes.func,
};
