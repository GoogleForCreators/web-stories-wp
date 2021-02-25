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
  useContext,
  Icons,
  THEME_CONSTANTS,
  Headline,
} from '../../../../../design-system';
import { KEYBOARD_USER_SELECTOR } from '../../../../utils/keyboardOnlyOutline';
import DragHandle from './handle';

const Header = styled.h2.attrs({ role: 'button' })`
  background-color: ${({ theme }) => theme.colors.bg.secondary};
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

const Heading = styled(Headline)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  line-height: 32px;
  font-weight: 700;
  font-size: 16px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

// -12px margin-left comes from 16px panel padding - 4px that it actually should be.
// Since the svg-s are 32px and have extra room around, this needs to be removed
const Collapse = styled.button`
  border: none;
  background: transparent;
  color: inherit;
  height: 32px;
  display: flex; /* removes implicit line-height padding from child element */
  padding: 0 4px 0 0;
  cursor: pointer;
  svg {
    width: 32px;
    height: 32px;
  }
  margin-left: -12px;
  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: ${({ theme }) => theme.colors.border.focus} auto 2px;
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
      <Toggle
        toggle={toggle}
        disabled={!canCollapse}
        tabIndex={ariaHidden ? -1 : 0}
      >
        {canCollapse && toggleIcon}
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
