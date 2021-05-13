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
import { act, fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { ContextMenu } from '..';
import { MenuItem, linkOrButtonValidator } from '../menuItem';
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import { noop } from '../../../utils';

const items = [
  { label: 'this is a button', onClick: noop },
  { label: 'this is a link', href: 'my-link' },
  { label: 'this is neither a button nor a link' },
];

describe('ContextMenu', () => {
  it('contextMenu should be invisible', () => {
    renderWithProviders(<ContextMenu items={items} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('contextMenu should be visible', () => {
    renderWithProviders(<ContextMenu items={items} isOpen />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('clicking away from context menu should call onDismiss', () => {
    const onDismiss = jest.fn();
    renderWithProviders(
      <ContextMenu items={items} isOpen onDismiss={onDismiss} />
    );

    const mask = screen.getByTestId('context-menu-mask');
    act(() => {
      fireEvent.click(mask);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('should focus the first focusable element when the menu is opened', () => {
    // need menu to start closed since focus gets changed
    // when the menu goes from closed -> open
    const { rerender } = renderWithProviders(
      <ContextMenu isOpen={false} items={items} />
    );

    rerender(<ContextMenu isOpen items={items} />);

    // opening the menu should focus the first focusable item
    const firstButton = screen.queryByRole('button', { name: items[0].label });
    expect(firstButton).toHaveFocus();
  });
});

describe('MenuItem', () => {
  it('should render a button if `onClick` is passed as a prop', () => {
    renderWithProviders(<MenuItem label="my label" onClick={noop} />);

    expect(screen.getByText('my label')).toBeInTheDocument();
    expect(screen.queryByRole('button')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should render a link if `href` is passed as a prop', () => {
    renderWithProviders(<MenuItem label="my label" href="test" />);

    expect(screen.getByText('my label')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeInTheDocument();
  });

  it('should render a div if neither `onClick` nor `href` are passed as props', () => {
    renderWithProviders(<MenuItem label="my label" />);

    expect(screen.getByText('my label')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should call onClick and onDismiss when a clickable item is clicked', () => {
    const onClick = jest.fn();
    const onDismiss = jest.fn();
    renderWithProviders(
      <MenuItem label="my label" onClick={onClick} onDismiss={onDismiss} />
    );

    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe('linkOrButtonValidator', () => {
  it('should return null if `href` included without `disabled`', () => {
    expect(linkOrButtonValidator({ href: 'test' }, '', 'Test')).toBeNull();
  });

  it('should throw an error if `href` and `disabled` are both included', () => {
    expect(
      linkOrButtonValidator({ disabled: true, href: 'test' }, '', 'Test')
    ).toStrictEqual(expect.any(Error));
  });

  it('should throw an error if `newTab=true` but `href` is not specified', () => {
    expect(linkOrButtonValidator({ newTab: true }, '', 'Test')).toStrictEqual(
      expect.any(Error)
    );
  });
});
