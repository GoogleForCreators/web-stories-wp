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
import { useState } from 'react';
import { useFeatures } from 'flagged';
import styled, { ThemeProvider, css } from 'styled-components';
/**
 * Internal dependencies
 */
import { theme, themeHelpers } from '../../../design-system';
import { Toggle } from './toggle';

const Wrapper = styled.div`
  position: absolute;
  bottom: 16px;
  left: 11px;
  z-index: 10;

  ${themeHelpers.mq.tablet(
    css`
      bottom: 24px;
      left: 23px;
    `
  )}

  ${themeHelpers.mq.desktop(
    css`
      bottom: 16px;
      left: 31px;
    `
  )}
`;

export const HelpCenter = () => {
  const { enableQuickTips } = useFeatures();
  const [isOpen, setIsOpen] = useState(false);

  return (
    enableQuickTips && (
      <ThemeProvider theme={theme}>
        <Wrapper>
          <Toggle
            isOpen={isOpen}
            onClick={() => setIsOpen((v) => !v)}
            notificationCount={1}
          />
        </Wrapper>
      </ThemeProvider>
    )
  );
};
