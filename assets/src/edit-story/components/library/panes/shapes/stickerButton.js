/*
 * Copyright 2021 Google LLC
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
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import STICKERS from '@web-stories-wp/stickers';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
} from '@web-stories-wp/design-system';
import { useUnits } from '@web-stories-wp/units';

/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import LibraryMoveable from '../shared/libraryMoveable';
import { DEFAULT_ELEMENT_WIDTH } from './shapePreview';

const StickerButton = styled(Button).attrs({
  size: BUTTON_SIZES.SMALL,
  type: BUTTON_TYPES.SECONDARY,
})`
  position: relative;
  margin: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.interactiveBg.previewOverlay};
`;

function StickerPreview({ stickerType }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const { dataToEditorX, dataToEditorY } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));

  const sticker = STICKERS[stickerType];
  const aspectRatio = sticker.aspectRatio;
  const stickerData = useMemo(
    () => ({
      width: DEFAULT_ELEMENT_WIDTH * aspectRatio,
      height: DEFAULT_ELEMENT_WIDTH,
      sticker: {
        type: stickerType,
      },
    }),
    [aspectRatio, stickerType]
  );

  const StickerClone = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    width: ${({ width }) => `${width}px`};
    height: ${({ height }) => `${height}px`};
    svg {
      display: inline-block;
      width: 100%;
      height: 100%;
      path {
        fill: #c4c4c4;
      }
    }
  `;

  const Svg = sticker.svg;
  return (
    <StickerButton
      onClick={() =>
        insertElement('sticker', {
          width: DEFAULT_ELEMENT_WIDTH,
          sticker: { type: stickerType },
        })
      }
    >
      <Svg
        style={{
          height: 'auto',
          width: '100%',
        }}
      />
      <LibraryMoveable
        type={'sticker'}
        elementProps={stickerData}
        cloneElement={StickerClone}
        onClick={() =>
          insertElement('sticker', {
            width: DEFAULT_ELEMENT_WIDTH,
            sticker: { type: stickerType },
          })
        }
        cloneProps={{
          width: dataToEditorX(DEFAULT_ELEMENT_WIDTH * aspectRatio),
          height: dataToEditorY(DEFAULT_ELEMENT_WIDTH),
          children: (
            <Svg
              style={{
                height: 'auto',
                width: '100%',
              }}
            />
          ),
        }}
      />
    </StickerButton>
  );
}

StickerPreview.propTypes = {
  stickerType: PropTypes.string.isRequired,
};

export default StickerPreview;
