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
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithTheme } from '../../../testUtils';

import Step1 from '../step1';
import { ConfigProvider } from '../../config';

function render() {
  const config = {
    demoStoryURL: 'bar',
  };

  return renderWithTheme(
    <ConfigProvider config={config}>
      <Step1 />
    </ConfigProvider>
  );
}

describe('Step 1', () => {
  it('should render', () => {
    render();

    expect(screen.getByText(/Get Started story/i)).toBeInTheDocument();
  });
});
