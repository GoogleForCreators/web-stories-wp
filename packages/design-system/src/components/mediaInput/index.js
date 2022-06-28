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
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useMemo,
  useRef,
} from '@googleforcreators/react';
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import {
  Button as DefaultButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../button';
import { Pencil } from '../../icons';
import { Menu } from '../menu';
import { BaseTooltip } from '../tooltip';
import { PLACEMENT, Popup } from '../popup';
import { Image } from '../image';
import Landscape from './icons/landscape.svg';
import { MEDIA_VARIANTS } from './constants';

export { MEDIA_VARIANTS };

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

const ImageWrapper = styled.div`
  border-radius: ${({ variant }) =>
    variant === MEDIA_VARIANTS.CIRCLE ? 100 : 4}px;
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

const Img = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const menuStyleOverride = css`
  min-width: 100px;
  margin-top: 0;
  li {
    display: block;
  }
`;

const Button = styled(DefaultButton)(
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
  [MEDIA_VARIANTS.RECTANGLE]: MediaRectangle,
  [MEDIA_VARIANTS.CIRCLE]: MediaCircle,
  [MEDIA_VARIANTS.NONE]: EmptyMediaWrapper,
};

const dots = keyframes`
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
        ${({ theme }) => theme.colors.standard.white},
      12px 0 0 ${({ theme }) => theme.colors.standard.white};
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

export const MediaInput = forwardRef(function Media(
  {
    className,
    onBlur,
    alt = __('Preview image', 'web-stories'),
    value,
    ariaLabel = __('Choose an image', 'web-stories'),
    variant = MEDIA_VARIANTS.RECTANGLE,
    isLoading,
    menuOptions = [],
    onMenuOption,
    openMediaPicker,
    canUpload = true,
    menuProps = {},
    imgProps = {},
    ...rest
  },
  ref
) {
  const hasMenu = menuOptions?.length > 0;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  const internalRef = useRef(null);

  const StyledMedia = MediaOptions[variant];
  // Media input only allows simplified dropdown with one group.
  const options = [{ group: menuOptions }];

  return (
    <StyledMedia className={className}>
      {variant !== MEDIA_VARIANTS.NONE && (
        <ImageWrapper variant={variant}>
          {value ? (
            <Img
              src={value}
              alt={alt}
              width={imgProps?.width || null}
              height={imgProps?.height || null}
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
        <BaseTooltip
          title={hasMenu ? null : __('Open media picker', 'web-stories')}
        >
          <Button
            ref={(node) => {
              // `ref` can either be a callback ref or a normal ref.
              if (typeof ref == 'function') {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
              internalRef.current = node;
            }}
            id={buttonId}
            showImage={variant !== MEDIA_VARIANTS.NONE}
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
            <Pencil />
          </Button>
        </BaseTooltip>
      )}
      <Popup
        placement={PLACEMENT.BOTTOM_END}
        anchor={internalRef}
        isOpen={isMenuOpen}
      >
        <Menu
          parentId={buttonId}
          listId={listId}
          hasMenuRole
          options={options}
          onMenuItemClick={(evt, val) => {
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

MediaInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  onBlur: PropTypes.func,
  ariaLabel: PropTypes.string,
  alt: PropTypes.string,
  isLoading: PropTypes.bool,
  canUpload: PropTypes.bool,
  variant: PropTypes.string,
  menuOptions: PropTypes.array,
  onMenuOption: PropTypes.func,
  openMediaPicker: PropTypes.func.isRequired,
  menuProps: PropTypes.object,
  imgProps: PropTypes.object,
};
