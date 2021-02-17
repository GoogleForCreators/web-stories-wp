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
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import SuccessMessage from './successMessage';
import Dismiss from './dismiss';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

const Wrapper = styled.div`
  font-family: ${({ theme }) => theme.fonts.body.family};
  font-size: ${({ theme }) => theme.fonts.body.size};
  line-height: ${({ theme }) => theme.fonts.body.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.body.fontWeight};
  color: ${({ theme }) => theme.colors.primary};

  background: ${({ theme }) => `linear-gradient(
      115.54deg,
      ${rgba(theme.colors.bg.start, 0.2)} 9.27%,
      ${rgba(theme.colors.bg.end, 0.2)} 47.82%,
      ${rgba(theme.colors.bg.end, 0)} 66.64%
    ),
    linear-gradient(
      158.59deg,
      ${rgba(theme.colors.bg.start, 0.3)} 13.24%,
      ${rgba(theme.colors.bg.end, 0.3)} 86.01%
    ),
    linear-gradient(
      115.54deg,
      ${rgba(theme.colors.bg.start, 0.2)} 9.27%,
      ${rgba(theme.colors.bg.end, 0.2)} 47.82%,
      ${rgba(theme.colors.bg.end, 0)} 66.64%
    ),
    linear-gradient(70.23deg, #010218 -28.03%, #1b0418 95.56%)`};

  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  padding: 0 30px 0 45px;
  justify-content: center;

  @media ${({ theme }) => theme.breakpoint.tabletSmall} {
    max-height: 245px;
  }

  @media ${({ theme }) => theme.breakpoint.tabletLarge} {
    justify-content: space-around;
  }
`;

function MessageContent() {
  return (
    <Wrapper>
      <Dismiss />
      <SuccessMessage />
      <Step1 />
      <Step2 />
      <Step3 />
    </Wrapper>
  );
}

export default MessageContent;
