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
import { render, screen } from '@testing-library/react';
/**
 * Internal dependencies
 */
import { findFocusableChildren } from '../menu';

describe('findFocusableChildren', () => {
  it('should return a flat list of all focusable html elements', () => {
    render(
      <div role="menu">
        <button data-testid="direct-child">{'button 1'}</button>
        <button data-testid="direct-child">{'button 2'}</button>
        <a data-testid="direct-child" href="/">
          {'anchor 1'}
        </a>
        <a data-testid="direct-child" href="/">
          {'anchor 2'}
        </a>
        <div data-testid="direct-child">{'div 1'}</div>
        <div data-testid="direct-child">{'div 2'}</div>
        <div data-testid="direct-child" role="group">
          {'empty group'}
        </div>
        <div data-testid="direct-child" role="group">
          <button>{'nested button 1'}</button>
          <a href="/">{'nested anchor 1'}</a>
        </div>
        <div data-testid="direct-child" role="group">
          <button>{'nested button 2'}</button>
          <a href="/">{'nested anchor 2'}</a>
          <div role="group">
            <button>{'doubly nested button'}</button>
            <a href="/">{'doubly nested anchor'}</a>
          </div>
        </div>
      </div>
    );

    const children = screen.getAllByTestId('direct-child');

    const focusableChildren = children
      .reduce(findFocusableChildren, [])
      .map((element) => element.textContent);

    // Should only contain text from 'focusable' nodes (anchors and buttons).
    expect(focusableChildren).toStrictEqual([
      'button 1',
      'button 2',
      'anchor 1',
      'anchor 2',
      'nested button 1',
      'nested anchor 1',
      'nested button 2',
      'nested anchor 2',
      'doubly nested button',
      'doubly nested anchor',
    ]);
  });
});
