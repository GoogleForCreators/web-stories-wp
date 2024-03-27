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

// Important! This file cannot use `styled-components` or any stateful/context
// React features to stay compatible with the "output" templates.

/* eslint no-restricted-imports: ["error", { "paths": ["styled-components"] }] -- Cannot use styled-components here. */

/**
 * External dependencies
 */
import type { Element } from '@googleforcreators/elements';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Internal dependencies
 */
import BorderedMaskedElement from './borderedMaskedElement';
import { DEFAULT_MASK } from './constants';

interface WithMaskProps {
  element: Element;
  style: CSSProperties;
  fill?: boolean;
  children: ReactNode;
  skipDefaultMask?: boolean;
  className?: string;
  id?: string;
}

export default function WithMask({
  element,
  fill = false,
  skipDefaultMask = false,
  ...rest
}: WithMaskProps) {
  const getBorderWidth = () => element.border?.left || 0;
  const elementWidth = element.width;
  const elementHeight = element.height;
  const forceRectangularMask =
    skipDefaultMask && element.mask?.type === DEFAULT_MASK.type;

  return (
    <BorderedMaskedElement
      element={element}
      hasFill={fill}
      getBorderWidth={getBorderWidth}
      elementWidth={elementWidth}
      elementHeight={elementHeight}
      forceRectangularMask={forceRectangularMask}
      {...rest}
    />
  );
}
