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
import styled, { css } from 'styled-components';
import { useRef, useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../types';
import { useDropTargets } from '../app';
import getTransformFlip from '../elements/shared/getTransformFlip';
import { getElementMask, MaskTypes } from './';

const FILL_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

const svgCss = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const DropTargetSVG = styled.svg`
  ${svgCss}
  z-index: ${({ active }) => (active ? 1 : -1)};
`;

const Filler = styled.svg`
  ${svgCss}
`;

const FillerPath = styled.path`
  pointer-events: all;
`;

const DropTargetPath = styled.path`
  transition: opacity 0.5s;
  pointer-events: visibleStroke;
  opacity: ${({ active }) => (active ? 0.3 : 0)};
`;

function WithDropTarget({ element, children, hover }) {
  const pathRef = useRef(null);

  const {
    state: { draggingResource, activeDropTargetId },
    actions: { isDropSource, registerDropTarget, unregisterDropTarget },
  } = useDropTargets();

  const { id, resource } = element;
  const mask = getElementMask(element);

  useEffect(() => {
    registerDropTarget(id, pathRef.current);
    return () => {
      unregisterDropTarget(id);
    };
  }, [id, registerDropTarget, unregisterDropTarget]);

  if (!mask) {
    return children;
  }

  const pathProps = {
    vectorEffect: 'non-scaling-stroke',
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    d: mask?.path,
    stroke: '#0063F9',
  };
  return (
    <>
      {children}
      <DropTargetSVG
        viewBox={`0 0 1 ${1 / mask.ratio}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        // Fixes issue where the outline prevents double-clicks from
        // reaching the frame through zIndex
        active={activeDropTargetId === element.id}
      >
        {/** Suble indicator that the element has a drop target */}
        <DropTargetPath
          {...pathProps}
          strokeWidth="4"
          style={
            (hover && !draggingResource) ||
            (Boolean(draggingResource) &&
              isDropSource(draggingResource.type) &&
              draggingResource !== resource)
              ? { opacity: 1 }
              : {}
          }
        />
        {/** Drop target shown when an element is in the drop target area  */}
        <DropTargetPath
          ref={pathRef}
          {...pathProps}
          strokeWidth="48"
          active={activeDropTargetId === element.id}
        />
      </DropTargetSVG>
    </>
  );
}

WithDropTarget.propTypes = {
  element: StoryPropTypes.element,
  children: PropTypes.node.isRequired,
  hover: PropTypes.bool,
};

export default function WithMask({
  element,
  fill,
  style,
  children,
  eventHandlers = null,
  ...rest
}) {
  const [hover, setHover] = useState(false);
  const { isBackground } = element;
  const { flip } = rest;

  const mask = getElementMask(element);
  const flipStyle = flip ? { transform: getTransformFlip(flip) } : null;
  if (!mask?.type || (isBackground && mask.type !== MaskTypes.RECTANGLE)) {
    return (
      <div
        style={{
          ...(fill ? FILL_STYLE : {}),
          ...style,
          ...flipStyle,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  }

  // @todo: Chrome cannot do inline clip-path using data: URLs.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=1041024.

  const maskId = `mask-${mask.type}-${element.id}-frame`;

  return (
    <div
      style={{
        ...(fill ? FILL_STYLE : {}),
        ...style,
        ...flipStyle,
        ...(!isBackground ? { clipPath: `url(#${maskId})` } : {}),
      }}
      {...rest}
      {...eventHandlers}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
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
      <Filler
        viewBox={`0 0 1 ${1 / mask.ratio}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        <FillerPath fill="none" d={mask?.path} />
      </Filler>
      <WithDropTarget element={element} hover={hover}>
        {children}
      </WithDropTarget>
    </div>
  );
}

WithMask.propTypes = {
  element: StoryPropTypes.element.isRequired,
  style: PropTypes.object,
  fill: PropTypes.bool,
  eventHandlers: PropTypes.object,
  children: PropTypes.node.isRequired,
};
