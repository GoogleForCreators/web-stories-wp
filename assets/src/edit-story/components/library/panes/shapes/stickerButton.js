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
import PropTypes from 'prop-types';
import STICKERS from '@web-stories-wp/stickers';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import useLibrary from '../../useLibrary';
import { DEFAULT_ELEMENT_WIDTH } from './shapePreview';

function StickerButton({ stickerType }) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));

  const Svg = STICKERS?.[stickerType]?.svg;
  return (
    <Button
      size={BUTTON_SIZES.SMALL}
      type={BUTTON_TYPES.SECONDARY}
      onClick={() =>
        insertElement('sticker', {
          width: DEFAULT_ELEMENT_WIDTH,
          sticker: { type: stickerType },
        })
      }
      style={{
        marginBottom: 10,
        marginRight: 10,
        height: 60,
      }}
    >
      <Svg
        style={{
          height: '100%',
          width: 'auto',
        }}
      />
    </Button>
  );
}

StickerButton.propTypes = {
  stickerType: PropTypes.string.isRequired,
};

export default StickerButton;
