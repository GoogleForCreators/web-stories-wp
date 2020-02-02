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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { getCommonAttributes } from '../shared';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 */
function ImagePreview({ id, src, width, height, x, y, rotationAngle, isFill }) {
  const props = {
    layout: 'fill',
    src,
    style: {
      objectFit: isFill ? 'cover' : null,
      width: '100%',
      height: '100%',
    },
  };
  const wrapperProps = {
    id: 'el-' + id,
  };
  const style = getCommonAttributes({ width, height, x, y, rotationAngle });
  // @todo This is missing focal point handling which will be resolved separately.
  if (isFill) {
    style.top = 0;
    style.left = 0;
    style.width = '100%';
    style.height = '100%';
  }

  return (
    <div style={{ ...style }} {...wrapperProps}>
      <img
        draggable="false"
        alt={__('Page preview', 'web-stories')}
        {...props}
      />
    </div>
  );
}

ImagePreview.propTypes = {
  id: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  rotationAngle: PropTypes.number.isRequired,
  isFill: PropTypes.bool,
};

export default ImagePreview;
