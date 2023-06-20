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
import styled, { ThemeProvider } from 'styled-components';
/**
 * Internal dependencies
 */
import { Chip } from '..';
import { Checkmark, LetterIOutline } from '../../../icons';
import { theme } from '../../../theme';

export default {
  title: 'DesignSystem/Components/Chip',
  component: Chip,
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.bg.primary};
  padding: 30px;
  display: flex;
  gap: 20px;
`;

const CHIP_STATES = [
  { name: 'Normal' },
  { name: 'Active', active: true },
  { name: 'Disabled', disabled: true },
  { name: 'with Suffix', suffix: <Checkmark height={28} width={28} /> },
  {
    name: 'with Prefix',
    prefix: <LetterIOutline height={28} width={28} />,
    active: true,
  },
  {
    name: 'Suffix & Prefix',
    prefix: <LetterIOutline height={28} width={28} />,
    suffix: <Checkmark height={28} width={28} />,
    disabled: true,
  },
];

export const _default = {
  render: function Render(args) {
    const chips = CHIP_STATES.map(({ name, ...state }) => (
      <Chip key={name} onClick={() => args.onClick(name)} {...state}>
        {name}
      </Chip>
    ));
    return (
      <>
        <Container>{chips}</Container>
        <ThemeProvider theme={theme}>
          <Container>{chips}</Container>
        </ThemeProvider>
      </>
    );
  },
};
