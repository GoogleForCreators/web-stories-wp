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
import { forwardRef, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Tab } from '../tab';

const StyledTabGroup = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;

  & > button {
    margin: 0 4px;
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

export const TabGroup = forwardRef(function TabGroup(
  {
    getTabId = (id) => id,
    getAriaControlsId,
    tabs,
    label,
    handleTabClicked,
    activeTabId,
  },
  ref
) {
  const tabRefs = useRef({});

  return (
    <StyledTabGroup ref={ref} aria-label={label} role="tablist">
      {tabs.map(({ id, title, ...rest }) => {
        const isActive = activeTabId === id;
        return (
          <Tab
            key={uuidv4()}
            ref={(tabRef) => (tabRefs.current[id] = tabRef)}
            id={getTabId(id)}
            isActive={isActive}
            aria-controls={
              getAriaControlsId ? getAriaControlsId(id) : getTabId(id)
            }
            aria-selected={isActive}
            onClick={(e) => handleTabClicked(e, id, tabRefs)}
            {...rest}
          >
            {title}
          </Tab>
        );
      })}
    </StyledTabGroup>
  );
});

TabGroup.propTypes = {
  activeTabId: PropTypes.string,
  getTabId: PropTypes.func,
  getAriaControlsId: PropTypes.func,
  handleTabClicked: PropTypes.func,
  tabs: PropTypes.arrayOf({
    title: PropTypes.string,
    id: PropTypes.string.isRequired,
  }),
  label: PropTypes.string,
};
