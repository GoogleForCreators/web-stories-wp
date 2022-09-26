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

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param {Object<*>} props Props.
 * @return {*} Rendered component.
 */
function ProductOutput({ element }) {
  const { product } = element;

  if (!product?.productId) {
    return null;
  }

  return <amp-story-shopping-tag data-product-id={product.productId} />;
}

ProductOutput.propTypes = {
  element: StoryPropTypes.elements.shape.isRequired,
};

export default ProductOutput;
