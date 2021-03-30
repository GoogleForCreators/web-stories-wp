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
import { getSmallestUrlForWidth } from '@web-stories-wp/media';
import { StoryElementPropType } from '@web-stories-wp/elements';

/**
 * Internal dependencies
 */
import VisibleImage from '../media/visibleImage';

function GifLayerIcon({
  element: {
    resource,
    resource: { alt },
  },
}) {
  const src = getSmallestUrlForWidth(0, resource);
  return <VisibleImage src={src} alt={alt} height="20" />;
}

GifLayerIcon.propTypes = {
  element: StoryElementPropType.isRequired,
};

export default GifLayerIcon;
