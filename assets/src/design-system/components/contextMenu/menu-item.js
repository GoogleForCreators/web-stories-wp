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
import { useMemo } from 'react';
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import { Button } from '../button';

/**
 * Internal dependencies
 */
import { Link } from '../typography/link';
import { Text } from '../typography/text';

const ItemText = styled(Text)`
  width: 200px;
  text-align: left;
`;

const Shortcut = styled(Text)(
  ({ theme }) => css`
    margin-right: 5px;
    color: ${theme.colors.bg.tertiary};
  `
);

export const MenuItem = ({ disabled, href, label, onClick, shortcut }) => {
  const textContent = useMemo(
    () => (
      <>
        <ItemText forwardedAs="span">{label}</ItemText>
        {shortcut && <Shortcut forwardedAs="span">{shortcut}</Shortcut>}
      </>
    ),
    [label, shortcut]
  );

  if (onClick) {
    return (
      <Button aria-label={label} disabled={disabled} onClick={onClick}>
        {textContent}
      </Button>
    );
  } else if (href) {
    return <Link href={href}>{textContent}</Link>;
  }

  return <div>{textContent}</div>;
};

/**
 * Custom propTypes validator. Used to check:
 * 1. `onClick` and `href` cannot both be passed to a MenuItem
 * 2. A link cannot be disabled
 *
 * This also checks that they are of the correct type.
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
  href: linkOrButtonValidator,
  label: PropTypes.string.isRequired,
  onClick: linkOrButtonValidator,
  shortcut: PropTypes.string,
};

MenuItem.propTypes = MenuItemProps;
