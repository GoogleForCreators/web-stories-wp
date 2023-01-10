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
import type { ComponentPropsWithoutRef } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Pill from './pill';

const Container = styled.div.attrs({
  role: 'listbox',
})`
  display: flex;
  flex: 1;
  column-gap: 4px;
`;

interface PillOption {
  id: string;
  label: string;
}

interface PillGroupProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'onSelect' | 'onClick'> {
  options: PillOption[];
  value: string;
  onSelect: (id: string) => void;
}

function PillGroup({ options, value, onSelect, ...rest }: PillGroupProps) {
  return (
    <Container>
      {options.map(({ id, label }) => (
        <Pill
          key={id}
          isActive={id === value}
          onClick={() => onSelect(id)}
          role="option"
          {...rest}
        >
          {label}
        </Pill>
      ))}
    </Container>
  );
}

export default PillGroup;
