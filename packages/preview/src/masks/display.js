/*
 * Copyright 2021 Google LLC
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
import { MaskTypes } from '@web-stories-wp/masks';

/**
 * Internal dependencies
 */
import {
  StoryElementBoxPropTypes,
  StoryElementPropType,
  getTransformFlip,
  shouldDisplayBorder,
  getElementMask,
} from '@web-stories-wp/elements';

const FILL_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export default function WithMask({
  element,
  fill,
  style,
  children,
  box,
  applyFlip = true,
  previewMode = false,
  ...rest
}) {
  const mask = getElementMask(element);
  const { flip, isBackground } = element;

  const transformFlip = getTransformFlip(flip);
  if (transformFlip && applyFlip) {
    style.transform = style.transform
      ? `${style.transform} ${transformFlip}`
      : transformFlip;
  }

  // Don't display mask if we have a border, not to cut it off while resizing.
  // Note that border can be applied to a rectangle only anyway.
  if (
    !mask?.type ||
    (isBackground && mask.type !== MaskTypes.RECTANGLE) ||
    shouldDisplayBorder(element)
  ) {
    return (
      <div
        style={{
          ...(fill ? FILL_STYLE : {}),
          ...style,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }

  // @todo: Chrome cannot do inline clip-path using data: URLs.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=1041024.

  const maskId = `mask-${mask.type}-${element.id}-display${
    previewMode ? '-preview' : ''
  }`;

  return (
    <div
      style={{
        pointerEvents: 'initial',
        ...(fill ? FILL_STYLE : {}),
        ...style,
        ...(!isBackground ? { clipPath: `url(#${maskId})` } : {}),
      }}
      {...rest}
    >
      <svg width={0} height={0}>
        <defs>
          <clipPath
            id={maskId}
            transform={`scale(1 ${mask.ratio})`}
            clipPathUnits="objectBoundingBox"
          >
            <path d={mask.path} />
          </clipPath>
        </defs>
      </svg>
      {children}
    </div>
  );
}

WithMask.propTypes = {
  element: StoryElementPropType.isRequired,
  style: PropTypes.object,
  applyFlip: PropTypes.bool,
  fill: PropTypes.bool,
  children: PropTypes.node.isRequired,
  box: StoryElementBoxPropTypes.isRequired,
  previewMode: PropTypes.bool,
};
