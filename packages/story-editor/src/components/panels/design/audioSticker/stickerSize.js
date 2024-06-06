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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { SimplePanel } from '../../panel';
import { Row, Switch } from '../../../form';

import { states, useHighlights } from '../../../../app/highlights';
import styles from '../../../../app/highlights/styles';
import { getDimensionsForAudioSticker } from './utils';

function StickerSize({ selectedElements, pushUpdate }) {
  const stickerObj = selectedElements[0];
  const size = stickerObj.size;
  const type = stickerObj.sticker;

  const { highlight, resetHighlight } = useHighlights((state) => ({
    highlight: state[states.Style],
    resetHighlight: state.onFocusOut,
  }));

  const onSizeChange = useCallback(
    (_, isSmall) => {
      const stickerSize = isSmall ? 'small' : 'large';
      const { width, height } = getDimensionsForAudioSticker(type, stickerSize);

      pushUpdate(
        {
          width: width,
          height: height,
          size: stickerSize,
        },
        true
      );
    },
    [pushUpdate, type]
  );

  return (
    <SimplePanel
      css={highlight?.showEffect && styles.FLASH}
      onAnimationEnd={() => resetHighlight()}
      name="audioStickerSize"
      title={__('Size', 'web-stories')}
      isPersistable={!highlight}
      aria-labelledby={null}
      aria-label={__('Audio Sticker Size', 'web-stories')}
    >
      <Row>
        <Switch
          groupLabel={__('Size', 'web-stories')}
          name="audio-sticker-size-switch"
          value={size === 'small'}
          onLabel={__('Small', 'web-stories')}
          offLabel={__('Large', 'web-stories')}
          onChange={onSizeChange}
        />
      </Row>
    </SimplePanel>
  );
}

export default StickerSize;

StickerSize.propTypes = {
  selectedElements: PropTypes.array,
  pushUpdate: PropTypes.func,
};
