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
import { boolean } from '@storybook/addon-knobs';
import { useState } from 'react';
import { TransitionGroup } from 'react-transition-group';
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { theme as dsTheme, ThemeGlobals } from '../../../../../design-system';
import { TIPS } from '../../constants';
import { QuickTip as HelpCenterQuickTip } from '..';

export default {
  title: 'Stories Editor/Components/Help Center/Quick Tip',
};

const Bg = styled.div`
  position: relative;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  padding: 0 50px;
`;

const Container = styled.div`
  position: relative;
  width: 340px;
  height: 100%;
  height: 400px;
  overflow: hidden;
`;

const [tip] = Object.values(TIPS);
export const QuickTip = () => {
  const [toggled, setToggled] = useState(true);
  return (
    <ThemeProvider theme={dsTheme}>
      <ThemeGlobals.OverrideFocusOutline />
      <button onClick={() => setToggled((v) => !v)}>{'toggleTips'}</button>
      <Bg>
        <Container>
          <TransitionGroup component={null}>
            <HelpCenterQuickTip
              key={toggled ? 'key1' : 'key2'}
              title={tip.title}
              description={tip.description}
              isLeftToRightTransition={boolean('isLeftToRightTransition')}
            />
          </TransitionGroup>
        </Container>
      </Bg>
    </ThemeProvider>
  );
};
