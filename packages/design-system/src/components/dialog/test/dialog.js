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
import Modal from 'react-modal';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import Dialog from '../dialog';

describe('DesignSystem/Components/Dialog', () => {
  it('should not render a dialog by default', () => {
    const { container } = renderWithProviders(
      <Dialog onClose={jest.fn}>
        <p>{'dialog child'}</p>
      </Dialog>
    );

    Modal.setAppElement(container);

    expect(
      screen.queryByRole('dialog', { hidden: true })
    ).not.toBeInTheDocument();
  });

  it('should render a dialog when isOpen is true', () => {
    const mockButtonClick = jest.fn();
    const ActionsNode = (
      <button onClick={mockButtonClick}>{'dialog button'}</button>
    );

    const { container } = renderWithProviders(
      <Dialog
        onClose={jest.fn}
        isOpen
        title="dialog title"
        actions={ActionsNode}
      >
        <p>{'dialog child'}</p>
      </Dialog>
    );

    Modal.setAppElement(container);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const dialogButton = screen.getByText('dialog button');

    fireEvent.click(dialogButton);
    expect(mockButtonClick).toHaveBeenCalledOnce();
  });
});
