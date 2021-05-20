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
import StoryPropTypes from '../../../types';
import { shouldDisplayBorder } from '../../../utils/elementBorder';
import { MaskTypes } from '../../../masks/constants';
import { getElementMask } from '../../../masks';

function Masked({ element, children }) {
  const mask = getElementMask(element);

  // Don't display mask if we have a border, not to cut it off while resizing.
  // Note that border can be applied to a rectangle only anyway.
  if (
    !mask?.type ||
    mask.type === MaskTypes.RECTANGLE ||
    shouldDisplayBorder(element)
  ) {
    return children;
  }
  const maskId = `mask-${mask.type}-${element.id}-thumbnail`;

  return (
    <>
      <mask
        id={maskId}
        viewBox={`0 0 1 ${mask.ratio}`}
        maskContentUnits="objectBoundingBox"
      >
        <path d={mask.path} fill="white" />
      </mask>
      <g mask={`url(#${maskId})`}>{children}</g>
    </>
  );
}

Masked.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
};

export default Masked;
