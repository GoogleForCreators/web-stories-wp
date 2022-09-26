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
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import {
  useState,
  useCallback,
  useEffect,
  useMemo,
} from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useStory } from '../../../app/story';
import panelContext from './context';

export const PANEL_COLLAPSED_THRESHOLD = 10;
export const MAX_HEIGHT_DEFAULT = 999999999;

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.tertiary};
  ${({ noBorder }) => noBorder && 'border-bottom: none;'}
`;

function Panel({
  name,
  children,
  resizable = false,
  showDragHandle,
  showFocusStyles,
  canCollapse = true,
  collapsedByDefault = true,
  initialHeight = null,
  maxHeight: _maxHeight = MAX_HEIGHT_DEFAULT,
  ariaLabel = null,
  ariaHidden = false,
  isPersistable = true,
  ...rest
}) {
  // If max height is 0 - fallback to default
  // Allows us to save persisted heights if layers aren't loaded yet
  const maxHeight = _maxHeight === 0 ? MAX_HEIGHT_DEFAULT : _maxHeight;
  const { selectedElementIds } = useStory(
    ({ state: { selectedElementIds } }) => {
      return {
        selectedElementIds,
      };
    }
  );

  const persisted = useMemo(
    () =>
      isPersistable
        ? localStore.getItemByKey(`${LOCAL_STORAGE_PREFIX.PANEL}:${name}`)
        : null,
    [name, isPersistable]
  );

  const [isCollapsed, setIsCollapsed] = useState(() => {
    // If not persisted, always default to expanded.
    if (!isPersistable) {
      return false;
    }
    // If isCollapsed is not defined, return the default value.
    return persisted?.isCollapsed ?? collapsedByDefault;
  });
  const [expandToHeight, _setExpandToHeight] = useState(
    Math.min(persisted?.expandToHeight, maxHeight) || initialHeight
  );
  const [height, _setHeight] = useState(
    Math.min(persisted?.height, maxHeight) || initialHeight
  );
  const [hasTitle, setHasTitle] = useState(false);
  const [manuallyChanged, setManuallyChanged] = useState(false);

  // When setting height, compare to maxHeight
  const setHeight = useCallback(
    (newHeight) => {
      _setHeight(Math.min(newHeight, maxHeight));
    },
    [maxHeight]
  );
  // When setting expand to height, compare to maxHeight
  const setExpandToHeight = useCallback(
    (newHeight) => {
      _setExpandToHeight(Math.min(newHeight, maxHeight));
    },
    [maxHeight]
  );

  const confirmTitle = useCallback(() => setHasTitle(true), []);

  const collapse = useCallback(() => {
    if (!canCollapse) {
      return;
    }
    setIsCollapsed(true);
    setManuallyChanged(true);
    if (resizable) {
      setHeight(0);
    }
  }, [resizable, canCollapse, setHeight]);

  const onCollapse = useCallback(() => {
    if (!canCollapse) {
      return;
    }

    collapse();

    trackEvent('panel_toggled', {
      name: name,
      status: 'collapsed',
    });
  }, [canCollapse, collapse, name]);

  const expand = useCallback(
    (restoreHeight = true) => {
      setIsCollapsed(false);
      setManuallyChanged(true);
      if (restoreHeight && resizable) {
        setHeight(expandToHeight);
      }
    },
    [resizable, expandToHeight, setHeight]
  );

  const onExpand = useCallback(
    (restoreHeight = true) => {
      expand(restoreHeight);

      trackEvent('panel_toggled', {
        name: name,
        status: 'expanded',
      });
    },
    [expand, name]
  );

  // Expand panel on first mount/on selection change if it can't be persisted.
  useEffect(() => {
    if (!isPersistable) {
      expand(true);
    }
  }, [expand, isPersistable, selectedElementIds]);

  // Collapse panel if height is lower than threshold
  useEffect(() => {
    if (resizable && height <= PANEL_COLLAPSED_THRESHOLD && !isCollapsed) {
      collapse();
    }
  }, [collapse, height, resizable, isCollapsed]);

  // Automatically set height of panel. Only happens when:
  // 1. `manuallyChanged` is false
  // 2. Nothing exists in local storage
  // 3. `resizable` is true
  useEffect(() => {
    if (manuallyChanged || persisted || !resizable) {
      return;
    }
    setHeight(initialHeight);
    setExpandToHeight(initialHeight);
  }, [
    manuallyChanged,
    initialHeight,
    resizable,
    persisted,
    name,
    setExpandToHeight,
    setHeight,
  ]);

  // Make sure panel height is constrained by maxHeight
  useEffect(() => {
    if (maxHeight < height) {
      setHeight(maxHeight);
    }
    if (maxHeight < expandToHeight) {
      setExpandToHeight(maxHeight);
    }
  }, [expandToHeight, height, maxHeight, setHeight, setExpandToHeight]);

  // Persist when user collapses
  useEffect(() => {
    if (!isPersistable || !manuallyChanged) {
      return;
    }

    // Persist only when after user interacts
    localStore.setItemByKey(`${LOCAL_STORAGE_PREFIX.PANEL}:${name}`, {
      height,
      isCollapsed,
      expandToHeight,
    });
  }, [
    name,
    isCollapsed,
    height,
    expandToHeight,
    manuallyChanged,
    isPersistable,
  ]);

  const manuallySetHeight = useCallback(
    (h) => {
      if (!resizable) {
        return;
      }
      setManuallyChanged(true);
      setHeight(Math.min(h(height), maxHeight));
      if (isCollapsed && h(height) > PANEL_COLLAPSED_THRESHOLD) {
        expand(false);
      }
    },
    [
      expand,
      height,
      isCollapsed,
      maxHeight,
      resizable,
      setHeight,
      setManuallyChanged,
    ]
  );

  const resetHeight = useCallback(() => {
    setManuallyChanged(false);
    if (isCollapsed) {
      expand(true);
    }
  }, [expand, isCollapsed]);

  const panelContentId = `panel-${name}-${uuidv4()}`;
  const panelTitleId = `panel-title-${name}-${uuidv4()}`;
  const panelTitleReadable = `panel-title-${name}`;

  const contextValue = {
    state: {
      height,
      resizable,
      showDragHandle,
      showFocusStyles,
      isCollapsed,
      panelContentId,
      panelTitleId,
      panelTitleReadable,
      ariaHidden,
    },
    actions: {
      setHeight: manuallySetHeight,
      setExpandToHeight,
      collapse: onCollapse,
      expand: onExpand,
      resetHeight,
      confirmTitle,
    },
  };

  const ContextProvider = panelContext.Provider;

  const wrapperProps = useMemo(
    () =>
      hasTitle
        ? { 'aria-labelledby': panelTitleId }
        : { 'aria-label': ariaLabel },
    [hasTitle, panelTitleId, ariaLabel]
  );

  return (
    <Wrapper {...wrapperProps} aria-hidden={ariaHidden} {...rest}>
      <ContextProvider value={contextValue}>{children}</ContextProvider>
    </Wrapper>
  );
}

Panel.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node,
  initialHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  resizable: PropTypes.bool,
  showDragHandle: PropTypes.bool,
  showFocusStyles: PropTypes.bool,
  canCollapse: PropTypes.bool,
  collapsedByDefault: PropTypes.bool,
  ariaLabel: PropTypes.string,
  ariaHidden: PropTypes.bool,
  isPersistable: PropTypes.bool,
};

export default Panel;
