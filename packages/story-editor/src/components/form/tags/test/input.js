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
import { fireEvent, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-internal-modules -- Importing testUtils is OK.
import { renderWithProviders } from '@googleforcreators/design-system/src/testUtils';

/**
 * Internal dependencies
 */
import { noop } from '../../../../utils/noop';
import Input from '../input';

const baseProps = {
  suggestedTerms: [
    { id: 1, name: 'adventure' },
    { id: 2, name: 'ace ventura' },
    { id: 3, name: 'advent' },
  ],
  onTagsChange: noop,
  onInputChange: noop,
  suggestedTermsLabel: 'Taxonomy - Terms - Label',
  tagDisplayTransformer: noop,
  tokens: [],
  name: 'input name',
  onUndo: noop,
};

describe('Input', () => {
  it('should call `onUndo` when meta+z is pressed', () => {
    const mockUndo = jest.fn();

    renderWithProviders(<Input {...baseProps} onUndo={mockUndo} />);

    const input = screen.getByRole('combobox');

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'z', metaKey: true });

    expect(mockUndo).toHaveBeenCalledTimes(1);
  });

  it('should show suggestion list when suggestedTerms length is greater than 0', () => {
    renderWithProviders(<Input {...baseProps} />);
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();

    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();
  });

  it('should not render suggestion list when list is empty', () => {
    renderWithProviders(<Input {...baseProps} suggestedTerms={[]} />);
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should move focus through list with down and up arrows', () => {
    renderWithProviders(<Input {...baseProps} />);
    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();
    const menu = screen.getByRole('listbox');
    expect(menu).toBeInTheDocument();

    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: 40 });
    const listItems = screen.queryAllByRole('option');
    expect(listItems[0]).toHaveFocus();
    fireEvent.keyDown(listItems[0], { key: 'ArrowDown', keyCode: 40 });
    expect(listItems[1]).toHaveFocus();
    fireEvent.keyDown(listItems[1], { key: 'ArrowUp', keyCode: 38 });
    expect(listItems[0]).toHaveFocus();
  });

  it('should return focus to input from suggestion list', () => {
    renderWithProviders(<Input {...baseProps} />);
    const input = screen.getByRole('combobox');
    const listItems = screen.queryAllByRole('option');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: 40 });
    expect(listItems[0]).toHaveFocus();
    fireEvent.keyDown(listItems[0], { key: 'ArrowUp', keyCode: 38 });
    expect(input).toHaveFocus();
  });

  it('should call handler when "enter" key is hit while focused on a suggestion', () => {
    const handleTagsChange = jest.fn();
    renderWithProviders(
      <Input {...baseProps} onTagsChange={handleTagsChange} />
    );
    const input = screen.getByRole('combobox');
    const listItems = screen.queryAllByRole('option');
    fireEvent.focus(input);
    fireEvent.keyDown(input, { key: 'ArrowDown', keyCode: 40 });
    fireEvent.keyDown(listItems[0], { key: 'Enter', keyCode: 13 });
    expect(handleTagsChange).toHaveBeenCalledWith([
      baseProps.suggestedTerms[0].name,
    ]);
  });
});
