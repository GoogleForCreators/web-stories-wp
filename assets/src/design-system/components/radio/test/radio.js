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
 * Internal dependencies
 */
import { noop } from '../../../utils';
import { Radio } from '../radio';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';

describe('Radio', () => {
  it('should render a radio button', () => {
    const { getByRole } = renderWithProviders(
      <Radio onChange={noop} value="1" />
    );

    expect(getByRole('radio')).toBeInTheDocument();
  });

  it('should render a label', () => {
    const { getByText } = renderWithProviders(
      <Radio label="this is my label" onChange={noop} value="1" />
    );

    expect(getByText('this is my label')).toBeInTheDocument();
  });

  it('should render a hint', () => {
    const { getByText } = renderWithProviders(
      <Radio hint="this is my hint" onChange={noop} value="1" />
    );

    expect(getByText('this is my hint')).toBeInTheDocument();
  });
});
