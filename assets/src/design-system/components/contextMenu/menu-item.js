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
import { useEffect, useMemo, useRef } from 'react';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { Button } from '../button';
import { Link } from '../typography/link';
import { Text } from '../typography/text';
import { THEME_CONSTANTS } from '../../theme';

const ItemText = styled(Text)`
  width: 200px;
  text-align: left;
`;

const Shortcut = styled(Text)(
  ({ theme }) => css`
    color: ${theme.colors.border.disable};
    white-space: nowrap;
  `
);

export const MenuItem = ({
  disabled,
  focusedIndex,
  href,
  index,
  label,
  onClick,
  setFocusedIndex,
  shortcut,
}) => {
  const itemRef = useRef(null);

  const handleFocus = () => {
    if (focusedIndex !== index) {
      setFocusedIndex(index);
    }
  };

  useEffect(() => {
    if (focusedIndex === index) {
      itemRef.current?.focus();
    }
  }, [focusedIndex, index]);

  const textContent = useMemo(
    () => (
      <>
        <ItemText
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
          forwardedAs="span"
        >
          {label}
        </ItemText>
        {shortcut && (
          <Shortcut
            size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
            forwardedAs="span"
          >
            {shortcut}
          </Shortcut>
        )}
      </>
    ),
    [label, shortcut]
  );

  if (onClick) {
    return (
      <Button
        ref={itemRef}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        onFocus={handleFocus}
      >
        {textContent}
      </Button>
    );
  } else if (href) {
    return (
      <Link ref={itemRef} aria-label={label} href={href} onFocus={handleFocus}>
        {textContent}
      </Link>
    );
  }

  return <div>{textContent}</div>;
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
  if (props.onClick && props.href !== undefined) {
    return new Error(
      `Expected one of [\`onClick\`, \`href\`] but both were passed to \`${componentName}\`. \`href\` will be ignored. Validation failed. `
    );
  }

  if (props.href && props.disabled !== undefined) {
    return new Error(
      `A link cannot be disabled. \`disabled\` will be ignored. Validation failed.`
    );
  }

  /**
   * Leverage PropTypes typechecking instead of
   * writing our own validators for `string` and `function`
   */
  PropTypes.checkPropTypes(
    {
      onClick: PropTypes.func,
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
  focusedIndex: PropTypes.number,
  href: linkOrButtonValidator,
  index: PropTypes.number,
  label: PropTypes.string.isRequired,
  onClick: linkOrButtonValidator,
  setFocusedIndex: PropTypes.func,
  shortcut: PropTypes.string,
};

MenuItem.propTypes = MenuItemProps;
