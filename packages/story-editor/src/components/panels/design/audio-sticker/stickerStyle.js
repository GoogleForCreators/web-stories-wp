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
  AUDIO_STICKER_STYLES,
} from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import { Row, FilterToggle } from '../../../form';
import { SimplePanel } from '../../panel';
import { states, useHighlights } from '../../../../app/highlights';
import styles from '../../../../app/highlights/styles';

const AudioStickerStylePreset = {
  none: {
    label: __('None', 'web-stories'),
  },
  outline: {
    label: __('Outline', 'web-stories'),
  },
  dropshadow: {
    label: __('Drop shadow', 'web-stories'),
  },
};

const StickerImage = styled.img`
  width: 100%;
  ${({ stickerStyle }) => AUDIO_STICKER_STYLES[stickerStyle]}
`;

function StickerStyle({ selectedElements, pushUpdate }) {
  const stickerObj = selectedElements[0];
  const style = stickerObj.style;
  const type = stickerObj.sticker;

  const { highlight, resetHighlight } = useHighlights((state) => ({
    highlight: state[states.Style],
    resetHighlight: state.onFocusOut,
  }));

  const onStickerStyleChange = useCallback(
    (stickerStyle) => {
      //   const { width, height } = getDimensionsForAudioSticker(stickerType, size);
      pushUpdate(
        {
          style: stickerStyle,
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
      title={__('Style', 'web-stories')}
      isPersistable={!highlight}
      aria-labelledby={null}
      aria-label={__('Audio Sticker Style', 'web-stories')}
    >
      <Row style={{ alignItems: 'flex-start' }}>
        {Object.keys(AudioStickerStylePreset).map((stickerStyle) => {
          const { label } = AudioStickerStylePreset[stickerStyle];
          return (
            <FilterToggle
              key={stickerStyle}
              element={selectedElements[0]}
              label={label}
              isToggled={stickerStyle === style}
              onClick={() => {
                onStickerStyleChange(stickerStyle);
              }}
              aria-label={sprintf(
                /* translators: %s: Sticker type */
                __('Sticker Style: %s', 'web-stories'),
                label
              )}
            >
              <StickerImage
                src={AUDIO_STICKERS[type]}
                alt="audio-sticker"
                stickerStyle={stickerStyle}
              />
            </FilterToggle>
          );
        })}
      </Row>
    </SimplePanel>
  );
}

export default StickerStyle;

StickerStyle.propTypes = {
  selectedElements: PropTypes.array,
  pushUpdate: PropTypes.func,
};
