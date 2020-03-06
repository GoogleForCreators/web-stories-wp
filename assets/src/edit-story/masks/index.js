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
import { getDefinitionForType } from '../elements';

// Important! This file cannot use `styled-components` or any stateful/context
// React features to stay compatible with the "output" templates.

export const MaskTypes = {
  HEART: 'heart',
  STAR: 'star',
  CIRCLE: 'circle',
  RECTANGLE: 'rectangle',
  TRIANGLE: 'triangle',
  ROUNDED: 'rounded-rectangle',
  PENTAGON: 'pentagon',
};

const CLIP_PATHS = {
  [MaskTypes.HEART]:
    'M 0.5,1 C 0.5,1,0,0.7,0,0.3 A 0.25,0.25,1,1,1,0.5,0.3 A 0.25,0.25,1,1,1,1,0.3 C 1,0.7,0.5,1,0.5,1 Z',
  [MaskTypes.STAR]:
    'M 0.5 0.75 L 0.207031 0.90625 L 0.261719 0.578125 L 0.0234375 0.34375 L 0.351562 0.296875 L 0.5 0 L 0.648438 0.296875 L 0.976562 0.34375 L 0.738281 0.578125 L 0.792969 0.90625 Z M 0.5 0.75',
  [MaskTypes.RECTANGLE]: 'M 0,0 1,0 1,1 0,1 0,0',
  [MaskTypes.TRIANGLE]: 'M 0.5 0 L 1 1 L 0 1 Z M 0.5 0',
  [MaskTypes.CIRCLE]:
    'M 0.5 0 C 0.777344 0 1 0.222656 1 0.5 C 1 0.777344 0.777344 1 0.5 1 C 0.222656 1 0 0.777344 0 0.5 C 0 0.222656 0.222656 0 0.5 0 Z M 0.5 0 ',
  [MaskTypes.PENTAGON]:
    'M 0.5 0 L 0.976562 0.34375 L 0.792969 0.90625 L 0.207031 0.90625 L 0.0234375 0.34375 Z M 0.5 0',
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
  {
    type: MaskTypes.RECTANGLE,
    name: __('Rectangle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.RECTANGLE],
  },
  {
    type: MaskTypes.TRIANGLE,
    name: __('Triangle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.TRIANGLE],
  },
  {
    type: MaskTypes.CIRCLE,
    name: __('Circle', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.CIRCLE],
  },
  {
    type: MaskTypes.PENTAGON,
    name: __('Pentagon', 'web-stories'),
    path: CLIP_PATHS[MaskTypes.PENTAGON],
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
  const mask = getElementMask(element);
  return (
    <WithtMask
      fill={fill}
      style={style}
      mask={mask}
      elementId={element.id}
      {...rest}
    >
      {children}
    </WithtMask>
  );
}

WithElementMask.propTypes = {
  element: StoryPropTypes.element.isRequired,
  style: PropTypes.object,
  fill: PropTypes.bool,
  children: StoryPropTypes.children.isRequired,
};

function WithtMask({ elementId, mask, fill, style, children, ...rest }) {
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

WithtMask.propTypes = {
  elementId: PropTypes.string.isRequired,
  mask: StoryPropTypes.mask,
  style: PropTypes.object,
  fill: PropTypes.bool,
  children: StoryPropTypes.children.isRequired,
};

export const DEFAULT_MASK = MASKS.find(
  (mask) => mask.type === MaskTypes.RECTANGLE
);

export function getElementMask({ type, mask }) {
  if (mask?.type) {
    return MASKS.find((m) => m.type === mask.type);
  }
  return getDefaultElementMask(type);
}

function getDefaultElementMask(type) {
  const { isMedia } = getDefinitionForType(type);
  return isMedia ? DEFAULT_MASK : null;
}
