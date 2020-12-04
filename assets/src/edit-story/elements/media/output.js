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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { PAGE_WIDTH, PAGE_HEIGHT } from '../../constants';
import { editorPixels } from '../../units';
import getMediaSizePositionProps from './getMediaSizePositionProps';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param {Object<*>} props Props.
 * @return {*} Rendered component.
 */
function MediaOutput({
  element: { resource, scale, focalX, focalY },
  box: { width: vw, height: vh },
  children,
  ...props
}) {
  // Width and height are taken from the basis of 100% taking into account the
  // aspect ratio.
  const width = vw;
  const height = (vh * PAGE_HEIGHT) / PAGE_WIDTH;
  const mediaProps = getMediaSizePositionProps(
    resource,
    width,
    height,
    scale,
    focalX,
    focalY
  );

  const wrapperStyle = {
    position: 'absolute',
    width: `${editorPixels((mediaProps.width / width) * 100)}%`,
    height: `${editorPixels((mediaProps.height / height) * 100)}%`,
    left: `${-editorPixels((mediaProps.offsetX / width) * 100)}%`,
    top: `${-editorPixels((mediaProps.offsetY / height) * 100)}%`,
  };

  return (
    <div style={wrapperStyle} {...props}>
      {children}
    </div>
  );
}

MediaOutput.propTypes = {
  element: StoryPropTypes.elements.media.isRequired,
  box: StoryPropTypes.box.isRequired,
  children: PropTypes.node.isRequired,
};

export default MediaOutput;
