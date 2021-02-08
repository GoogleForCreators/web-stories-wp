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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import Buttons from './buttons';
import Title from './title';
import HeaderProvider from './provider';

const Background = styled.header.attrs({
  role: 'group',
  'aria-label': __('Story canvas header', 'web-stories'),
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.bg.workspace};
`;

const Head = styled.div`
  flex: 1 1 auto;
  padding: 1em;
`;

const ButtonCell = styled.div`
  grid-area: buttons;
`;

function HeaderLayout() {
  return (
    <HeaderProvider>
      <Background>
        <Head>
          <Title />
        </Head>
        <ButtonCell>
          <Buttons />
        </ButtonCell>
      </Background>
    </HeaderProvider>
  );
}

export default HeaderLayout;
