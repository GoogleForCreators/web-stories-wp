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

/**
 * Internal dependencies
 */
import useInspector from '../../../inspector/useInspector';
import panelContext from '../context';
import { PANEL_COLLAPSED_THRESHOLD } from '../panel';
import {
  BUTTON_TRANSITION_TIMING,
  useContext,
  Icons,
  THEME_CONSTANTS,
  Headline,
  themeHelpers,
  ThemeGlobals,
} from '../../../../../design-system';
import DragHandle from './handle';

// If the header is collapsed, we're leaving 8px less padding to apply that from the content.
const Header = styled.h2`
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
    isCollapsed ? '14px 20px' : '14px 20px 6px 20px'};
  cursor: pointer;
`;

const Heading = styled(Headline)`
  color: inherit;
  line-height: 32px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

// Keeps the space for the icon even if it's not displayed.
const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
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
  cursor: pointer;
  margin-left: -12px;
  transition: ${BUTTON_TRANSITION_TIMING};

  &:hover,
  &.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR}, &[${ThemeGlobals.FOCUS_VISIBLE_DATA_ATTRIBUTE}] {
    color: ${({ theme }) => theme.colors.fg.primary};
  }
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};

  svg {
    width: 32px;
    height: 32px;
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
  ...props
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

  const toggleIcon = isCollapsed ? (
    <Icons.ChevronRightSmall />
  ) : (
    <Icons.ChevronDownSmall />
  );
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
        <IconWrapper>{canCollapse && toggleIcon}</IconWrapper>
        <Heading
          id={panelTitleId}
          as="span"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.XX_SMALL}
        >
          {children}
        </Heading>
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
