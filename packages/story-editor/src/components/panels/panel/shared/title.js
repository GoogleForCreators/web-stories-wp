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
import PropTypes from 'prop-types';
import { useCallback, useEffect, useContext } from '@googleforcreators/react';
import {
  BUTTON_TRANSITION_TIMING,
  Icons,
  THEME_CONSTANTS,
  Headline,
  themeHelpers,
  ThemeGlobals,
  NotificationBubble,
  BUBBLE_VARIANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import useSidebar from '../../../sidebar/useSidebar';
import panelContext from '../context';
import { PANEL_COLLAPSED_THRESHOLD } from '../panel';
import { focusStyle } from '../../shared';
import DragHandle from './handle';

// If the header is collapsed, we're leaving 8px less padding to apply that from the content.
const Header = styled(Headline).attrs({
  as: 'h2',
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  background-color: ${({ isSecondary, theme }) =>
    isSecondary && theme.colors.interactiveBg.secondaryNormal};
  ${({ hasResizeHandle }) => hasResizeHandle && 'padding-top: 0;'}
  margin: 0;
  position: relative;
  display: flex;
  flex-direction: row;
  user-select: none;
  align-items: center;
  justify-content: space-between;
  padding: ${({ isCollapsed }) =>
    isCollapsed ? '14px 16px' : '14px 16px 6px 16px'};
`;

const Heading = styled.span`
  color: ${({ theme, isCollapsed }) =>
    isCollapsed ? theme.colors.fg.secondary : theme.colors.fg.primary};
  display: flex;
  align-items: space-between;
  ${({ theme }) =>
    themeHelpers.expandPresetStyles({
      preset:
        theme.typography.presets.headline[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL
        ],
      theme,
    })};
`;

const StyledNotificationBubble = styled(NotificationBubble)`
  margin-left: 12px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

// Keeps the space for the icon even if it's not displayed.
const IconWrapper = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  svg {
    position: relative;
    z-index: 1;
  }
`;

// -12px margin-left comes from 16px panel padding - 4px that it actually should be.
// Since the svg-s are 32px and have extra room around, this needs to be removed
const Collapse = styled.button`
  border: none;
  border-radius: ${({ theme }) => theme.borders.radius.small};
  background: transparent;
  color: ${({ theme, isCollapsed }) =>
    isCollapsed ? theme.colors.fg.secondary : theme.colors.fg.primary};
  height: 32px;
  display: flex; /* removes implicit line-height padding from child element */
  padding: 0 4px 0 0;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  margin-left: -12px;
  transition: ${BUTTON_TRANSITION_TIMING};
  &:hover,
  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR}, &[${ThemeGlobals.FOCUS_VISIBLE_DATA_ATTRIBUTE}] {
    color: ${({ theme }) => theme.colors.fg.primary};
  }

  ${focusStyle};

  svg {
    width: 32px;
    height: 32px;
    ${({ $isCollapsed, theme }) =>
      $isCollapsed &&
      css`
        color: ${theme.colors.fg.secondary};
        transform: rotate(-90deg);
      `};
  }

  :hover ${IconWrapper}:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 16px;
    width: 16px;
    border-radius: ${({ theme }) => theme.borders.radius.round};
    background: ${({ theme }) => theme.colors.bg.quaternary};
  }
`;

function Toggle({ children, isCollapsed, toggle, ...rest }) {
  return (
    <Collapse
      onClick={(evt) => {
        evt.stopPropagation();
        toggle();
      }}
      $isCollapsed={isCollapsed}
      {...rest}
    >
      {children}
    </Collapse>
  );
}

Toggle.propTypes = {
  children: PropTypes.node.isRequired,
  isCollapsed: PropTypes.bool,
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
  maxHeight: maxHeightOverride,
  count,
  ...props
}) {
  const {
    state: {
      isCollapsed,
      height,
      resizable,
      showDragHandle,
      showFocusStyles,
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
    state: { sidebarContentHeight },
  } = useSidebar();

  useEffect(confirmTitle, [confirmTitle]);

  // Default max panel height is set to 70% of full available height.
  const maxHeight = maxHeightOverride || Math.round(sidebarContentHeight * 0.7);

  const handleHeightChange = useCallback(
    (deltaHeight) =>
      resizable
        ? setHeight((value) =>
            Math.max(0, Math.min(maxHeight, value + deltaHeight))
          )
        : null,
    [resizable, setHeight, maxHeight]
  );

  const handleExpandToHeightChange = useCallback(() => {
    if (resizable && height >= PANEL_COLLAPSED_THRESHOLD) {
      setExpandToHeight(height);
    }
  }, [setExpandToHeight, height, resizable]);

  const toggle = isCollapsed ? expand : collapse;

  const hasCount = count === 0 || Boolean(count);

  return (
    <Header
      isPrimary={isPrimary}
      isSecondary={isSecondary}
      hasResizeHandle={isResizable && !isCollapsed}
      isCollapsed={isCollapsed}
      {...props}
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
          showDragHandle={showDragHandle}
          showFocusStyles={showFocusStyles}
        />
      )}
      <Toggle
        toggle={toggle}
        disabled={!canCollapse}
        tabIndex={ariaHidden ? -1 : 0}
        aria-label={ariaLabel}
        aria-expanded={!isCollapsed}
        aria-controls={panelContentId}
        isCollapsed={isCollapsed}
      >
        {canCollapse && (
          <IconWrapper>
            <Icons.ChevronDownSmall />
          </IconWrapper>
        )}
        <Heading
          isCollapsed={isCollapsed}
          id={panelTitleId}
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
        >
          {children}
        </Heading>
        {hasCount && (
          <StyledNotificationBubble
            data-testid="panel-badge"
            notificationCount={count}
            variant={BUBBLE_VARIANTS.PRIMARY}
            aria-hidden
          />
        )}
      </Toggle>
      {secondaryAction && <HeaderActions>{secondaryAction}</HeaderActions>}
    </Header>
  );
}

Title.propTypes = {
  ariaLabel: PropTypes.string,
  children: PropTypes.node,
  isPrimary: PropTypes.bool,
  isSecondary: PropTypes.bool,
  isResizable: PropTypes.bool,
  maxHeight: PropTypes.number,
  secondaryAction: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  canCollapse: PropTypes.bool,
  count: PropTypes.number,
};

Title.defaultProps = {
  isPrimary: false,
  isSecondary: false,
  isResizable: false,
  canCollapse: true,
};

export default Title;
