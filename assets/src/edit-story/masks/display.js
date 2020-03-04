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
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */

import StoryPropTypes from '../types';
import { useTransformHandler } from '../components/transform';
import { getDefinitionForType } from '../elements';
import { getElementMask } from './';

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
  ...rest
}) {
  const [replacement, setReplacement] = useState(null);
  const mask = getElementMask(element);
  useTransformHandler(element.id, (transform) => {
    const elementReplacement = transform?.updates?.elementReplacement;
    setReplacement(elementReplacement);
  });

  if (!mask?.type) {
    return children;
  }

  // @todo: Chrome cannot do inline clip-path using data: URLs.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=1041024.

  const maskId = `mask-${mask.type}-${element.id}`;

  const getDisplayElement = (el) => {
    const { type } = el;
    // Required two-step destructure because of a bug in eslint
    // https://github.com/WordPress/gutenberg/issues/16418
    const def = getDefinitionForType(type);
    const Display = def.Display;
    return <Display element={el} box={box} />;
  };

  return (
    <div
      style={{
        ...(fill ? FILL_STYLE : {}),
        ...style,
        clipPath: `url(#${maskId})`,
      }}
      {...rest}
    >
      <svg width={0} height={0}>
        <defs>
          <clipPath id={maskId} clipPathUnits="objectBoundingBox">
            <path d={mask.path} />
          </clipPath>
        </defs>
      </svg>
      {replacement ? getDisplayElement(replacement) : children}
    </div>
  );
}

WithMask.propTypes = {
  element: StoryPropTypes.element.isRequired,
  style: PropTypes.object,
  fill: PropTypes.bool,
  children: StoryPropTypes.children.isRequired,
  box: StoryPropTypes.box.isRequired,
};
