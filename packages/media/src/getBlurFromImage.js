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
import { encode } from 'blurhash';
/**
 * Internal dependencies
 */
import preloadImage from './preloadImage';

const getImageData = (image) => {
  const { width, height } = image;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return ctx.getImageData(0, 0, width, height);
};

const encodeImageToBlurhash = async (src) => {
  const image = await preloadImage(src);
  const imageData = getImageData(image);
  const { data, width, height } = imageData;
  // todo workout why 1 and 1 the only options that are not painfully slow.
  return encode(data, width, height, 1, 1);
};
export default encodeImageToBlurhash;
