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
import { sprintf, __ } from '@googleforcreators/i18n';
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  memo,
  useCombinedRefs,
  useEffect,
} from '@googleforcreators/react';
import { useUnits } from '@googleforcreators/units';
import { useTransformHandler } from '@googleforcreators/transform';
import PropTypes from 'prop-types';
import {
  getDefinitionForType,
  getLayerName,
} from '@googleforcreators/elements';
import {
  elementWithPosition,
  elementWithSize,
  elementWithRotation,
} from '@googleforcreators/element-library';
import { FrameWithMask as WithMask } from '@googleforcreators/masks';
import {
  useKeyDownEffect,
  useLiveRegion,
  prettifyShortcut,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import {
  useStory,
  useTransform,
  useCanvas,
  useConfig,
  useDropTargets,
} from '../../app';
import WithLink from '../elementLink/frame';
import useDoubleClick from '../../utils/useDoubleClick';
import usePerformanceTracking from '../../utils/usePerformanceTracking';
import { TRACKING_EVENTS } from '../../constants';
import {
  FOCUS_GROUPS,
  useFocusGroupRef,
  useEditLayerFocusManager,
} from './editLayerFocusManager';

// @todo: should the frame borders follow clip lines?

// Pointer events are disabled in the display mode to ensure that selection
// can be limited to the mask.
const Wrapper = styled.div`
  ${elementWithPosition}
  ${elementWithSize}
  ${elementWithRotation}
  outline: 1px solid transparent;
  transition: outline-color 0.5s;
  &:focus,
  &:active {
    outline-color: ${({ theme, hasMask }) =>
    hasMask ? 'transparent' : theme.colors.border.selection};
  }
  ${({ isLocked, hasMask, theme }) =>
    !isLocked &&
    !hasMask &&
    `
    &:hover {
      outline-color: ${theme.colors.border.selection};
    }
  `}
  ${({ isClickable }) => !isClickable && `pointer-events: none;`}
`;

const EmptyFrame = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const NOOP = () => { };

function calcBoxWithBorder(box, element) {
  if (!element?.border) {
    return box;
  }

  // updates box to accommodate for border
  // see: https://github.com/GoogleForCreators/web-stories-wp/issues/5325

  const boxWithBorder = { ...box };
  const type = element?.type;

  let { top, left, bottom, right } = element.border;

  if (type && type == 'shape' && element?.mask?.type !== "rectangle") {
    top = top / 2;
    left = left / 2;
    bottom = bottom / 2;
    right = right / 2;
  }

  boxWithBorder.x = box.x - left;
  boxWithBorder.y = box.y - top;
  boxWithBorder.width = box.width + (right + left);
  boxWithBorder.height = box.height + (top + bottom);
  return boxWithBorder;
}

const FRAME_ELEMENT_MESSAGE = sprintf(
  /* translators: 1: Ctrl Key 2: Alt Key */
  __(
    'To exit the canvas area, press Escape. Press Tab to move to the next group or element. To enter floating menu, press %1$s %2$s p.',
    'web-stories'
  ),
  prettifyShortcut('ctrl'),
  prettifyShortcut('alt')
);

function FrameElement({ id }) {
  const speak = useLiveRegion();
  const { enterFocusGroup, setFocusGroupCleanup } = useEditLayerFocusManager(
    ({ enterFocusGroup, setFocusGroupCleanup }) => ({
      enterFocusGroup,
      setFocusGroupCleanup,
    })
  );
  const [isTransforming, setIsTransforming] = useState(false);
  const focusGroupRef = useFocusGroupRef(FOCUS_GROUPS.ELEMENT_SELECTION);

  const {
    setNodeForElement,
    handleSelectElement,
    isEditing,
    setEditingElement,
    setEditingElementWithState,
  } = useCanvas(({ state, actions }) => ({
    setNodeForElement: actions.setNodeForElement,
    handleSelectElement: actions.handleSelectElement,
    isEditing: state.isEditing,
    setEditingElement: actions.setEditingElement,
    setEditingElementWithState: actions.setEditingElementWithState,
  }));
  const { isSelected, isOnlySelectedElement, isActive, isBackground, element } =
    useStory(({ state }) => {
      const isSelected = state.selectedElementIds.includes(id);
      const isOnlySelectedElement =
        isSelected && state.selectedElementIds.length === 1;
      const isActive = isOnlySelectedElement && !isTransforming && !isEditing;

      return {
        isSelected,
        isBackground: state.currentPage?.elements[0].id === id,
        element: state.currentPage?.elements.find((el) => el.id === id),
        isOnlySelectedElement,
        isActive,
      };
    });
  const { type, flip, isLocked } = element;

  // Unlocked elements are always clickable,
  // locked elements are only clickable if selected
  const isClickable = !isLocked || isSelected;

  const { Frame, isMaskable, Controls } = getDefinitionForType(type);
  const elementRef = useRef();
  const combinedFocusGroupRef = useCombinedRefs(elementRef, focusGroupRef); // Only attach focus group ref to one element.
  const [hovering, setHovering] = useState(false);
  const { isRTL, styleConstants: { topOffset } = {} } = useConfig();

  const {
    draggingResource,
    activeDropTargetId,
    isDropSource,
    registerDropTarget,
    unregisterDropTarget,
  } = useDropTargets(
    ({
      state: { draggingResource, activeDropTargetId },
      actions: { isDropSource, registerDropTarget, unregisterDropTarget },
    }) => ({
      draggingResource,
      activeDropTargetId,
      isDropSource,
      registerDropTarget,
      unregisterDropTarget,
    })
  );

  const onPointerEnter = () => setHovering(true);
  const onPointerLeave = () => setHovering(false);

  const isAnythingTransforming = useTransform(
    ({ state }) => !isSelected && hovering && !state.isAnythingTransforming
  );
  const isLinkActive = isAnythingTransforming && !isLocked;

  const getBox = useUnits(({ actions }) => actions.getBox);

  useLayoutEffect(() => {
    setNodeForElement(id, elementRef.current);
  }, [id, setNodeForElement]);
  const box = calcBoxWithBorder(getBox(element), element);

  useTransformHandler(id, (transform) => {
    const target = elementRef.current;
    if (transform?.dropTargets?.hover !== undefined) {
      target.style.opacity = transform.dropTargets.hover ? 0 : 1;
    }
    setIsTransforming(transform !== null);
  });

  // Media needs separate handler for double click.
  const { isMedia } = getDefinitionForType(type);
  const handleMediaDoubleClick = useCallback(
    (evt) => {
      if (!isSelected) {
        handleSelectElement(id, evt);
      }
      setEditingElement(id);
    },
    [id, setEditingElement, handleSelectElement, isSelected]
  );
  const handleMediaClick = useDoubleClick(NOOP, handleMediaDoubleClick);

  /**
   * Announce keyboard options on element.
   *
   * Using a live region because an `aria-label` would remove
   * any labels/content that would be read from children.
   */
  const handleFocus = useCallback(
    (evt) => {
      if (!isSelected) {
        handleSelectElement(id, evt);
      }

      // no floating menu on background, so no need to announce
      // possible floating menu keyboard navigation commands
      if (isBackground) {
        return;
      }
      speak(FRAME_ELEMENT_MESSAGE);
    },
    [handleSelectElement, id, isBackground, isSelected, speak]
  );

  const handleMouseDown = useCallback(
    (evt) => {
      if (!isSelected) {
        handleSelectElement(id, evt);
      }

      elementRef.current.focus({ preventScroll: true });

      if (!isBackground) {
        evt.stopPropagation();
      }
    },
    [handleSelectElement, id, isBackground, isSelected]
  );

  usePerformanceTracking({
    node: elementRef.current,
    eventData: {
      ...TRACKING_EVENTS.SELECT_ELEMENT,
      label: element.type,
    },
    eventType: 'pointerdown',
  });

  useKeyDownEffect(
    elementRef,
    { key: ['ctrl+alt+p'] },
    () => {
      enterFocusGroup({
        groupId: FOCUS_GROUPS.EDIT_ELEMENT,
      });
    },
    [enterFocusGroup]
  );

  useEffect(() => {
    if (isSelected) {
      setFocusGroupCleanup({
        groupId: FOCUS_GROUPS.EDIT_ELEMENT,
        cleanup: () => elementRef.current?.focus(),
      });
    }
  }, [setFocusGroupCleanup, isSelected]);

  const layerName = getLayerName(element);
  const elementLabel = element.isLocked
    ? sprintf(
      // translators: %s: Name of element
      __('Locked element: %s', 'web-stories'),
      layerName
    )
    : sprintf(
      // translators: %s: Name of element
      __('Element: %s', 'web-stories'),
      layerName
    );

  return (
    <WithLink element={element} active={isLinkActive} anchorRef={elementRef}>
      {Controls && (
        <Controls
          isTransforming={isTransforming}
          box={box}
          elementRef={elementRef}
          element={element}
          isRTL={isRTL}
          topOffset={topOffset}
          isActive={isActive}
        />
      )}
      {/* eslint-disable-next-line styled-components-a11y/click-events-have-key-events -- False positive */}
      <Wrapper
        ref={combinedFocusGroupRef}
        data-element-id={id}
        {...box}
        tabIndex={-1}
        role="button"
        aria-label={elementLabel}
        hasMask={isMaskable}
        isClickable={isClickable}
        data-testid="frameElement"
        onMouseDown={handleMouseDown}
        onFocus={handleFocus}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onClick={isMedia ? handleMediaClick(id) : null}
      >
        <WithMask
          element={element}
          fill
          flip={flip}
          draggingResource={draggingResource}
          activeDropTargetId={activeDropTargetId}
          isDropSource={isDropSource}
          registerDropTarget={registerDropTarget}
          unregisterDropTarget={unregisterDropTarget}
          isSelected={isSelected}
        >
          {Frame ? (
            <Frame
              wrapperRef={elementRef}
              element={element}
              box={box}
              isOnlySelectedElement={isOnlySelectedElement}
              setEditingElementWithState={setEditingElementWithState}
            />
          ) : (
            <EmptyFrame />
          )}
        </WithMask>
      </Wrapper>
    </WithLink>
  );
}

FrameElement.propTypes = {
  id: PropTypes.string.isRequired,
};

export default memo(FrameElement);
