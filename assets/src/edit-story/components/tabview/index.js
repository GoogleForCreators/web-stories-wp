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
import { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  useKeyDownEffect,
  useGlobalKeyDownEffect,
  Headline,
  THEME_CONSTANTS,
  themeHelpers,
  ThemeGlobals,
} from '../../../design-system';
import { useConfig } from '../../app';

const ALERT_ICON_SIZE = 28;

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

const Tab = styled.li.attrs(({ isActive }) => ({
  tabIndex: isActive ? 0 : -1,
  role: 'tab',
  'aria-selected': isActive,
}))`
  cursor: pointer;
  border: none;
  background: none;
  padding: 0 4px;
  margin: 10px 12px 9px;
  height: 32px;
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

function TabView({
  getTabId = (id) => id,
  getAriaControlsId,
  onTabChange = noop,
  tabs = [],
  label = '',
  shortcut = '',
  initialTab,
  ...rest
}) {
  const [tab, setTab] = useState(initialTab || tabs[0]?.id);
  const { isRTL } = useConfig();

  const ref = useRef();
  const tabRefs = useRef({});

  const tabChanged = useCallback(
    (id) => {
      setTab(id);
      if (tabRefs.current[id]) {
        tabRefs.current[id].focus();
      }
      onTabChange(id);
    },
    [setTab, onTabChange]
  );

  useEffect(() => {
    if (initialTab) {
      setTab(initialTab);
    }
  }, [initialTab]);

  useGlobalKeyDownEffect(
    { key: shortcut, editable: true },
    () => tabChanged(tab),
    [tabChanged, tab]
  );

  const selectTabByIndex = useCallback(
    (index) => {
      // Index wraps, so -1 is last element
      const nextTab = tabs[(index + tabs.length) % tabs.length];
      tabChanged(nextTab.id);
    },
    [tabs, tabChanged]
  );

  const handleNavigation = useCallback(
    (direction) => {
      const directionWithRTL = isRTL ? -direction : direction;
      const currentIndex = tabs.findIndex(({ id }) => id === tab);
      selectTabByIndex(currentIndex + directionWithRTL);
    },
    [isRTL, tab, tabs, selectTabByIndex]
  );

  // Left-right keys navigate to next tab
  useKeyDownEffect(ref, 'left', () => handleNavigation(-1), [handleNavigation]);
  useKeyDownEffect(ref, 'right', () => handleNavigation(1), [handleNavigation]);

  // Empty up/down handlers for consistency with left/right.
  useKeyDownEffect(ref, ['up', 'down'], () => {}, []);

  // Home/end keys navigate to first/last tab regardless of direction
  useKeyDownEffect(ref, 'home', () => selectTabByIndex(0), [selectTabByIndex]);
  useKeyDownEffect(ref, 'end', () => selectTabByIndex(-1), [selectTabByIndex]);

  return (
    <Tabs aria-label={label} ref={ref} {...rest}>
      {tabs.map(({ id, title, icon: Icon }) => (
        <Tab
          key={id}
          ref={(tabRef) => (tabRefs.current[id] = tabRef)}
          id={getTabId(id)}
          isActive={tab === id}
          aria-controls={getAriaControlsId ? getAriaControlsId(id) : null}
          aria-selected={tab === id}
          onClick={() => tabChanged(id)}
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
  tabs: PropTypes.array.isRequired,
  initialTab: PropTypes.any,
  label: PropTypes.string,
  shortcut: PropTypes.string,
};

export default TabView;
