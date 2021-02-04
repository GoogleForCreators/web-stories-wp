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
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { Navigator as HelpCenterNavigator } from '..';
import { theme as dsTheme, ThemeGlobals } from '../../../../../design-system';

export default {
  title: 'Stories Editor/Components/Help Center/Navigator',
};

const Bg = styled.div`
  position: relative;
  top: 0;
  left: 0;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  padding: 50px;
`;

const Wrapper = styled.div`
  position: absolute;
  bottom: 50px;
  left: 50px;
`;

export const Navigator = () => {
  const [visible, setVisible] = useState(false);
  return (
    <ThemeProvider theme={dsTheme}>
      <ThemeGlobals.OverrideFocusOutline />
      <Bg>
        <Wrapper>
          <HelpCenterNavigator
            onNext={() => {}}
            onPrev={() => {}}
            hasBottomNavigation={visible}
          >
            {visible ? (
              <div>
                <div>
                  <h1>{'Hello'}</h1>
                </div>
                <div>
                  <h1>{'Hello'}</h1>
                </div>
                <div>
                  <h1>{'Hello'}</h1>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <h1>{'WORLD'}</h1>
                </div>
                <div>
                  <h1>{'WORLD'}</h1>
                </div>
              </div>
            )}
          </HelpCenterNavigator>
        </Wrapper>
        <button onClick={() => setVisible((b) => !b)}>
          {'Toggle Children'}
        </button>
      </Bg>
    </ThemeProvider>
  );
};
