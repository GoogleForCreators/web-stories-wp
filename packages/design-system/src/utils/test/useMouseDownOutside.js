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
import { render, fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import useMouseDownOutsideRef from '../useMouseDownOutsideRef';

describe('useMouseDownOutsideRef', () => {
  const TestComponent = ({
    handleMouseDownOutside,

    childTestId = 'child',

    containerTestId = 'container',
  }) => {
    const ref = useMouseDownOutsideRef(handleMouseDownOutside);
    return (
      <div ref={ref} data-testid={containerTestId}>
        <button data-testid={childTestId}>{'click me!'}</button>
      </div>
    );
  };

  it('fires when a user mouses down outside of the referenced node', () => {
    const handleMouseDownOutside = jest.fn();
    render(
      <div>
        <div data-testid="some-element" />
        <TestComponent handleMouseDownOutside={handleMouseDownOutside} />
      </div>
    );

    const elementOutsideContextMenu = screen.getByTestId('some-element');

    fireEvent.mouseDown(elementOutsideContextMenu);

    expect(handleMouseDownOutside).toHaveBeenCalledTimes(1);
  });

  it('does not fire when a user mouses down on the referenced node', () => {
    const handleMouseDownOutside = jest.fn();
    const containerTestId = 'containerTestId';
    render(
      <div>
        <div data-testid="some-element" />
        <TestComponent
          handleMouseDownOutside={handleMouseDownOutside}
          containerTestId={containerTestId}
        />
      </div>
    );

    const containerNode = screen.getByTestId(containerTestId);

    fireEvent.mouseDown(containerNode);

    expect(handleMouseDownOutside).toHaveBeenCalledTimes(0);
  });

  it('does not fire when a user mouses down on a child of the referenced node', () => {
    const handleMouseDownOutside = jest.fn();
    const childTestId = 'childTestId';
    render(
      <div>
        <div data-testid="some-element" />
        <TestComponent
          handleMouseDownOutside={handleMouseDownOutside}
          childTestId={childTestId}
        />
      </div>
    );

    const childNode = screen.getByTestId(childTestId);

    fireEvent.mouseDown(childNode);

    expect(handleMouseDownOutside).toHaveBeenCalledTimes(0);
  });
});
