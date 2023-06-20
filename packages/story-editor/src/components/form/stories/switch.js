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

/**
 * Internal dependencies
 */
import Switch from '../switch';

export default {
  title: 'Stories Editor/Components/Form/Switch',
  component: Switch,
  args: {
    onLabel: 'Fit to Device',
    offLabel: 'Do not format',
    disabled: false,
  },
  argTypes: {
    handleChange: { action: 'Switching' },
  },
};

const Container = styled.div`
  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

export const _default = {
  render: function Render(args) {
    const [value, setValue] = useState(true);

    const handleChange = (evt, newValue) => {
      args.handleChange(`${newValue ? 'On' : 'Off'}`, evt);
      setValue(newValue);
    };

    return (
      <Container>
        <Switch
          groupLabel="Switch"
          name="test-switch"
          value={value}
          onChange={handleChange}
          {...args}
        />
      </Container>
    );
  },
};
