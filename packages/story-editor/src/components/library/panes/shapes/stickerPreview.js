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
import { useMemo } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import STICKERS from '@googleforcreators/stickers';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
} from '@googleforcreators/design-system';
import { useUnits } from '@googleforcreators/units';

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
  padding: 0 0 95.5% 0;
  margin: 0;
  height: 60px;
  background-color: ${({ theme }) => theme.colors.interactiveBg.previewOverlay};
`;

const StickerInner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StickerClone = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
`;

function StickerPreview({ stickerType, index }) {
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

  const Svg = sticker.svg;
  return (
    <StickerButton
      data-testid={`library-sticker-${stickerType}`}
      onClick={() =>
        insertElement('sticker', {
          width: DEFAULT_ELEMENT_WIDTH,
          sticker: { type: stickerType },
        })
      }
      tabIndex={index === 0 ? 0 : -1}
    >
      <StickerInner>
        <Svg
          style={{
            height: aspectRatio < 0.955 ? '60%' : 'auto',
            width: aspectRatio < 0.955 ? 'auto' : '60%',
          }}
        />
        <LibraryMoveable
          type={'sticker'}
          elementProps={stickerData}
          cloneElement={StickerClone}
          cloneProps={{
            width: dataToEditorX(
              DEFAULT_ELEMENT_WIDTH * (aspectRatio < 1 ? aspectRatio : 1)
            ),
            height: dataToEditorY(
              DEFAULT_ELEMENT_WIDTH / (aspectRatio < 1 ? 1 : aspectRatio)
            ),
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
      </StickerInner>
    </StickerButton>
  );
}

StickerPreview.propTypes = {
  stickerType: PropTypes.oneOf(Object.keys(STICKERS)).isRequired,
  index: PropTypes.number,
};

export default StickerPreview;
