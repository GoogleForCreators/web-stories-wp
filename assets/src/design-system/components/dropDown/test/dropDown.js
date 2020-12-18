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
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { DropDown } from '../';
import { basicDropDownOptions } from '../stories/sampleData';

describe('DropDown <DropDown />', () => {
  it('should render a closed <DropDown /> menu with a select button on default', () => {
    const { getByRole, queryAllByRole } = renderWithProviders(
      <DropDown options={basicDropDownOptions} dropDownLabel={'label'} />
    );

    const select = getByRole('button');
    expect(select).toBeDefined();

    const menu = queryAllByRole('listbox');
    expect(menu).toHaveLength(0);
  });

  it('should show placeholder value when no selected value is found', () => {
    const { getByText } = renderWithProviders(
      <DropDown options={basicDropDownOptions} placeholder={'select a value'} />
    );

    const placeholder = getByText('select a value');
    expect(placeholder).toBeDefined();
  });

  it("should show selectedValue's associated label when selectedValue is present", () => {
    const { getByText } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'label'}
        selectedValue={basicDropDownOptions[2].value}
      />
    );

    const select = getByText(basicDropDownOptions[2].label);
    expect(select).toBeDefined();
  });

  it("should show placeholder when selectedValue's associated label cannot be found", () => {
    const { getByText } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'label'}
        selectedValue={'value that is not found in items'}
      />
    );

    const select = getByText('select a value');
    expect(select).toBeDefined();
  });

  it('should show label value when provided', () => {
    const { getByText } = renderWithProviders(
      <DropDown
        options={basicDropDownOptions}
        placeholder={'select a value'}
        dropDownLabel={'my label'}
      />
    );

    const label = getByText('my label');
    expect(label).toBeDefined();
  });
});
