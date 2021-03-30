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
import { useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Pill from '../pill';

export default {
  title: 'Stories Editor/Components/Pill',
  component: Pill,
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.v3};
  padding: 1em;
`;

export const _default = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Container>
      <Pill
        title="Category"
        isSelected={isSelected}
        onClick={() => setIsSelected(!isSelected)}
      />
    </Container>
  );
};
