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
import { useMemo } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { getTransformFlip } from '@googleforcreators/design-system';
import { StoryPropTypes } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { MaskTypes } from './constants';
import {
  getElementMask,
  canSupportMultiBorder,
  getBorderedMaskProperties,
} from './masks';
import { getBorderColor } from './utils/elementBorder';

const FILL_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const SVG_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
};

function BorderedMaskedElement({
  hasFill = false,
  style,
  children,
  applyFlip = true,
  postfix = '',
  getBorderWidth,
  element,
  elementWidth,
  elementHeight,
  forceRectangularMask = false,
  ...rest
}) {
  // This component is used twice - random id appended to make sure
  // id is unique for the Mask.
  const randomId = useMemo(uuidv4, []);
  const mask = getElementMask(element);
  const { id, flip, isBackground, border } = element;

  const flipTransform = (applyFlip && getTransformFlip(flip)) || '';

  const actualTransform = `${style?.transform || ''} ${flipTransform}`.trim();

  const fullStyle = {
    ...(hasFill ? FILL_STYLE : {}),
    ...style,
    transform: actualTransform || null,
  };

  const borderWidth = getBorderWidth();
  const borderColor = border?.color
    ? getBorderColor({ color: border.color })
    : 'none';

  // If this is rectangular bordered element, just display a CSS border with the element inside
  if (
    !mask?.type ||
    (isBackground && mask.type !== MaskTypes.RECTANGLE) ||
    forceRectangularMask
  ) {
    return (
      <div style={fullStyle} {...rest}>
        {children}
      </div>
    );
  }

  const showSingleBorder =
    !canSupportMultiBorder(element) &&
    borderWidth > 0 &&
    borderColor !== 'none';

  // @todo: Chrome cannot do inline clip-path using data: URLs.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=1041024.
  const maskId = `mask-${mask.type}-${id}-display${postfix}-${randomId}`;

  if (showSingleBorder) {
    const { viewBox, groupTransform, borderWrapperStyle } =
      getBorderedMaskProperties(mask, borderWidth, elementWidth, elementHeight);

    const borderStyle = {
      ...style,
      ...borderWrapperStyle,
      transform: actualTransform,
      pointerEvents: 'none',
    };

    return (
      <div style={style}>
        <div style={borderStyle}>
          <svg
            viewBox={viewBox}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            style={SVG_STYLE}
          >
            <g transform={groupTransform}>
              <path
                d={mask.path}
                stroke={borderColor}
                strokeWidth={borderWidth}
                vectorEffect="non-scaling-stroke"
                fill="transparent"
              />
            </g>
          </svg>
        </div>
        <MaskedElement
          style={{ ...fullStyle, opacity: 1 }}
          mask={mask}
          id={maskId}
          {...rest}
        >
          {children}
        </MaskedElement>
      </div>
    );
  }

  return (
    <MaskedElement style={fullStyle} mask={mask} id={maskId} {...rest}>
      {children}
    </MaskedElement>
  );
}

BorderedMaskedElement.propTypes = {
  element: StoryPropTypes.element.isRequired,
  style: PropTypes.object,
  applyFlip: PropTypes.bool,
  hasFill: PropTypes.bool,
  children: PropTypes.node.isRequired,
  getBorderWidth: PropTypes.func.isRequired,
  postfix: PropTypes.string,
  elementWidth: PropTypes.number.isRequired,
  elementHeight: PropTypes.number.isRequired,
  forceRectangularMask: PropTypes.bool,
};

function MaskedElement({
  style,
  id,
  mask: { ratio, path },
  children,
  ...rest
}) {
  return (
    <div
      style={{
        ...style,
        clipPath: `url(#${id})`,
        // stylelint-disable-next-line
        WebkitClipPath: `url(#${id})`,
      }}
      {...rest}
    >
      <svg width={0} height={0}>
        <defs>
          <clipPath
            id={id}
            transform={`scale(1 ${ratio})`}
            clipPathUnits="objectBoundingBox"
          >
            <path d={path} />
          </clipPath>
        </defs>
      </svg>
      {children}
    </div>
  );
}

MaskedElement.propTypes = {
  style: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  mask: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default BorderedMaskedElement;
