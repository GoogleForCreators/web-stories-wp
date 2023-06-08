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
import { useRef, useEffect } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  Icons,
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { focusStyle } from '../panels/shared/styles';
import { noop } from '../../utils/noop';

const HEADER_HEIGHT = 44;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${HEADER_HEIGHT}px;
  padding: 4px 8px 4px 8px;
  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.divider.tertiary};
`;

const Actions = styled.div`
  display: flex;
  margin-left: auto;
`;

const StyledButton = styled(Button)`
  margin-left: 8px;
  ${focusStyle};
`;

function Header({
  children,
  handleClose,
  isEditMode = false,
  setIsEditMode = noop,
}) {
  const ref = useRef();
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const buttonProps = {
    type: ButtonType.Tertiary,
    size: ButtonSize.Small,
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
        {isEditMode ? (
          <StyledButton
            {...buttonProps}
            variant={ButtonVariant.Rectangle}
            aria-label={__('Exit edit mode', 'web-stories')}
          >
            {__('Done', 'web-stories')}
          </StyledButton>
        ) : (
          <StyledButton
            {...buttonProps}
            variant={ButtonVariant.Square}
            aria-label={__('Edit style', 'web-stories')}
          >
            <Icons.Pencil />
          </StyledButton>
        )}
        <StyledButton
          aria-label={__('Close', 'web-stories')}
          onClick={handleClose}
          type={ButtonType.Tertiary}
          size={ButtonSize.Small}
          variant={ButtonVariant.Square}
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
  isEditMode: PropTypes.bool,
  setIsEditMode: PropTypes.func,
  hasPresets: PropTypes.bool,
};

export default Header;
