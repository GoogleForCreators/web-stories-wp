/*
 * Copyright 2021 Google LLC
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
import PropTypes from 'prop-types';
import { useCallback, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { sprintf, __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Button } from '../button';
import { Link } from '../typography/link';
import { Text } from '../typography/text';
import { THEME_CONSTANTS } from '../../theme';
import { noop } from '../../utils';
import { Tooltip, TOOLTIP_PLACEMENT } from '../tooltip';
import { PLACEMENT } from '../popup';

const ItemText = styled(Text)`
  width: 200px;
  text-align: left;
`;
const Shortcut = styled(Text)`
  color: ${({ theme }) => theme.colors.border.disable};
`;

const IconWrapper = styled.span`
  width: 32px;
  height: 32px;
`;

export const MenuItem = ({
  ariaLabel,
  disabled,
  href,
  label,
  newTab,
  onClick,
  onDismiss = noop,
  onFocus,
  shortcut,
  Icon,
  tooltipPlacement = TOOLTIP_PLACEMENT.RIGHT,
  ...menuItemProps
}) => {
  const itemRef = useRef(null);
  /**
   * Close the menu after clicking.
   */
  const handleClick = useCallback(
    (ev) => {
      onClick(ev);
      onDismiss();
    },
    [onClick, onDismiss]
  );

  const itemLabel = shortcut?.title
    ? sprintf(
        /* translators: 1: Menu Item Text Label. 2: Keyboard shortcut value. */
        __('%1$s, or use %2$s on a keyboard', 'web-stories'),
        ariaLabel || label,
        shortcut.title
      )
    : ariaLabel || label;

  const textContent = useMemo(() => {
    if (Icon) {
      return (
        <Tooltip placement={tooltipPlacement} title={label}>
          <IconWrapper>
            <Icon />
          </IconWrapper>
        </Tooltip>
      );
    }
    return (
      <>
        <ItemText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          forwardedAs="span"
        >
          {label}
        </ItemText>
        {shortcut?.display && (
          <Shortcut
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            forwardedAs="kbd"
          >
            {shortcut?.display}
          </Shortcut>
        )}
      </>
    );
  }, [Icon, label, shortcut, tooltipPlacement]);

  if (href) {
    const newTabProps = newTab
      ? {
          target: '_blank',
          rel: 'noreferrer',
        }
      : {};

    return (
      <Link
        ref={itemRef}
        aria-label={itemLabel}
        href={href}
        onClick={handleClick}
        onFocus={onFocus}
        {...newTabProps}
        {...menuItemProps}
      >
        {textContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <Button
        ref={itemRef}
        aria-label={itemLabel}
        disabled={disabled}
        onClick={handleClick}
        onFocus={onFocus}
        {...menuItemProps}
      >
        {textContent}
      </Button>
    );
  }

  return <div {...menuItemProps}>{textContent}</div>;
};

/**
 * Custom propTypes validator. Used to check that:
 * 1. Only one of [`onClick`, `href`] can be passed to a `MenuItem`
 * 2. Only one of ['href', 'disabled'] can be passed to a `MenuItem`
 *
 * This also checks that [`onClick`, `href`] are of the correct type.
 *
 * @param {Object} props the props supplied to the component.
 * @param {string} _ the name of the prop.
 * @param {string} componentName the name of the component.
 * @return {Error|null} Returns an error if the conditions have not been met.
 * Otherwise, returns null.
 */
export const linkOrButtonValidator = function (props, _, componentName) {
  if (props.href && props.disabled !== undefined) {
    return new Error(
      `A link cannot be disabled. \`disabled\` will be ignored. Validation failed.`
    );
  }

  if (typeof props.href !== 'string' && props.newTab) {
    return new Error(
      `Cannot open a new tab without specifying an \`href\`. \`newTab\` will be ignored. Validation failed.`
    );
  }

  /**
   * Leverage PropTypes typechecking instead of
   * writing our own validators for `string` and `function`
   */
  PropTypes.checkPropTypes(
    {
      href: PropTypes.string,
    },
    props,
    _,
    componentName
  );

  return null;
};

export const MenuItemProps = {
  disabled: PropTypes.bool,
  href: linkOrButtonValidator,
  label: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  newTab: PropTypes.bool,
  onClick: PropTypes.func,
  onDismiss: PropTypes.func,
  onFocus: PropTypes.func,
  shortcut: PropTypes.shape({
    display: PropTypes.string,
    title: PropTypes.string,
  }),
  Icon: PropTypes.func,
  tooltipPlacement: PropTypes.oneOf(Object.values(PLACEMENT)),
};

MenuItem.propTypes = MenuItemProps;
