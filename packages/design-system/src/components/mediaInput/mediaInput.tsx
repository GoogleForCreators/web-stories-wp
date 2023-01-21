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
import styled, { css, keyframes } from 'styled-components';
import { useState, forwardRef, useMemo } from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@googleforcreators/i18n';
import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';

/**
 * Internal dependencies
 */
import {
  Button as DefaultButton,
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from '../button';
import { Pencil } from '../../icons';
import { Menu } from '../menu';
import type { DropdownItem, DropdownValue } from '../menu';
import { Tooltip } from '../tooltip';
import { Placement, Popup } from '../popup';
import type { Theme } from '../../theme';
import useForwardedRef from '../../utils/useForwardedRef';
import Landscape from './icons/landscape.svg';
import { MediaVariant } from './types';

const MediaRectangle = styled.section`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border-radius: 4px;
  position: relative;
`;

const MediaCircle = styled(MediaRectangle)`
  border-radius: 100px;
  height: 100%;
  width: 100%;
`;

const EmptyMediaWrapper = styled.div``;

const ImageWrapper = styled.div<{ variant?: MediaVariant }>`
  border-radius: ${({ variant }) =>
    variant === MediaVariant.Circle ? 100 : 4}px;
  overflow: hidden;
  height: 100%;
  display: flex;
`;

const DefaultImageWrapper = styled.div`
  padding: 8px;
`;

const DefaultImage = styled(Landscape)`
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
  white-space: nowrap;
  margin-top: 0;
  li {
    display: block;
  }
`;

const Button = styled(DefaultButton)<{ showImage?: boolean }>(
  ({ showImage }) =>
    css`
      background-color: ${({ theme }) =>
        theme.colors.interactiveBg.secondaryNormal};
      position: relative;

      ${showImage &&
      css`
        position: absolute;
        bottom: -8px;
        right: -8px;
      `}

      &:hover {
        background-color: ${({ theme }) =>
          theme.colors.interactiveBg.secondaryHover};
      }
    `
);

const MediaOptions = {
  [MediaVariant.Rectangle]: MediaRectangle,
  [MediaVariant.Circle]: MediaCircle,
  [MediaVariant.None]: EmptyMediaWrapper,
};

const dots = ({ theme }: { theme: Theme }) => keyframes`
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
        ${theme.colors.standard.white},
      12px 0 0 transparent;
  }
  80%,
  100% {
    text-shadow: 6px 0 0
        ${theme.colors.standard.white},
      12px 0 0 ${theme.colors.standard.white};
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
    animation: ${dots} 1s steps(5, end) infinite;
    margin-left: -12px;
  }
`;

interface MediaInputProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'value' | 'type'> {
  alt?: string;
  ariaLabel?: string;
  variant?: MediaVariant;
  isLoading?: boolean;
  menuOptions?: DropdownItem[];
  onMenuOption: (evt: Event, option: DropdownValue) => void;
  openMediaPicker: () => void;
  canUpload: boolean;
  menuProps?: Omit<ComponentPropsWithoutRef<'button'>, 'type'>;
  imgProps?: ComponentPropsWithoutRef<'img'>;
  value: string;
}

const MediaInput = forwardRef(function MediaInput(
  {
    className,
    onBlur,
    alt = __('Preview image', 'web-stories'),
    value,
    ariaLabel = __('Choose an image', 'web-stories'),
    variant = MediaVariant.Rectangle,
    isLoading,
    menuOptions = [],
    onMenuOption,
    openMediaPicker,
    canUpload = true,
    menuProps = {},
    imgProps = {},
    ...rest
  }: MediaInputProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const hasMenu = menuOptions?.length > 0;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  const ref = useForwardedRef(forwardedRef);

  const StyledMedia = MediaOptions[variant];
  // Media input only allows simplified dropdown with one group.
  const groups = [{ options: menuOptions }];

  return (
    <StyledMedia className={className}>
      {variant !== MediaVariant.None && (
        <ImageWrapper variant={variant}>
          {value ? (
            <Img
              src={value}
              alt={alt}
              crossOrigin="anonymous"
              decoding="async"
              width={imgProps?.width}
              height={imgProps?.height}
            />
          ) : (
            <DefaultImageWrapper>
              <DefaultImage />
            </DefaultImageWrapper>
          )}
          {isLoading && <LoadingDots />}
        </ImageWrapper>
      )}
      {canUpload && (
        <Tooltip title={hasMenu ? '' : __('Open media picker', 'web-stories')}>
          <Button
            ref={ref}
            id={buttonId}
            showImage={variant !== MediaVariant.None}
            variant={ButtonVariant.Square}
            type={ButtonType.Quarternary}
            size={ButtonSize.Small}
            aria-label={ariaLabel}
            onClick={hasMenu ? () => setIsMenuOpen(true) : openMediaPicker}
            aria-owns={hasMenu ? listId : undefined}
            aria-pressed={isMenuOpen}
            aria-expanded={isMenuOpen}
            {...rest}
          >
            <Pencil />
          </Button>
        </Tooltip>
      )}
      <Popup
        placement={Placement.BottomEnd}
        anchor={ref}
        isOpen={isMenuOpen}
        // Ensure that popup is visible in publish dialog.
        zIndex={11}
      >
        <Menu
          parentId={buttonId}
          listId={listId}
          hasMenuRole
          groups={groups}
          handleMenuItemSelect={(evt, val) => {
            onMenuOption(evt, val);
            setIsMenuOpen(false);
          }}
          onDismissMenu={() => setIsMenuOpen(false)}
          menuStylesOverride={menuStyleOverride}
          {...menuProps}
        />
      </Popup>
    </StyledMedia>
  );
});

export default MediaInput;
