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
import styled from 'styled-components';
import { useRef } from '@googleforcreators/react';
import { useUnits } from '@googleforcreators/units';
import { useTransformHandler } from '@googleforcreators/transform';
import {
  getResponsiveBorder,
  shouldDisplayBorder,
} from '@googleforcreators/masks';
import type { ShapeElement, DisplayProps } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import {
  elementFillContent,
  elementWithBackgroundColor,
  elementWithBorder,
  useColorTransformHandler,
} from '../shared';

const Element = styled.div<
  Partial<
    Pick<
      ShapeElement,
      | 'border'
      | 'borderRadius'
      | 'width'
      | 'height'
      | 'mask'
      | 'backgroundColor'
    >
  >
>`
  ${elementFillContent}
  ${elementWithBackgroundColor}
  ${elementWithBorder}
`;

function ShapeDisplay({ element, previewMode }: DisplayProps<ShapeElement>) {
  const {
    id,
    isDefaultBackground,
    backgroundColor,
    border,
    borderRadius,
    mask,
    width: elementWidth,
    height: elementHeight,
  } = element;

  const { dataToEditorX } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
  }));

  const ref = useRef<HTMLDivElement>(null);
  useColorTransformHandler({ id, targetRef: ref });

  useTransformHandler(id, (transform) => {
    // Since outside border is applied directly to the element, we need to
    // adjust the size of the element according to the border width.
    if (ref.current && !isDefaultBackground) {
      if (transform) {
        const { resize } = transform;
        if (resize && resize[0] !== 0 && resize[1] !== 0) {
          const [width, height] = resize;
          if (shouldDisplayBorder(element)) {
            ref.current.style.width =
              width + (border?.left || 0) + (border?.right || 0) + 'px';
            ref.current.style.height =
              height + (border?.top || 0) + (border?.bottom || 0) + 'px';
          }
        }
      } else {
        ref.current.style.width = '';
        ref.current.style.height = '';
      }
    }
  });

  if (isDefaultBackground) {
    return <Element ref={ref} />;
  }

  return (
    <Element
      ref={ref}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      width={elementWidth}
      height={elementHeight}
      border={getResponsiveBorder(border, previewMode, dataToEditorX)}
      mask={mask}
    />
  );
}

export default ShapeDisplay;
