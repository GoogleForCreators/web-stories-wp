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
import { useMemo } from '@googleforcreators/react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { Headline } from '../../components/typography';
import { DarkThemeProvider } from '../../storybookUtils';
import { scrollbarCSS } from '../helpers/scrollbar';

export default {
  title: 'DesignSystem/Theme/Scrollbar',
};

const randomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const Container = styled.div`
  display: flex;
`;

const ScrollContainer = styled.div`
  height: 400px;
  width: 50%;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  overflow-y: scroll;

  ${scrollbarCSS};
`;

const Content = styled.div`
  height: 100px;
  width: 100%;
  margin-bottom: 25px;
  background-color: ${({ theme }) =>
    [
      theme.colors.fg.primary,
      theme.colors.interactiveBg.positiveNormal,
      theme.colors.interactiveBg.negativeNormal,
    ][randomInt(3)]};
  border: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: 4px;
`;

export const _default = () => {
  const ids = useMemo(() => new Array(20).fill(0).map(() => uuidv4()), []);

  return (
    <>
      <Headline as="h2">{'Scrollbar'}</Headline>
      <Container>
        <ScrollContainer>
          {ids.map((id) => (
            <Content key={id} />
          ))}
        </ScrollContainer>
        <DarkThemeProvider>
          <ScrollContainer>
            {ids.map((id) => (
              <Content key={id} />
            ))}
          </ScrollContainer>
        </DarkThemeProvider>
      </Container>
    </>
  );
};
