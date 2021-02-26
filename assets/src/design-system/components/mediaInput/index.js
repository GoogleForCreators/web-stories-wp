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
import styled, {css} from 'styled-components';
import PropTypes from 'prop-types';
import {useCallback, useState, useRef, forwardRef, useMemo} from 'react';
import { __ } from '@web-stories-wp/i18n';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { DropDown } from '../dropDown';
import { MULTIPLE_VALUE } from '../../../edit-story/constants';
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons, Menu, PLACEMENT,
} from '../../';
import {boolean, number, select, text} from "@storybook/addon-knobs";
import {action} from "@storybook/addon-actions";
import DropDownSelect from "../dropDown/select";

const Container = styled.section`
  width: 64px;
  height: 114px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  :focus {
    outline: -webkit-focus-ring-color auto 1px;
  }
  border-radius: 4px;
  position: relative;
`;

const ImageWrapper = styled.div`
  padding: 4px;
  height: calc(100% - 8px);
`;

const DefaultImage = styled(Icons.Landscape)`
  width: 100%;
  height: 100%;
  display: block;
  color: ${({ theme }) => theme.colors.standard.white};
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const menuStyleOverride = css`
  min-width: 100px;
  li {
    display: block;
  }
`;

const Button = styled(DefaultButton)`
  background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  position: absolute;
  bottom: -8px;
  right: -8px;
  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }
`;

const LoadingDots = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  border-radius: 50%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  display: flex;

  &:after {
    pointer-events: none;
    color: ${({ theme }) => theme.colors.standard.white};
    content: '.';
    font-weight: bold;
    animation: dots 1s steps(5, end) infinite;
    margin-left: -12px;
  }

  @keyframes dots {
    0%,
    20% {
      color: transparent;
      text-shadow: 6px 0 0 transparent, 12px 0 0 transparent;
    }
    40% {
      color: white;
      text-shadow: 6px 0 0 transparent, 12px 0 0 transparent;
    }
    60% {
      text-shadow: 6px 0 0
          ${({ theme }) => theme.colors.standard.white},
        12px 0 0 transparent;
    }
    80%,
    100% {
      text-shadow: 6px 0 0
          ${({ theme }) => theme.colors.standard.white};
        12px 0 0 ${({ theme }) => theme.colors.standard.white};
    }
  }
`;

const MediaInput = forwardRef(
  (
    {
      className,
      onBlur,
      onChange,
      alt = __('Preview image', 'web-stories'),
      value,
      ariaLabel = __('Choose an image', 'web-stories'),
      disabled,
      size,
      isLoading,
      menuOptions = [],
      onMenuOption,
      openMediaPicker,
      menuProps = {},
      ...rest
    },
    ref
  ) => {
    const hasMenu = menuOptions?.length > 0;
    const isMultiple = value === MULTIPLE_VALUE;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const listId = useMemo(() => `list-${uuidv4()}`, []);
    const buttonId = useMemo(() => `button-${uuidv4()}`, []);
    return (
      <Container
        ref={ref}
        className={className}
        disabled={disabled}
        size={size}
        {...rest}
      >
        <ImageWrapper>
          {value && !isMultiple ? (
            <Img src={value} alt={alt} />
          ) : (
            <DefaultImage size={size} />
          )}
          {isLoading && <LoadingDots />}
        </ImageWrapper>
        <Button
          id={buttonId}
          variant={BUTTON_VARIANTS.SQUARE}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          aria-label={ariaLabel}
          onClick={hasMenu ? () => setIsMenuOpen(true) : openMediaPicker}
          aria-owns={hasMenu ? listId : null}
          aria-pressed={isMenuOpen}
          aria-expanded={isMenuOpen}
          {...rest}
        >
          <Icons.Pencil />
        </Button>
        {isMenuOpen && (
          <Menu
            parentId={buttonId}
            listId={listId}
            hasMenuRole
            options={menuOptions}
            onMenuItemClick={onMenuOption}
            onDismissMenu={() => setIsMenuOpen(false)}
            menuStylesOverride={menuStyleOverride}
          />
        )}
      </Container>
    );
  }
);

MediaInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.number,
  ariaLabel: PropTypes.string,
  alt: PropTypes.string,
  isLoading: PropTypes.bool,
  hasMenu: PropTypes.bool,
};

export default MediaInput;
