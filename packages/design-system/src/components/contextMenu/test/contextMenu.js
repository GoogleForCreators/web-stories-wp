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
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { ContextMenu } from '..';
import * as ContextMenuComponents from '../components';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { noop } from '../../../utils';

const items = [
  { label: 'this is a button', onClick: noop },
  { label: 'this is a link', href: 'my-link' },
  { label: 'this is neither a button nor a link' },
];

describe('ContextMenu', () => {
  it('contextMenu should be invisible', () => {
    renderWithProviders(
      <ContextMenu>
        <ContextMenuComponents.MenuButton onClick={noop}>
          {'this is a button'}
        </ContextMenuComponents.MenuButton>
        <ContextMenuComponents.MenuLink href="/">
          {'this is a link'}
        </ContextMenuComponents.MenuLink>
        <ContextMenuComponents.MenuLabel>
          {'this is neither a button nor a link'}
        </ContextMenuComponents.MenuLabel>
      </ContextMenu>
    );

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.queryByRole('menuitem')).not.toBeInTheDocument();
  });

  it('contextMenu should be visible', () => {
    renderWithProviders(
      <ContextMenu isOpen>
        <ContextMenuComponents.MenuButton onClick={noop}>
          {'this is a button'}
        </ContextMenuComponents.MenuButton>
        <ContextMenuComponents.MenuLink href="/">
          {'this is a link'}
        </ContextMenuComponents.MenuLink>
        <ContextMenuComponents.MenuLabel>
          {'this is neither a button nor a link'}
        </ContextMenuComponents.MenuLabel>
      </ContextMenu>
    );

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('this is a button')).toBeInTheDocument();
    expect(screen.getByText('this is a link')).toBeInTheDocument();
  });

  it('clicking outside the context menu should call onDismiss', () => {
    const onDismiss = jest.fn();
    renderWithProviders(
      <div>
        <div data-testid="some-element" />
        <ContextMenu isOpen onDismiss={onDismiss}>
          <ContextMenuComponents.MenuButton onClick={noop}>
            {'this is a button'}
          </ContextMenuComponents.MenuButton>
          <ContextMenuComponents.MenuLink href="/">
            {'this is a link'}
          </ContextMenuComponents.MenuLink>
          <ContextMenuComponents.MenuLabel>
            {'this is neither a button nor a link'}
          </ContextMenuComponents.MenuLabel>
        </ContextMenu>
      </div>
    );

    const elementOutsideContextMenu = screen.getByTestId('some-element');

    fireEvent.mouseDown(elementOutsideContextMenu);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('right clicking outside the context menu should call onDismiss', () => {
    const onDismiss = jest.fn();
    renderWithProviders(
      <div>
        <div data-testid="some-element" />
        <ContextMenu isOpen onDismiss={onDismiss}>
          <ContextMenuComponents.MenuButton onClick={noop}>
            {'this is a button'}
          </ContextMenuComponents.MenuButton>
          <ContextMenuComponents.MenuLink href="/">
            {'this is a link'}
          </ContextMenuComponents.MenuLink>
          <ContextMenuComponents.MenuLabel>
            {'this is neither a button nor a link'}
          </ContextMenuComponents.MenuLabel>
        </ContextMenu>
      </div>
    );

    const elementOutsideContextMenu = screen.getByTestId('some-element');

    fireEvent.mouseDown(elementOutsideContextMenu, { button: 'right' });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should focus the first focusable element when the menu is opened', () => {
    // need menu to start closed since focus gets changed
    // when the menu goes from closed -> open
    const { rerender } = renderWithProviders(
      <ContextMenu isOpen={false}>
        <ContextMenuComponents.MenuButton onClick={noop}>
          {'this is a button'}
        </ContextMenuComponents.MenuButton>
        <ContextMenuComponents.MenuLink href="/">
          {'this is a link'}
        </ContextMenuComponents.MenuLink>
        <ContextMenuComponents.MenuLabel>
          {'this is neither a button nor a link'}
        </ContextMenuComponents.MenuLabel>
      </ContextMenu>
    );

    rerender(
      <ContextMenu isOpen>
        <ContextMenuComponents.MenuButton onClick={noop}>
          {'this is a button'}
        </ContextMenuComponents.MenuButton>
        <ContextMenuComponents.MenuLink href="/">
          {'this is a link'}
        </ContextMenuComponents.MenuLink>
        <ContextMenuComponents.MenuLabel>
          {'this is neither a button nor a link'}
        </ContextMenuComponents.MenuLabel>
      </ContextMenu>
    );

    // opening the menu should focus the first focusable item
    const [button] = screen.queryAllByRole('menuitem', {
      name: items[0].label,
    });

    expect(button).toHaveFocus();
  });
});
