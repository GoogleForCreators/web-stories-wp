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
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import MediaOutput from '../media/output';
import { calculateSrcSet } from '../media/util';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param {Object<*>} props Props.
 * @return {*} Rendered component.
 */
function ImageOutput({ element, box }) {
  const { resource } = element;

  const props = {
    layout: 'fill',
    src: resource.src,
    alt: element.alt !== undefined ? element.alt : resource.alt,
  };

  const srcSet = calculateSrcSet(element.resource);
  if (srcSet) {
    props.srcSet = srcSet;
  }

  return (
    <MediaOutput box={box} element={element} data-leaf-element="true">
      <amp-img {...props} />
    </MediaOutput>
  );
}

ImageOutput.propTypes = {
  element: StoryPropTypes.elements.image.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default ImageOutput;
