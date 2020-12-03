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
import { rgba } from 'polished';
import { useCallback, useState, useRef } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { DefaultImage as DefaultImageIcon, EditPencil } from '../../icons';
import DropDownMenu from '../dropDownMenu';
import { useMediaPicker } from '../mediaPicker';
import MULTIPLE_VALUE from './multipleValue';

const Container = styled.section`
  width: ${({ circle, size }) => (size && circle ? `${size}px` : '100%')};
  min-width: ${({ circle, size }) => (size && circle ? `${size}px` : '100%')};
  height: ${({ size }) => (size ? `${size}px` : '148px')};
  min-height: ${({ size }) => (size ? `${size}px` : '148px')};
  background-color: ${({ theme }) => rgba(theme.colors.bg.black, 0.5)};
  border: none;
  position: relative;

  ${({ circle }) => circle && 'border-radius: 50%;'}

  :focus {
    outline: -webkit-focus-ring-color auto 1px;
  }
`;

const DefaultImage = styled(DefaultImageIcon)`
  width: 100%;
  height: 100%;
  display: block;
  padding: ${({ size }) => (size ? size * 0.2 : 18)}px;
`;

const EditIcon = styled(EditPencil)`
  width: 100%;
  height: 100%;
  display: block;
`;

const EditBtn = styled.button`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => rgba(theme.colors.fg.white, 0.1)};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.white};
  background: ${({ theme }) => theme.colors.bg.panel};
  left: ${({ circle }) => (circle ? 0 : 4)}px;
  bottom: ${({ circle }) => (circle ? 0 : 4)}px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${({ circle }) => circle && 'border-radius: 50%;'}
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
    color: ${({ theme }) => theme.colors.fg.white};
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
      text-shadow: 6px 0 0 ${({ theme }) => theme.colors.fg.white},
        12px 0 0 transparent;
    }
    80%,
    100% {
      text-shadow: 6px 0 0 ${({ theme }) => theme.colors.fg.white},
        12px 0 0 ${({ theme }) => theme.colors.fg.white};
    }
  }
`;

function MediaInput({
  className,
  onBlur,
  onChange,
  label,
  title,
  buttonInsertText,
  type,
  alt,
  value,
  ariaLabel,
  disabled,
  circle,
  size,
  loading,
  canReset,
  ...rest
}) {
  const isMultiple = value === MULTIPLE_VALUE;
  const openMediaPicker = useMediaPicker({
    title,
    buttonInsertText,
    onSelect: onChange,
    type,
  });

  const dropdownOptions = [
    { name: __('Edit', 'web-stories'), value: 'edit' },
    { name: __('Reset', 'web-stories'), value: 'reset' },
  ];

  const onOption = useCallback(
    (opt, evt) => {
      switch (opt) {
        case 'edit':
          openMediaPicker(evt);
          break;
        case 'reset':
          onChange(null);
          break;
        default:
          break;
      }
    },
    [onChange, openMediaPicker]
  );

  const ref = useRef();
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const resettableProps = {
    tabIndex: 0,
    'aria-label': ariaLabel,
    onFocus: () => setIsFocused(true),
    onBlur: (evt) => setIsFocused(ref.current.contains(evt.relatedTarget)),
    onPointerEnter: () => setIsHovering(true),
    onPointerLeave: () => setIsHovering(false),
  };

  const isMenuVisible = isHovering || isFocused;

  return (
    <Container
      ref={ref}
      className={`${className}`}
      disabled={disabled}
      circle={circle}
      size={size}
      {...rest}
      {...(canReset && resettableProps)}
    >
      {value && !isMultiple ? (
        <Img src={value} circle={circle} alt={alt} />
      ) : (
        <DefaultImage size={size} />
      )}
      {loading && <LoadingDots />}
      {canReset && isMenuVisible && (
        <DropDownMenu options={dropdownOptions} onOption={onOption} />
      )}
      {!canReset && (
        <EditBtn
          onClick={openMediaPicker}
          circle={circle}
          aria-label={ariaLabel}
        >
          <EditIcon />
        </EditBtn>
      )}
    </Container>
  );
}

MediaInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.number,
  circle: PropTypes.bool,
  ariaLabel: PropTypes.string,
  type: PropTypes.string,
  buttonInsertText: PropTypes.string,
  title: PropTypes.string,
  alt: PropTypes.string,
  loading: PropTypes.bool,
  canReset: PropTypes.bool,
};

MediaInput.defaultProps = {
  className: null,
  disabled: false,
  symbol: '',
  flexBasis: 100,
  textCenter: false,
  circle: false,
  size: null,
  type: 'image',
  buttonInsertText: __('Choose an image', 'web-stories'),
  title: __('Choose an image', 'web-stories'),
  ariaLabel: __('Choose an image', 'web-stories'),
  alt: __('Preview image', 'web-stories'),
  canReset: false,
};

export default MediaInput;
