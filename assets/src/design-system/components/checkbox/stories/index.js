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
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { Checkbox } from '..';
import { Text } from '../..';
import { DarkThemeProvider } from '../../../storybookUtils';

export default {
  title: 'DesignSystem/Components/Checkbox',
  component: Checkbox,
};

const Container = styled.div`
  display: grid;
  row-gap: 20px;
  max-width: 500px;
  padding: 20px 50px;
  background-color: ${({ darkMode }) => (darkMode ? '#000' : '#FFF')};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column: 1 / -1;

  > * {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const _default = () => (
  <>
    <Container>
      <Row>
        <div>
          <label htmlFor="unchecked-1">
            <Text>{text('Checkbox Label 1', 'Normal')}</Text>
          </label>
          <Checkbox
            id="unchecked-1"
            onChange={action('Checkbox 1: onChange')}
          />
        </div>
        <div>
          <label htmlFor="unchecked-disabled-1">
            <Text>{text('Checkbox Label 2', 'Disabled')}</Text>
          </label>
          <Checkbox
            id="unchecked-disabled-1"
            onChange={action('Checkbox 2: onChange')}
            disabled
          />
        </div>
      </Row>
      <Row>
        <div>
          <label htmlFor="unchecked-2">
            <Text>{text('Checkbox Label 3', 'Checked')}</Text>
          </label>
          <Checkbox
            id="unchecked-2"
            onChange={action('Checkbox 3: onChange')}
            checked
          />
        </div>
        <div>
          <label htmlFor="unchecked-disabled-2">
            <Text>{text('Checkbox Label 4', 'Checked and Disabled')}</Text>
          </label>
          <Checkbox
            id="unchecked-disabled-2"
            onChange={action('Checkbox 4: onChange')}
            checked
            disabled
          />
        </div>
      </Row>
    </Container>
    <DarkThemeProvider>
      <Container darkMode>
        <Row>
          <div>
            <label htmlFor="unchecked-3">
              <Text>{text('Checkbox Label 1', 'Normal')}</Text>
            </label>
            <Checkbox
              id="unchecked-3"
              onChange={action('Checkbox 5: onChange')}
            />
          </div>
          <div>
            <label htmlFor="unchecked-disabled-3">
              <Text>{text('Checkbox Label 2', 'Disabled')}</Text>
            </label>
            <Checkbox
              id="unchecked-disabled-3"
              onChange={action('Checkbox 6: onChange')}
              disabled
            />
          </div>
        </Row>
        <Row>
          <div>
            <label htmlFor="unchecked-4">
              <Text>{text('Checkbox Label 3', 'Checked')}</Text>
            </label>
            <Checkbox
              id="unchecked-4"
              onChange={action('Checkbox 7: onChange')}
              checked
            />
          </div>
          <div>
            <label htmlFor="unchecked-disabled-4">
              <Text>{text('Checkbox Label 4', 'Checked and Disabled')}</Text>
            </label>
            <Checkbox
              id="unchecked-disabled-4"
              onChange={action('Checkbox 8: onChange')}
              checked
              disabled
            />
          </div>
        </Row>
      </Container>
    </DarkThemeProvider>
  </>
);
