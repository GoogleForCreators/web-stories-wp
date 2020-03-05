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
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import theme from '../../../../theme';
import SimplePanel from '../simplePanel';

function arrange(children = null) {
  return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}

describe('Panels/Panel/SimplePanel', () => {
  it('should render <SimplePanel />', () => {
    const { getByText } = arrange(
      <SimplePanel name="simple-panel" title="Simple Panel">
        <div>{'Simple Panel Content'}</div>
      </SimplePanel>
    );

    const titleElement = getByText('Simple Panel');
    const contentElement = getByText('Simple Panel Content');

    expect(titleElement).toBeDefined();
    expect(contentElement).toBeDefined();
  });

  it('should simulate submit on <SimplePanel />', () => {
    const onSubmitMock = jest.fn();

    const { getByText } = arrange(
      <SimplePanel
        name="simple-panel"
        title="Simple Panel"
        onSubmit={onSubmitMock}
      >
        <div>{'Simple Panel Content'}</div>
      </SimplePanel>
    );

    const contentElement = getByText('Simple Panel Content');

    fireEvent.submit(contentElement.parentElement);

    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });
});
