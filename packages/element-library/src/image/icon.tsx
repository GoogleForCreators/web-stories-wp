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
import { getSmallestUrlForWidth } from '@googleforcreators/media';
import type { ImageElement } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import VisibleImage from '../shared/visibleImage';
import type { LayerIconProps } from '../types';

function ImageLayerIcon({
  element: { resource },
  getProxiedUrl,
}: LayerIconProps<ImageElement>) {
  const url = getSmallestUrlForWidth(0, resource);
  const src = getProxiedUrl(resource, url) || undefined;
  return <VisibleImage src={src} height={21} width={21} />;
}

export default ImageLayerIcon;
