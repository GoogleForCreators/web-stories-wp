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
import { useRef, useEffect } from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  Icons,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { focusStyle } from '../panels/shared';

const HEADER_FOOTER_HEIGHT = 52;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${HEADER_FOOTER_HEIGHT}px;
  padding: 8px;
  position: relative;
`;

const Actions = styled.div`
  display: flex;
  margin-left: auto;
`;

const StyledButton = styled(Button)`
  ${focusStyle};
`;

function Header({
  children,
  handleClose,
  isEditMode,
  setIsEditMode,
  hasPresets,
}) {
  const ref = useRef();
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const buttonProps = {
    type: BUTTON_TYPES.TERTIARY,
    size: BUTTON_SIZES.SMALL,
    variant: BUTTON_VARIANTS.SQUARE,
    onClick: (evt) => {
      evt.stopPropagation();
      setIsEditMode(!isEditMode);
    },
    isEditMode,
  };

  return (
    <Wrapper>
      {children}
      <Actions>
        {hasPresets && isEditMode && (
          <StyledButton
            {...buttonProps}
            aria-label={__('Exit edit mode', 'web-stories')}
          >
            {__('Done', 'web-stories')}
          </StyledButton>
        )}
        {hasPresets && !isEditMode && (
          <StyledButton
            {...buttonProps}
            aria-label={__('Edit colors', 'web-stories')}
          >
            <Icons.Pencil />
          </StyledButton>
        )}
        <StyledButton
          aria-label={__('Close', 'web-stories')}
          onClick={handleClose}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
          ref={ref}
        >
          <Icons.Cross />
        </StyledButton>
      </Actions>
    </Wrapper>
  );
}

Header.propTypes = {
  children: PropTypes.node,
  handleClose: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  setIsEditMode: PropTypes.func.isRequired,
  hasPresets: PropTypes.bool.isRequired,
};

export default Header;
