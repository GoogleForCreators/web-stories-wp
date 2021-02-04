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
import { fireEvent } from '@testing-library/react';

/**
 * Internal dependencies
 */
import LayerStyle from '../layerStyle';
import { MULTIPLE_DISPLAY_VALUE } from '../../../../../constants';
import { renderPanel } from '../../../shared/test/_utils';

describe('Panels/LayerStyle', () => {
  const defaultElement = { id: 1, opacity: 100 };

  function renderLayerStyle(...args) {
    return renderPanel(LayerStyle, ...args);
  }

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:layerStyle',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  it('should render <LayerStyle /> panel', () => {
    const { getByRole } = renderLayerStyle([
      { ...defaultElement, opacity: 100 },
    ]);
    const element = getByRole('button', { name: 'Layer' });
    expect(element).toBeInTheDocument();
  });

  it('should set opacity to 100 if not set', () => {
    const { getByRole } = renderLayerStyle([{}]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    expect(input).toHaveValue('100%');
  });

  it('should set opacity to 0 if set to 0', () => {
    const { getByRole } = renderLayerStyle([{ ...defaultElement, opacity: 0 }]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    expect(input).toHaveValue('0%');
  });

  it('should set opacity to 49 if set to 49', () => {
    const { getByRole } = renderLayerStyle([
      { ...defaultElement, opacity: 49 },
    ]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    expect(input).toHaveValue('49%');
  });

  it('should update opacity value on change', () => {
    const { getByRole, pushUpdate } = renderLayerStyle([
      { ...defaultElement, opacity: 49 },
    ]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    fireEvent.change(input, { target: { value: '23' } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    expect(pushUpdate).toHaveBeenCalledWith({ opacity: 23 });
  });

  it('should set min to opacity value on change', () => {
    const { getByRole, submit } = renderLayerStyle([
      { ...defaultElement, opacity: 49 },
    ]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    fireEvent.change(input, { target: { value: null } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    const submits = submit({ opacity: null });
    expect(submits[defaultElement.id]).toStrictEqual({
      opacity: 0,
    });
  });

  it('should set max to opacity value on change to max', () => {
    const { getByRole, submit } = renderLayerStyle([
      { ...defaultElement, opacity: 49 },
    ]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    fireEvent.change(input, { target: { value: 101 } });
    fireEvent.keyDown(input, { key: 'Enter', which: 13 });
    const submits = submit({ opacity: 101 });
    expect(submits[defaultElement.id]).toStrictEqual({
      opacity: 100,
    });
  });

  it('should display mixed in case of multi-selection with different values', () => {
    const { getByRole } = renderLayerStyle([
      { ...defaultElement, opacity: 50 },
      { id: 2, opacity: 80 },
    ]);
    const input = getByRole('textbox', { name: 'Opacity in percentage' });
    expect(input.placeholder).toStrictEqual(MULTIPLE_DISPLAY_VALUE);
    expect(input).toHaveValue('');
  });
});
