/*
 * Copyright 2022 Google LLC
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
import { Checkbox } from '..';
import { Text } from '../../typography';
import { DarkThemeProvider } from '../../../storybookUtils';

export default {
  title: 'DesignSystem/Components/Checkbox',
  component: Checkbox,
  args: {
    checkboxLabel1: 'Normal',
    checkboxLabel2: 'Disabled',
    checkboxLabel3: 'Checked',
    checkboxLabel4: 'Checked and Disabled',
  },
  argTypes: {
    checkboxLabel1: { name: 'Label 1' },
    checkboxLabel2: { name: 'Label 2' },
    checkboxLabel3: { name: 'Label 3' },
    checkboxLabel4: { name: 'Label 4' },
    handleChange: { action: 'checkbox changed' },
  },
};

const Container = styled.div`
  display: grid;
  row-gap: 20px;
  max-width: 500px;
  padding: 20px 50px;
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.standard.black};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column: 1 / -1;
  grid-row-gap: 16px;

  > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column: 1 / -1;
    vertical-align: middle;
  }

  label {
    display: flex;
    align-items: center;
  }
`;

export const _default = {
  render: function Render(args) {
    const [formState, setFormState] = useState({
      one: false,
      two: true,
      three: false,
      four: true,
      disabledOne: false,
      disabledTwo: true,
      disabledThree: false,
      disabledFour: true,
    });

    const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.checked;

      args.handleChange(event.target.name, event);
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };

    return (
      <>
        <Container>
          <Row>
            <div>
              <label htmlFor="one">
                <Text.Span>{args.checkboxLabel1}</Text.Span>
              </label>
              <Checkbox
                id="one"
                name="one"
                checked={formState.one}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="disabledOne">
                <Text.Span>{args.checkboxLabel2}</Text.Span>
              </label>
              <Checkbox
                id="disabledOne"
                name="disabledOne"
                checked={formState.disabledOne}
                onChange={handleChange}
                disabled
              />
            </div>
          </Row>
          <Row>
            <div>
              <label htmlFor="two">
                <Text.Span>{args.checkboxLabel3}</Text.Span>
              </label>
              <Checkbox
                id="two"
                name="two"
                checked={formState.two}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="disabledTwo">
                <Text.Span>{args.checkboxLabel4}</Text.Span>
              </label>
              <Checkbox
                id="disabledTwo"
                name="disabledTwo"
                checked={formState.disabledTwo}
                onChange={handleChange}
                disabled
              />
            </div>
          </Row>
        </Container>
        <DarkThemeProvider>
          <Container darkMode>
            <Row>
              <div>
                <label htmlFor="three">
                  <Text.Span>{args.checkboxLabel1}</Text.Span>
                </label>
                <Checkbox
                  id="three"
                  name="three"
                  checked={formState.three}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="disabledThree">
                  <Text.Span>{args.checkboxLabel2}</Text.Span>
                </label>
                <Checkbox
                  id="disabledThree"
                  name="disabledThree"
                  checked={formState.disabledThree}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </Row>
            <Row>
              <div>
                <label htmlFor="four">
                  <Text.Span>{args.checkboxLabel3}</Text.Span>
                </label>
                <Checkbox
                  id="four"
                  name="four"
                  checked={formState.four}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="disabledFour">
                  <Text.Span>{args.checkboxLabel4}</Text.Span>
                </label>
                <Checkbox
                  id="disabledFour"
                  name="disabledFour"
                  checked={formState.disabledFour}
                  onChange={handleChange}
                  disabled
                />
              </div>
            </Row>
          </Container>
        </DarkThemeProvider>
      </>
    );
  },
};
