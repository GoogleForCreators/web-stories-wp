/*
 * Copyright 2022 Google LLC
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
import { StoryPropTypes } from '@googleforcreators/elements';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import VisibleImage from '../shared/visibleImage';

function ProductLayerIcon({ element: { product } }) {
  const productImage = product?.productImages?.[0] || {};
  const { url, alt } = productImage;
  if (!url) {
    return <Icons.Shopping width={21} height={21} title="" />;
  }
  return <VisibleImage src={url} alt={alt} height={21} width={21} />;
}

ProductLayerIcon.propTypes = {
  element: StoryPropTypes.element.isRequired,
};

export default ProductLayerIcon;
