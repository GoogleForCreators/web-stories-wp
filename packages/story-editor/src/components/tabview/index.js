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
import { useRef, useCallback, forwardRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import {
  useKeyDownEffect,
  useGlobalKeyDownEffect,
  Headline,
  THEME_CONSTANTS,
  themeHelpers,
  ThemeGlobals,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app';
import Tooltip from '../tooltip';
import usePerformanceTracking from '../../utils/usePerformanceTracking';
import { TRACKING_EVENTS } from '../../constants';

const ALERT_ICON_SIZE = 28;
export const TAB_HEIGHT = 32;
export const TAB_VERTICAL_MARGIN = 10;

const Tabs = styled.ul.attrs({
  role: 'tablist',
  'aria-orientation': 'horizontal',
})`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  max-width: 100%;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  list-style: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.secondary};
`;

const TabElement = styled.li.attrs(({ isActive }) => ({
  tabIndex: isActive ? 0 : -1,
  role: 'tab',
  'aria-selected': isActive,
}))`
  cursor: pointer;
  border: none;
  background: none;
  padding: 0 4px;
  margin: ${TAB_VERTICAL_MARGIN}px 12px 9px;
  height: ${TAB_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: color 0.2s ease;
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.fg.primary : theme.colors.fg.tertiary};

  border-radius: ${({ theme }) => theme.borders.radius.small};
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};

  :hover {
    color: ${({ theme }) => theme.colors.fg.primary};
  }

  ${({ isActive, theme }) =>
    isActive &&
    css`
      ::after {
        content: '';
        position: absolute;
        background-color: ${theme.colors.border.selection};
        height: 2px;
        border-radius: 1px;
        bottom: -10px;
        left: 4px;
        right: 4px;
      }
    `}

  svg {
    display: block;
    width: 32px;
    height: 32px;
    margin: 0 -4px;
    transform-origin: center center;
    transition: transform 0.3s ease, color 0.2s ease;
    color: ${({ theme }) => theme.colors.fg.tertiary};
    border-radius: ${({ theme }) => theme.borders.radius.small};
    pointer-events: none;
  }

  svg.alert {
    width: ${ALERT_ICON_SIZE}px;
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.fg.primary};
  }

  span,
  svg:not(.alert) {
    ${({ isActive, theme }) => isActive && `color: ${theme.colors.fg.primary}`};
  }

  &:hover span,
  &:hover svg:not(.alert),
  &:active span,
  &:active svg:not(.alert) {
    color: ${({ theme }) => theme.colors.fg.primary};
  }

  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR}, &[data-focus-visible-added] {
    svg:not(.alert) {
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.tertiaryHover};
    }
  }
`;

const TabText = styled(Headline).attrs({
  as: 'p',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XXX_SMALL,
})`
  color: inherit;
`;

const noop = () => {};

function UnreffedTab(
  { children, tooltip = null, placement, refId, tabRefs, ...rest },
  ref
) {
  const { id } = rest;
  const eventData = id.includes('library')
    ? TRACKING_EVENTS.LIBRARY_PANEL_CLICK
    : TRACKING_EVENTS.DESIGN_PANEL_CLICK;
  usePerformanceTracking({
    node: tabRefs?.[refId]?.current,
    eventData: {
      ...eventData,
      label: `${refId}_tab`,
    },
  });
  const tab = (
    <TabElement ref={ref} {...rest}>
      {children}
    </TabElement>
  );
  if (tooltip !== null) {
    return (
      <Tooltip title={tooltip} placement={placement} isDelayed>
        {tab}
      </Tooltip>
    );
  }
  return tab;
}

const Tab = forwardRef(UnreffedTab);

UnreffedTab.propTypes = {
  children: PropTypes.node,
  tooltip: PropTypes.string,
  placement: PropTypes.string,
  refId: PropTypes.string,
  tabRefs: PropTypes.object,
};

function TabView({
  getTabId = (id) => id,
  getAriaControlsId,
  onTabChange = noop,
  onTabRefUpdated = noop,
  tabs = [],
  label = '',
  shortcut = '',
  tab,
  tabRefs,
  ...rest
}) {
  const { isRTL } = useConfig();

  const ref = useRef();
  const focused = useRef();
  const internalTabRefs = useRef({}); // fallback if tabRefs aren't passed in

  const focusChanged = useCallback(
    (id) => {
      if (tabRefs?.[id]?.current) {
        tabRefs[id].current?.focus();
      } else if (internalTabRefs?.current[id]) {
        internalTabRefs.current[id]?.focus();
      }
      focused.current = id;
    },
    [tabRefs]
  );

  const selectTab = useCallback(
    (id) => {
      focusChanged(id);
      onTabChange(id);
    },
    [focusChanged, onTabChange]
  );

  useGlobalKeyDownEffect(
    { key: shortcut, editable: true },
    () => selectTab(tab),
    [selectTab, tab]
  );

  const focusTabByIndex = useCallback(
    (index) => {
      // Index wraps, so -1 is last element
      const nextTab = tabs[(index + tabs.length) % tabs.length];
      focusChanged(nextTab.id);
    },
    [tabs, focusChanged]
  );

  const handleNavigation = useCallback(
    (direction) => {
      const directionWithRTL = isRTL ? -direction : direction;
      const currentIndex = tabs.findIndex(({ id }) => id === focused.current);
      focusTabByIndex(currentIndex + directionWithRTL);
    },
    [isRTL, tabs, focusTabByIndex]
  );

  // Left-right keys navigate to next tab
  useKeyDownEffect(ref, 'left', () => handleNavigation(-1), [handleNavigation]);
  useKeyDownEffect(ref, 'right', () => handleNavigation(1), [handleNavigation]);

  // Empty up/down handlers for consistency with left/right.
  useKeyDownEffect(ref, ['up', 'down'], () => {}, []);

  // Home/end keys navigate to first/last tab regardless of direction
  useKeyDownEffect(ref, 'home', () => focusTabByIndex(0), [focusTabByIndex]);
  useKeyDownEffect(ref, 'end', () => focusTabByIndex(-1), [focusTabByIndex]);

  // Enter/space to select currently focused tab.
  useKeyDownEffect(
    ref,
    { key: ['enter', 'space'], allowDefault: true },
    (evt) => {
      if (evt.target.getAttribute('role') === 'tab') {
        selectTab(focused.current);
        evt.preventDefault();
      }
    },
    [selectTab],
    {}
  );

  return (
    <Tabs aria-label={label} ref={ref} {...rest}>
      {tabs.map(({ id, title, icon: Icon, ...tabRest }) => (
        <Tab
          key={id}
          ref={(node) => {
            if (tabRefs?.[id]) {
              tabRefs[id].current = node;
            } else {
              internalTabRefs.current[id] = node;
            }
            onTabRefUpdated(node, id);
          }}
          id={getTabId(id)}
          isActive={tab === id}
          aria-controls={getAriaControlsId ? getAriaControlsId(id) : null}
          aria-selected={tab === id}
          onClick={() => selectTab(id)}
          onFocus={() => {
            focused.current = tab;
          }}
          refId={id}
          tabRefs={tabRefs}
          {...tabRest}
        >
          {Boolean(title) && <TabText>{title}</TabText>}
          {Boolean(Icon) && <Icon isActive={id === tab} />}
        </Tab>
      ))}
    </Tabs>
  );
}

TabView.propTypes = {
  getTabId: PropTypes.func,
  getAriaControlsId: PropTypes.func,
  onTabChange: PropTypes.func,
  onTabRefUpdated: PropTypes.func,
  tabs: PropTypes.array.isRequired,
  tab: PropTypes.string.isRequired,
  tabRefs: PropTypes.objectOf(
    PropTypes.shape({
      current: globalThis.Element
        ? PropTypes.instanceOf(Element) // eslint-disable-line ssr-friendly/no-dom-globals-in-module-scope -- Used conditionally
        : PropTypes.any,
    }) // To handle SSR
  ),
  label: PropTypes.string,
  shortcut: PropTypes.string,
};

export default TabView;
