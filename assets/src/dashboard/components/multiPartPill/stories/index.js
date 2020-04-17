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
import ButtonBase from '../../button';
import { ReactComponent as LeftArrow } from '../../../icons/left-arrow.svg';
import { ReactComponent as RightArrow } from '../../../icons/right-arrow.svg';
import { BUTTON_TYPES } from '../../../constants';

export default {
  title: 'Dashboard/Components/MultiButtonPill',
  component: MultiPartPill,
};

const Button = styled(ButtonBase)`
  min-width: 0;
  text-shadow: none;
  color: ${({ theme }) => theme.colors.gray800};

  &:focus,
  &:active,
  &:hover {
    text-shadow: none;
    color: ${({ theme }) => theme.colors.bluePrimary};
  }
`;

export const _default = () => {
  return (
    <MultiPartPill>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        <LeftArrow width="14px" height="14px" />
      </Button>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        <RightArrow width="14px" height="14px" />
      </Button>
    </MultiPartPill>
  );
};

export const Single = () => {
  return (
    <MultiPartPill>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'S'}
      </Button>
    </MultiPartPill>
  );
};

export const Triple = () => {
  return (
    <MultiPartPill>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'J'}
      </Button>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'O'}
      </Button>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'Y'}
      </Button>
    </MultiPartPill>
  );
};

export const Quadruple = () => {
  return (
    <MultiPartPill>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'G'}
      </Button>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'A'}
      </Button>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'M'}
      </Button>
      <Button type={BUTTON_TYPES.SECONDARY} onClick={() => {}}>
        {'E'}
      </Button>
    </MultiPartPill>
  );
};
