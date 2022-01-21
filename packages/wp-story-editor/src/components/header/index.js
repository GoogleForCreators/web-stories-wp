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
import { __ } from '@googleforcreators/i18n';
import { memo } from '@googleforcreators/react';
import { HeaderTitle } from '@googleforcreators/story-editor';

/**
 * Internal dependencies
 */
import Buttons from './buttons';

const Background = styled.header.attrs({
  role: 'group',
  'aria-label': __('Story canvas header', 'web-stories'),
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.bg.primary};
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
    <Background>
      <Head>
        <HeaderTitle />
      </Head>
      <ButtonCell>
        <Buttons />
      </ButtonCell>
    </Background>
  );
}

// Don't rerender the header needlessly e.g. on element selection change.
export default memo(HeaderLayout);
