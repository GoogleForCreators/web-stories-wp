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
import useHandlers from '../useHandlers';

describe('useHandlers', () => {
  let handlers, registerHandler;
  let handler1, handler2;

  beforeEach(() => {
    handler1 = jest.fn();
    handler2 = jest.fn();
    render(<Comp />);
  });

  function Comp() {
    const result = useHandlers();
    handlers = result[0];
    registerHandler = result[1];
    return <div />;
  }

  it('should add/remove any number of handlers and remain invariant', () => {
    expect(handlers).toStrictEqual([]);

    const cleanup1 = registerHandler(handler1);
    expect(handlers).toStrictEqual([handler1]);

    const cleanup2 = registerHandler(handler2);
    expect(handlers).toStrictEqual([handler1, handler2]);

    cleanup1();
    expect(handlers).toStrictEqual([handler2]);

    cleanup2();
    expect(handlers).toStrictEqual([]);
  });
});
