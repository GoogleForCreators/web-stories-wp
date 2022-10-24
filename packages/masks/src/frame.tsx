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
import styled, { css } from 'styled-components';
import {
  useRef,
  useEffect,
  useState,
  forwardRef,
} from '@googleforcreators/react';
import { getTransformFlip } from '@googleforcreators/elements';
import type { Flip, MediaElement, Resource } from '@googleforcreators/types';
import type { CSSProperties, SVGAttributes, ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import { MaskTypes } from './constants';
import { getElementMask, generateMaskId } from './masks';

const FILL_STYLE: CSSProperties = {
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

interface DropTargetSVGProps {
  active: boolean;
}

const DropTargetSVG = styled.svg<DropTargetSVGProps>`
  ${svgCss}
  z-index: ${({ active }) => (active ? 1 : -1)};
`;

const Filler = styled.svg`
  ${svgCss}
`;

interface FillerPathProps {
  isClickable: boolean;
}

const FillerPath = styled.path<FillerPathProps>`
  pointer-events: ${({ isClickable }) => (isClickable ? 'all' : 'none')};
`;

interface DropTargetPathProps {
  active?: boolean;
}

const DropTargetPath = styled.path<DropTargetPathProps>`
  transition: opacity 0.5s;
  pointer-events: visibleStroke;
  opacity: ${({ active }) => (active ? 0.3 : 0)};
  stroke: ${({ theme }) => theme.colors.border.selection};
`;

interface WrapperProps {
  hasBackgroundOutline: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  width: 100%;
  height: 100%;

  ::before {
    transition: opacity 0.5s;
    opacity: ${({ hasBackgroundOutline }) => (hasBackgroundOutline ? 1 : 0)};
    display: block;
    content: '';
    position: absolute;
    width: calc(100% + 8px);
    height: calc(100% + 8px);
    border-radius: 8px;
    left: -4px;
    top: -4px;
    border: 1px solid ${({ theme }) => theme.colors.border.selection};
  }
`;

interface WithDropTargetProps {
  element: MediaElement;
  children: JSX.Element;
  hover: boolean;
  draggingResource: Resource;
  activeDropTargetId: string;
  isDropSource: (type: string) => boolean;
  registerDropTarget: (id: string, pathRef: SVGPathElement | null) => void;
  unregisterDropTarget: (id: string) => void;
}

function WithDropTarget({
  element,
  children,
  hover,
  draggingResource,
  activeDropTargetId,
  isDropSource,
  registerDropTarget,
  unregisterDropTarget,
}: WithDropTargetProps): JSX.Element {
  const pathRef = useRef<SVGPathElement>(null);

  const { id, resource, isBackground, isLocked } = element;
  const mask = getElementMask(element);

  useEffect(() => {
    if (isLocked) {
      return undefined;
    }
    registerDropTarget(id, pathRef.current);
    return () => {
      unregisterDropTarget(id);
    };
  }, [id, isLocked, registerDropTarget, unregisterDropTarget]);

  if (!mask) {
    return children;
  }

  // Show an outline if hovering when not dragging
  // or if dragging another droppable element
  const canHasOutline =
    (hover && !draggingResource) ||
    (Boolean(draggingResource) &&
      isDropSource(draggingResource.type) &&
      draggingResource !== resource);

  const hasOutline = !isLocked && canHasOutline;

  const hasThinOutline = hasOutline && !isBackground;
  const hasBackgroundOutline = Boolean(hasOutline && isBackground);

  const pathProps: SVGAttributes<SVGPathElement> = {
    vectorEffect: 'non-scaling-stroke',
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    d: mask?.path,
  };

  return (
    <Wrapper hasBackgroundOutline={hasBackgroundOutline}>
      {children}
      <DropTargetSVG
        viewBox={`0 0 1 ${1 / (mask.ratio || 1)}`}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        // Fixes issue where the outline prevents double-clicks from
        // reaching the frame through zIndex
        active={activeDropTargetId === element.id}
      >
        {/** Suble indicator that the element is a drop target */}
        <DropTargetPath
          {...pathProps}
          strokeWidth="3"
          style={{ opacity: hasThinOutline ? 1 : 0 }}
        />
        {/** Drop target snap border when an element is in the drop target area */}
        <DropTargetPath ref={pathRef} strokeWidth="48" {...pathProps} />
      </DropTargetSVG>
    </Wrapper>
  );
}

interface WithMaskProps {
  element: MediaElement;
  style: CSSProperties;
  fill: boolean;
  flip: Flip;
  children: JSX.Element;
  draggingResource: Resource;
  activeDropTargetId: string;
  isDropSource: (type: string) => boolean;
  isSelected?: boolean;
  registerDropTarget: () => void;
  unregisterDropTarget: () => void;
}

const WithMask = forwardRef(
  (
    {
      element,
      fill,
      style,
      children,
      flip,
      draggingResource,
      activeDropTargetId,
      isDropSource,
      isSelected = false,
      registerDropTarget,
      unregisterDropTarget,
      ...rest
    }: WithMaskProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => {
    const [hover, setHover] = useState(false);
    const { isBackground, isLocked } = element;

    // Unlocked elements are always clickable,
    // locked elements are only clickable if selected
    const isClickable = !isLocked || isSelected;

    const dropTargets = {
      draggingResource,
      activeDropTargetId,
      isDropSource,
      registerDropTarget,
      unregisterDropTarget,
    };

    const mask = getElementMask(element);
    const flipStyle: CSSProperties = flip
      ? { transform: getTransformFlip(flip) || undefined }
      : {};
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
    const maskId = generateMaskId(element, 'frame');

    return (
      <div
        ref={ref}
        style={{
          ...(fill ? FILL_STYLE : {}),
          ...style,
          ...flipStyle,
          ...(!isBackground ? { clipPath: `url(#${maskId})` } : {}),
        }}
        {...rest}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <svg width={0} height={0}>
          <defs>
            <clipPath
              id={maskId}
              transform={`scale(1 ${mask.ratio || 1})`}
              clipPathUnits="objectBoundingBox"
            >
              <path d={mask.path} />
            </clipPath>
          </defs>
        </svg>
        <Filler
          viewBox={`0 0 1 ${1 / (mask.ratio || 1)}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <FillerPath isClickable={isClickable} fill="none" d={mask?.path} />
        </Filler>
        {isClickable ? (
          <WithDropTarget
            element={element}
            hover={hover}
            {...dropTargets}
            {...rest}
          >
            {children}
          </WithDropTarget>
        ) : (
          children
        )}
      </div>
    );
  }
);

export default WithMask;
