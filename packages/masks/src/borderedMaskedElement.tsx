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
import { v4 as uuidv4 } from 'uuid';
import { getTransformFlip } from '@googleforcreators/elements';
import type {
  Element,
  Mask,
  BackgroundableElement,
} from '@googleforcreators/elements';
import type { ReactNode, CSSProperties } from 'react';

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

const FILL_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const SVG_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
};

interface MaskedElementProps {
  style: CSSProperties;
  id: string;
  mask: Mask;
  children: ReactNode;
}

function MaskedElement({
  style,
  id,
  mask: { ratio, path },
  children,
  ...rest
}: MaskedElementProps) {
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
            transform={`scale(1 ${ratio || 1})`}
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

interface BorderedMaskedElementProps {
  element: Element;
  style?: CSSProperties;
  children?: ReactNode;
  applyFlip?: boolean;
  hasFill: boolean;
  getBorderWidth: () => number;
  postfix?: string;
  elementWidth: number;
  elementHeight: number;
  forceRectangularMask: boolean;
}

function elementAsBackground(
  element: Element
): element is BackgroundableElement {
  return 'isBackground' in element;
}

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
}: BorderedMaskedElementProps) {
  // This component is used twice - random id appended to make sure
  // id is unique for the Mask.
  const randomId = useMemo(() => uuidv4(), []);
  const mask = getElementMask(element);
  const { id, flip, border } = element;

  const flipTransform = (applyFlip && flip && getTransformFlip(flip)) || '';

  const actualTransform = `${style?.transform || ''} ${flipTransform}`.trim();

  const fullStyle: CSSProperties = {
    ...(hasFill ? FILL_STYLE : {}),
    ...style,
    transform: actualTransform || undefined,
  };

  const borderWidth = getBorderWidth();
  const borderColor = border?.color
    ? getBorderColor({ color: border.color })
    : 'none';

  // If this is rectangular bordered element, just display a CSS border with the element inside
  if (
    !mask?.type ||
    (elementAsBackground(element) &&
      element.isBackground &&
      mask.type !== MaskTypes.RECTANGLE) ||
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

    const borderStyle: CSSProperties = {
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

export default BorderedMaskedElement;
