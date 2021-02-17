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
import styled, { css } from 'styled-components';
/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  Icons,
  themeHelpers,
} from '../../../../design-system';
import { useConfig } from '../../../app/config';
import { forceFocusCompanion } from '../utils';
import { ReadTipsType, TIPS } from '../constants';

const Panel = styled.div`
  padding: 24px 0;
`;

const StyledButton = styled(Button)`
  ${themeHelpers.expandTextPreset(({ label }, { SMALL }) => label[SMALL])}
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 6px 0;
`;

const ButtonText = styled.span`
  vertical-align: middle;
  text-align: left;

  ${({ unread, theme }) =>
    unread &&
    css`
      &::before {
        content: ' ';
        display: inline-block;
        height: 10px;
        width: 10px;
        margin-right: 16px;
        border-radius: ${theme.borders.radius.round};
        background-color: ${theme.colors.accent.primary};
      }
    `}
`;

const ArrowWrap = styled.div`
  width: 32px;
  margin: -9px;
  transform-origin: 50% 50%;
  transform: ${({ isRTL }) => (isRTL ? 'none' : 'rotate(180deg)')};
`;

const StyledArrow = styled(Icons.ArrowLeft)`
  width: 100%;
`;

function Tip({ children, onClick, unread = true }) {
  const { isRTL } = useConfig();
  return (
    <StyledButton size={BUTTON_SIZES.SMALL} onClick={onClick}>
      <ButtonText unread={unread}>{children}</ButtonText>
      <ArrowWrap isRTL={isRTL}>
        <StyledArrow />
      </ArrowWrap>
    </StyledButton>
  );
}
Tip.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  unread: PropTypes.bool,
};

const TIPS_ITERABLE = Object.entries(TIPS);
export function Tips({ onTipSelect = () => {}, readTips }) {
  return (
    <Panel>
      {TIPS_ITERABLE.map(([key, tip]) => (
        <Tip
          unread={!readTips[key]}
          key={key}
          onClick={() => {
            forceFocusCompanion();
            onTipSelect(key);
          }}
        >
          {tip.title}
        </Tip>
      ))}
    </Panel>
  );
}
Tips.propTypes = {
  readTips: ReadTipsType,
  onTipSelect: PropTypes.func,
};
