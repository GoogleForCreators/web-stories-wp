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
import CardTitle from '../cardTitle';
import { renderWithTheme } from '../../../testUtils';

describe('CardTitle', () => {
  it('should render Card Title with static text when edit mode is false', () => {
    const { getByText, queryByTestId } = renderWithTheme(
      <CardTitle
        title="Sample Story"
        modifiedDate="July 13"
        onEditCancel={jest.fn()}
        onEditComplete={jest.fn}
        editMode={false}
      />
    );

    expect(queryByTestId('title-rename-input')).toBeNull();
    expect(getByText('Sample Story')).toBeDefined();
  });

  it('should render Card Title with an input field when edit mode is true', () => {
    const { getByTestId } = renderWithTheme(
      <CardTitle
        title="Sample Story"
        modifiedDate="July 13"
        onEditCancel={jest.fn()}
        onEditComplete={jest.fn}
        editMode={true}
      />
    );

    expect(getByTestId('title-rename-input')).toBeDefined();
  });
});
