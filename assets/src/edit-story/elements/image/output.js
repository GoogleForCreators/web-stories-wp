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
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';
import { editorPixels } from '../../units';
import { getMediaProps } from '../shared';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function ImageOutput({
  element: { resource, scale, focalX, focalY },
  box: { width: vw, height: vh },
}) {
  // Width and height are taken from the basis of 100% taking into account the
  // aspect ratio.
  const width = vw;
  const height = (vh * PAGE_HEIGHT) / PAGE_WIDTH;
  const imgProps = getMediaProps(
    resource,
    width,
    height,
    scale,
    focalX,
    focalY
  );

  const wrapperStyle = {
    position: 'absolute',
    width: `${editorPixels((imgProps.width / width) * 100)}%`,
    height: `${editorPixels((imgProps.height / height) * 100)}%`,
    left: `${-editorPixels((imgProps.offsetX / width) * 100)}%`,
    top: `${-editorPixels((imgProps.offsetY / height) * 100)}%`,
  };

  const props = {
    layout: 'fill',
    src: resource.src,
  };

  return (
    <div style={wrapperStyle}>
      <amp-img {...props} />
    </div>
  );
}

ImageOutput.propTypes = {
  element: StoryPropTypes.elements.image.isRequired,
  box: StoryPropTypes.box.isRequired,
};

export default ImageOutput;
