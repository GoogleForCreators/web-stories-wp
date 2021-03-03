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
import { useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import {
  useKeyDownEffect,
  useGlobalKeyDownEffect,
} from '../../../design-system';
import { useConfig } from '../../app';

const ALERT_ICON_SIZE = 32;

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
  text-align: center;
  cursor: pointer;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.fg.tertiary};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.tab.family};
  font-size: ${({ theme }) => theme.DEPRECATED_THEME.fonts.tab.size};
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.fonts.tab.weight};
  padding: 10px 0px;
  margin: 0 20px;
  margin-bottom: -1px;
  position: relative;

  ${({ isActive, theme }) =>
    isActive &&
    `
    padding-bottom: 8px;
    border-bottom: 2px solid ${theme.colors.fg.primary};
  `}

  svg {
    display: block;
    width: 32px;
    height: 32px;
    margin: 0 -4px;
    transform-origin: center center;
    transition: transform 0.3s ease;
    color: ${({ theme }) => theme.colors.fg.tertiary};
  }

  svg.alert {
    width: ${ALERT_ICON_SIZE}px;
    height: auto;
    position: absolute;
    left: 100%;
    top: calc(
      50% - ${({ isActive }) => ALERT_ICON_SIZE / 2 + 2 - (isActive ? 1 : 0)}px
    );
    overflow: visible;
    opacity: 1;
    &.warning {
      color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.warning};
    }
    &.error {
      color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.negative};
    }
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
      const nextTab = tabs[index < 0 ? tabs.length + index : index];
      if (!nextTab) {
        return;
      }
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
    <Tabs aria-label={label} ref={ref}>
      {tabs.map(({ id, title, icon: Icon }) => (
        <Tab
          key={id}
          ref={(tabRef) => (tabRefs.current[id] = tabRef)}
          id={getTabId(id)}
          isActive={tab === id}
          aria-controls={
            getAriaControlsId ? getAriaControlsId(id) : getTabId(id)
          }
          aria-selected={tab === id}
          onClick={() => tabChanged(id)}
        >
          {Boolean(title) && <span>{title}</span>}
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
