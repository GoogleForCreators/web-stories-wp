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
import { useState, useCallback, useEffect, useMemo } from 'react';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import localStore, { LOCAL_STORAGE_PREFIX } from '../../../utils/localStore';
import { useStory } from '../../../app/story';
import panelContext from './context';

export const PANEL_COLLAPSED_THRESHOLD = 10;

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
  resizeable = false,
  canCollapse = true,
  collapsedByDefault = true,
  initialHeight = null,
  ariaLabel = null,
  ariaHidden = false,
  isPersistable = true,
  isToggleDisabled,
  ...rest
}) {
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
    // If toggle is disabled, always default to collapsed
    if (isToggleDisabled) {
      return true;
    }
    // If not persisted, always default to expanded.
    if (!isPersistable) {
      return false;
    }
    // If isCollapsed is not defined, return the default value.
    return persisted?.isCollapsed ?? collapsedByDefault;
  });
  const [expandToHeight, setExpandToHeight] = useState(
    persisted?.expandToHeight || initialHeight
  );
  const [height, setHeight] = useState(persisted?.height || initialHeight);
  const [hasTitle, setHasTitle] = useState(false);
  const [manuallyChanged, setManuallyChanged] = useState(false);

  const confirmTitle = useCallback(() => setHasTitle(true), []);

  const collapse = useCallback(() => {
    if (!canCollapse) {
      return;
    }
    setIsCollapsed(true);
    setManuallyChanged(true);
    if (resizeable) {
      setHeight(0);
    }

    trackEvent('panel_toggled', {
      name: name,
      status: 'collapsed',
    });
  }, [resizeable, canCollapse, name]);

  const expand = useCallback(
    (restoreHeight = true) => {
      setIsCollapsed(false);
      setManuallyChanged(true);
      if (restoreHeight && resizeable) {
        setHeight(expandToHeight);
      }

      trackEvent('panel_toggled', {
        name: name,
        status: 'expanded',
      });
    },
    [resizeable, expandToHeight, name]
  );

  // Expand panel on first mount/on selection change if it can't be persisted.
  useEffect(() => {
    if (!isPersistable) {
      expand(true);
    }
  }, [expand, isPersistable, selectedElementIds]);

  useEffect(() => {
    if (resizeable && height <= PANEL_COLLAPSED_THRESHOLD && !isCollapsed) {
      collapse();
    }
  }, [collapse, height, resizeable, isCollapsed]);

  useEffect(() => {
    if (manuallyChanged || persisted || !resizeable) {
      return;
    }
    setHeight(initialHeight);
    setExpandToHeight(initialHeight);
  }, [manuallyChanged, initialHeight, resizeable, persisted]);

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
      if (!resizeable) {
        return;
      }
      setManuallyChanged(true);
      setHeight(h);
      if (isCollapsed && h(height) > PANEL_COLLAPSED_THRESHOLD) {
        expand(false);
      }
    },
    [setManuallyChanged, setHeight, height, expand, resizeable, isCollapsed]
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
      resizeable,
      isCollapsed,
      panelContentId,
      panelTitleId,
      panelTitleReadable,
      ariaHidden,
    },
    actions: {
      setHeight: manuallySetHeight,
      setExpandToHeight,
      collapse,
      expand,
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
  isToggleDisabled: PropTypes.bool,
  resizeable: PropTypes.bool,
  canCollapse: PropTypes.bool,
  collapsedByDefault: PropTypes.bool,
  ariaLabel: PropTypes.string,
  ariaHidden: PropTypes.bool,
  isPersistable: PropTypes.bool,
};

export default Panel;
