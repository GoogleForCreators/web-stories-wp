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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../types';
import { useStory } from '../app/story';
import { useDropTargets } from '../app';
import { getElementMask } from './';

const FILL_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const DropTargetSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const DropTargetPath = styled.path`
  transition: opacity 0.5s;
  pointer-events: visibleStroke;
  opacity: ${({ active }) => (active ? 0.3 : 0)};
`;

function WithDropTarget({ element, children }) {
  const pathRef = useRef(null);

  const {
    actions: { setActiveDropTarget },
    state: { activeDropTarget },
  } = useStory();
  const {
    actions: { registerDropTarget },
  } = useDropTargets();

  const [active, setActive] = useState();
  const { mask, id } = element;

  useEffect(() => {
    if (active) {
      setActiveDropTarget({ elementId: id });
    } else if (activeDropTarget === id) {
      setActiveDropTarget({ elementId: null });
    }
  }, [active, activeDropTarget, id, setActiveDropTarget]);

  useEffect(() => {
    registerDropTarget(id, pathRef.current);
  }, [id, pathRef, registerDropTarget]);

  if (!mask) {
    return children;
  }

  return (
    <>
      {children}
      <DropTargetSVG
        viewBox="0 0 1 1"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <DropTargetPath
          ref={pathRef}
          vectorEffect="non-scaling-stroke"
          strokeWidth="32"
          fill="none"
          stroke="#0063F9"
          strokeLinecap="round"
          strokeLinejoin="round"
          d={mask?.path}
          active={active}
          onFocus={() => {}}
          onBlur={() => {}}
          onTouchStart={() => {
            setActive(true);
          }}
          onMouseOver={() => {
            setActive(true);
          }}
          onTouchEnd={() => {
            setActive(false);
          }}
          onMouseOut={() => {
            setActive(false);
          }}
        />
      </DropTargetSVG>
    </>
  );
}

WithDropTarget.propTypes = {
  mask: StoryPropTypes.mask,
  element: StoryPropTypes.element,
  children: StoryPropTypes.children.isRequired,
};

export default function WithMask({ element, fill, style, children, ...rest }) {
  const mask = getElementMask(element);
  if (!mask?.type) {
    return children;
  }

  // @todo: Chrome cannot do inline clip-path using data: URLs.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=1041024.

  const maskId = `mask-${mask.type}-${element.id}`;

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
      <WithDropTarget element={element}>{children}</WithDropTarget>
    </div>
  );
}

WithMask.propTypes = {
  element: StoryPropTypes.element.isRequired,
  style: PropTypes.object,
  fill: PropTypes.bool,
  children: StoryPropTypes.children.isRequired,
};
