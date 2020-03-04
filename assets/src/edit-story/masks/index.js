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
import StoryPropTypes from '../types';
import getTransformFlip from '../elements/shared/getTransformFlip';

// Important! This file cannot use `styled-components` or any stateful/context
// React features to stay compatible with the "output" templates.

export const MaskTypes = {
  HEART: 'heart',
  STAR: 'star',
};

const CLIP_PATHS = {
  // @todo: This is a very bad heart.
  [MaskTypes.HEART]:
    'M 0.5,1 C 0.5,1,0,0.7,0,0.3 A 0.25,0.25,1,1,1,0.5,0.3 A 0.25,0.25,1,1,1,1,0.3 C 1,0.7,0.5,1,0.5,1 Z',
  // @todo: This is a horrible star.
  [MaskTypes.STAR]: 'M .5,0 L .8,1 L 0,.4 L 1,.4 L .2,1 Z',
  // viewbox = [0 0 163 155]
  // M 81.5 0 L 100.696 59.079 H 162.815 L 112.56 95.5919 L 131.756 154.671 L 81.5 118.158 L 31.2444 154.671 L 50.4403 95.5919 L 0.184669 59.079H62.3041L81.5 0 Z
};

export const MASKS = [
  {
    type: MaskTypes.HEART,
    name: __('Heart', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.HEART],
  },
  {
    type: MaskTypes.STAR,
    name: __('Star', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.STAR],
  },
];

const FILL_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export function WithElementMask({ element, fill, style, children, ...rest }) {
  const mask = getElementMaskProperties(element);
  return (
    <WithMask
      fill={fill}
      flip={element.flip}
      style={style}
      mask={mask}
      elementId={element.id}
      {...rest}
    >
      {children}
    </WithMask>
  );
}

WithElementMask.propTypes = {
  element: StoryPropTypes.element.isRequired,
  style: PropTypes.object,
  fill: PropTypes.bool,
  children: StoryPropTypes.children.isRequired,
};

function WithMask({ elementId, mask, fill, flip, style, children, ...rest }) {
  const maskType = (mask && mask.type) || null;

  const fillStyle = fill ? FILL_STYLE : null;

  const allStyles = {
    ...fillStyle,
    ...style,
  };

  if (maskType) {
    // @todo: Chrome cannot do inline clip-path using data: URLs.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=1041024.

    const maskId = `mask-${maskType}-${elementId}`;
    allStyles.clipPath = `url(#${maskId})`;
    allStyles.transform = getTransformFlip(flip);

    return (
      <div style={allStyles} {...rest}>
        <svg width={0} height={0}>
          <defs>
            <clipPath id={maskId} clipPathUnits="objectBoundingBox">
              <path d={CLIP_PATHS[maskType]} />
            </clipPath>
          </defs>
        </svg>
        {children}
      </div>
    );
  }
  return (
    <div style={allStyles} {...rest}>
      {children}
    </div>
  );
}

WithMask.propTypes = {
  elementId: PropTypes.string.isRequired,
  mask: StoryPropTypes.mask,
  style: PropTypes.object,
  flip: PropTypes.shape({
    vertical: PropTypes.bool,
    horizontal: PropTypes.bool,
  }),
  fill: PropTypes.bool,
  children: StoryPropTypes.children.isRequired,
};

function getElementMaskProperties({ type, mask, ...rest }) {
  if (mask) {
    return mask;
  }
  return getDefaultElementMaskProperties({ type, ...rest });
}

function getDefaultElementMaskProperties({}) {
  // @todo: mask-based shapes (square, circle, etc) automatically assume masks.
  return null;
}
