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

const reverseCss = ({ isLTR }) => css`
  flex-direction: ${isLTR ? 'row-reverse' : 'row'};

  span {
    text-align: ${isLTR ? 'right' : 'left'};
  }
`;

const ReversableButton = styled(Button)`
  ${reverseCss};
`;

const ReversableLink = styled(Link)`
  ${reverseCss};
`;

const ReversableContainer = styled.div`
  ${reverseCss};
`;

const ItemText = styled(Text)`
  width: 200px;
`;

const Shortcut = styled(Text)(
  ({ theme }) => css`
    margin-right: 5px;
    color: ${theme.colors.border.disable};
  `
);

export const MenuItem = ({
  disabled,
  href,
  isLTR,
  label,
  onClick,
  shortcut,
}) => {
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
      <ReversableButton
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        isLTR={isLTR}
      >
        {textContent}
      </ReversableButton>
    );
  } else if (href) {
    return (
      <ReversableLink href={href} isLTR={isLTR}>
        {textContent}
      </ReversableLink>
    );
  }

  return <ReversableContainer isLTR={isLTR}>{textContent}</ReversableContainer>;
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
  href: linkOrButtonValidator,
  isLTR: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: linkOrButtonValidator,
  shortcut: PropTypes.string,
};

MenuItem.propTypes = MenuItemProps;
