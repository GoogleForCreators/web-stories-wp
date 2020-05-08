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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import WithMask from '../display';

describe('first test', () => {
  it('should not work', () => {
    const element = {
      id: '1',
      type: 'text',
      x: 0,
      y: 0,
      width: 100,
      height: 80,
      rotationAngle: 0,
      font: {
        family: 'Roboto',
      },
      fontSize: 20,
      content: 'hello world',
      mask: {
        type: 'heart',
      },
    };
    const box = {};

    // debugger;
    const { getByTestId } = render(
      <WithMask element={element} box={box} fill>
        <div data-testid="test">{'hello world!'}</div>
      </WithMask>
    );

    expect(getByTestId('test').textContent).toEqual('hello world!');
  });
});
