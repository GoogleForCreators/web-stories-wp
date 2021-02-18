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
import { Input, labelAccessibilityValidator } from '../';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('Input', () => {
  it('should render the input', () => {
    const { getByPlaceholderText } = renderWithProviders(
      <Input aria-label="test" placeholder="my placeholder" />
    );

    expect(getByPlaceholderText('my placeholder')).toBeInTheDocument();
  });

  it('should render a label', () => {
    const { getByText } = renderWithProviders(
      <Input label="This is my input label" />
    );

    expect(getByText('This is my input label')).toBeInTheDocument();
  });

  it('should render a hint', () => {
    const { getByText } = renderWithProviders(
      <Input aria-label="test" hint="This is my input hint" />
    );

    expect(getByText('This is my input hint')).toBeInTheDocument();
  });

  it('should render a suffix', () => {
    const { getByText } = renderWithProviders(
      <Input aria-label="test" suffix="suffix" />
    );

    const suffixElement = getByText('suffix');

    expect(suffixElement).toBeInTheDocument();
  });
});

describe('labelAccessibilityValidator', () => {
  it('should return null if `label` or `aria-label` are passed in as a prop', () => {
    expect(
      labelAccessibilityValidator({ label: 'test' }, '', 'Test')
    ).toBeNull();
    expect(
      labelAccessibilityValidator({ 'aria-label': 'test' }, '', 'Test')
    ).toBeNull();
    expect(
      labelAccessibilityValidator(
        { label: 'test', 'aria-label': 'test' },
        '',
        'Test'
      )
    ).toBeNull();
  });

  it.each`
    propName
    ${'label'}
    ${'aria-label'}
  `('should throw an error if `label` is not a string type', ({ propName }) => {
    expect(
      labelAccessibilityValidator({ [propName]: 2 }, '', 'Test')
    ).toStrictEqual(expect.any(Error));
  });
});
