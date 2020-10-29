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

/**
 * Internal dependencies
 */
import MultiPartPill from '../';
import Button from '../../button';
import { LeftArrow, RightArrow } from '../../../icons';
import { BUTTON_TYPES } from '../../../constants';

export default {
  title: 'Dashboard/Components/MultiPartPill',
  component: MultiPartPill,
};

const StyledButton = styled(Button)`
  min-width: 0;
  text-shadow: none;
  color: ${({ theme }) => theme.internalTheme.colors.gray800};

  &:focus,
  &:active,
  &:hover {
    text-shadow: none;
    color: ${({ theme }) => theme.internalTheme.colors.bluePrimary};
  }
`;

export const _default = () => {
  return (
    <MultiPartPill>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        <LeftArrow width="14px" height="14px" />
      </StyledButton>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        <RightArrow width="14px" height="14px" />
      </StyledButton>
    </MultiPartPill>
  );
};

export const Single = () => {
  return (
    <MultiPartPill>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'S'}
      </StyledButton>
    </MultiPartPill>
  );
};

export const Triple = () => {
  return (
    <MultiPartPill>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'J'}
      </StyledButton>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'O'}
      </StyledButton>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'Y'}
      </StyledButton>
    </MultiPartPill>
  );
};

export const Quadruple = () => {
  return (
    <MultiPartPill>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'G'}
      </StyledButton>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'A'}
      </StyledButton>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'M'}
      </StyledButton>
      <StyledButton type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'E'}
      </StyledButton>
    </MultiPartPill>
  );
};
