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
import { useState } from '@googleforcreators/react';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import LinkInput from '../link';

export default {
  title: 'Stories Editor/Components/Form/Link',
  component: LinkInput,
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};

const Container = styled.div`
  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

export const _default = () => {
  const [value, setValue] = useState('https://test.com');
  const onChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <Container>
      <LinkInput
        hint={__('Type an address to add a link', 'web-stories')}
        onChange={onChange}
        onFocus={() => {}}
        value={value}
        clear
        aria-label={__('Test URL', 'web-stories')}
      />
    </Container>
  );
};
