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
import { useCallback, useEffect } from 'react';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import useInspector from '../../../inspector/useInspector';
import panelContext from '../context';
import { Arrow } from '../../../../icons';
import { PANEL_COLLAPSED_THRESHOLD } from '../panel';
import { useContext } from '../../../../../design-system';
import DragHandle from './handle';

function getBackgroundColor(isPrimary, isSecondary, theme) {
  if (isPrimary) {
    return rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.07);
  }
  if (isSecondary) {
    return theme.colors.bg.tertiary;
  }
  return 'transparent';
}

const Header = styled.h2.attrs({ role: 'button' })`
  background-color: ${({ isPrimary, isSecondary, theme }) =>
    getBackgroundColor(isPrimary, isSecondary, theme)};
  border: 0 solid
    ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.gray16, 0.6)};
  border-top-width: ${({ isPrimary, isSecondary }) =>
    isPrimary || isSecondary ? 0 : '1px'};
  color: ${({ theme }) => theme.colors.fg.secondary};
  ${({ hasResizeHandle }) => hasResizeHandle && 'padding-top: 0;'}
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: row;
  user-select: none;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  cursor: pointer;
`;

const Heading = styled.span`
  color: inherit;
  margin: 0;
  font-weight: 500;
  font-size: 14px;
  line-height: 19px;
  width: 100%;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const Collapse = styled.button`
  border: none;
  background: transparent;
  color: inherit;
  width: 28px;
  height: 28px;
  display: flex; /* removes implicit line-height padding from child element */
  padding: 0;
  cursor: pointer;
  svg {
    width: 28px;
    height: 28px;
    ${({ isCollapsed }) => isCollapsed && `transform: rotate(.5turn);`}
  }
`;

function Toggle({ children, toggle, ...rest }) {
  return (
    <Collapse
      onClick={(evt) => {
        evt.stopPropagation();
        toggle();
      }}
      {...rest}
    >
      {children}
    </Collapse>
  );
}

Toggle.propTypes = {
  children: PropTypes.node.isRequired,
  toggle: PropTypes.func.isRequired,
};

function Title({
  ariaLabel,
  children,
  isPrimary,
  isSecondary,
  secondaryAction,
  isResizable,
  canCollapse,
}) {
  const {
    state: {
      isCollapsed,
      height,
      resizeable,
      panelContentId,
      panelTitleId,
      ariaHidden,
    },
    actions: {
      collapse,
      expand,
      setHeight,
      setExpandToHeight,
      resetHeight,
      confirmTitle,
    },
  } = useContext(panelContext);
  const {
    state: { inspectorContentHeight },
  } = useInspector();

  useEffect(confirmTitle, [confirmTitle]);

  // Max panel height is set to 70% of full available height.
  const maxHeight = Math.round(inspectorContentHeight * 0.7);

  const handleHeightChange = useCallback(
    (deltaHeight) =>
      resizeable
        ? setHeight((value) =>
            Math.max(0, Math.min(maxHeight, value + deltaHeight))
          )
        : null,
    [resizeable, setHeight, maxHeight]
  );

  const handleExpandToHeightChange = useCallback(() => {
    if (resizeable && height >= PANEL_COLLAPSED_THRESHOLD) {
      setExpandToHeight(height);
    }
  }, [setExpandToHeight, height, resizeable]);

  const toggle = isCollapsed ? expand : collapse;

  return (
    <Header
      isPrimary={isPrimary}
      isSecondary={isSecondary}
      hasResizeHandle={isResizable && !isCollapsed}
      aria-label={ariaLabel}
      aria-expanded={!isCollapsed}
      aria-controls={panelContentId}
      onClick={toggle}
    >
      {isResizable && (
        <DragHandle
          height={height}
          minHeight={0}
          maxHeight={maxHeight}
          handleHeightChange={handleHeightChange}
          handleExpandToHeightChange={handleExpandToHeightChange}
          handleDoubleClick={resetHeight}
          tabIndex={ariaHidden ? -1 : 0}
        />
      )}
      <Heading id={panelTitleId}>{children}</Heading>
      <HeaderActions>
        {secondaryAction}
        {canCollapse && (
          <Toggle
            isCollapsed={isCollapsed}
            toggle={toggle}
            tabIndex={ariaHidden ? -1 : 0}
          >
            <Arrow />
          </Toggle>
        )}
      </HeaderActions>
    </Header>
  );
}

Title.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
  isPrimary: PropTypes.bool,
  isSecondary: PropTypes.bool,
  isResizable: PropTypes.bool,
  secondaryAction: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  canCollapse: PropTypes.bool,
};

Title.defaultProps = {
  isPrimary: false,
  isSecondary: false,
  isResizable: false,
  canCollapse: true,
};

export default Title;
