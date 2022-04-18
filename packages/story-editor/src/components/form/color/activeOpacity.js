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
import { useRef } from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { PatternPropType } from '@googleforcreators/patterns';
import { __ } from '@googleforcreators/i18n';
import { CONTEXT_MENU_SKIP_ELEMENT } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import {
  default as FocusTrapButton,
  handleReturnTrappedFocus,
} from '../../floatingMenu/elements/shared/focusTrapButton';
import OpacityInput from './opacityInput';

const Space = styled.div`
  width: 8px;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.divider.primary};
`;
const OpacityWrapper = styled.div`
  width: ${({ isInDesignMenu }) =>
    isInDesignMenu ? 'calc(39% - 10px)' : 'calc(47% - 10px)'};
`;

const ActiveOpacity = ({
  handleOpacityChange,
  isInDesignMenu,
  opacityFocusTrap,
  tabIndex,
  value,
}) => {
  const opacityFocusTrapButtonRef = useRef();
  const opacityFocusTrapRef = useRef();

  return opacityFocusTrap ? (
    <FocusTrapButton
      ref={opacityFocusTrapButtonRef}
      inputRef={opacityFocusTrapRef}
      inputLabel={__('Opacity', 'web-stories')}
      styleOverride={css`
        width: ${isInDesignMenu ? 'calc(39%)' : 'calc(47%)'};
      `}
    >
      <Space />
      <OpacityWrapper isInDesignMenu={isInDesignMenu}>
        <OpacityInput
          ref={opacityFocusTrapRef}
          tabIndex={tabIndex}
          inputClassName={CONTEXT_MENU_SKIP_ELEMENT}
          value={value}
          onChange={handleOpacityChange}
          isInDesignMenu={isInDesignMenu}
          onKeyDown={(e) =>
            handleReturnTrappedFocus(e, opacityFocusTrapButtonRef)
          }
        />
      </OpacityWrapper>
    </FocusTrapButton>
  ) : (
    <>
      <Space />
      <OpacityWrapper isInDesignMenu={isInDesignMenu}>
        <OpacityInput
          tabIndex={tabIndex}
          value={value}
          onChange={handleOpacityChange}
          isInDesignMenu={isInDesignMenu}
        />
      </OpacityWrapper>
    </>
  );
};

ActiveOpacity.propTypes = {
  handleOpacityChange: PropTypes.func,
  isInDesignMenu: PropTypes.bool,
  opacityFocusTrap: PropTypes.bool,
  tabIndex: PropTypes.number,
  value: PropTypes.oneOfType([PatternPropType, PropTypes.string]),
};

export default ActiveOpacity;
