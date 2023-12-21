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
import { useRef } from '@googleforcreators/react';
import { useTransformHandler } from '@googleforcreators/transform';
import { shouldDisplayBorder } from '@googleforcreators/masks';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithBackgroundColor,
  elementWithBorder,
} from '../shared';
import { AUDIO_STICKERS, AUDIO_STICKER_STYLES } from './constants';

/**
 * Internal dependencies
 */

const Element = styled.img`
  ${elementFillContent}
  ${elementWithBackgroundColor}
  ${elementWithBorder}
  ${({ stickerStyle }) => AUDIO_STICKER_STYLES[stickerStyle]}
`;

function AudioStickerDisplay({ element }) {
  const {
    id,
    border,
    width: elementWidth,
    height: elementHeight,
    sticker,
    style,
  } = element;

  const ref = useRef(null);

  useTransformHandler(id, (transform) => {
    // Since outside border is applied directly to the element, we need to
    // adjust the size of the element according to the border width.
    if (ref.current) {
      if (transform) {
        const { resize } = transform;
        if (resize && resize[0] !== 0 && resize[1] !== 0) {
          const [width, height] = resize;
          if (shouldDisplayBorder(element)) {
            ref.current.style.width = width + border.left + border.right + 'px';
            ref.current.style.height =
              height + border.top + border.bottom + 'px';
          }
        }
      } else {
        ref.current.style.width = '';
        ref.current.style.height = '';
      }
    }
  });

  return (
    <Element
      src={AUDIO_STICKERS[sticker]}
      stickerStyle={style}
      ref={ref}
      height={elementHeight}
      width={elementWidth}
      alt="audio-sticker"
    />
  );
}

AudioStickerDisplay.propTypes = {
  element: StoryPropTypes.elements.shape.isRequired,
};

export default AudioStickerDisplay;
