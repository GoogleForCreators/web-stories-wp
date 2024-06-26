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
import stickers from '@googleforcreators/stickers';
import type { StickerElement, DisplayProps } from '@googleforcreators/elements';
import type { CSSProperties } from 'react';

const style: CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: 0,
  height: '100%',
  width: 'auto',
};

const Noop = () => null;

function StickerDisplay({ element }: DisplayProps<StickerElement>) {
  const { sticker } = element;
  const Sticker = stickers[sticker?.type]?.svg || Noop;
  return <Sticker style={style} />;
}

export default StickerDisplay;
