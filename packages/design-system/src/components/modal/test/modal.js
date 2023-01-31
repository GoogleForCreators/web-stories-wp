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
import ReactModal from 'react-modal';
import { screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderWithProviders } from '../../../testUtils/renderWithProviders';
import Modal from '../modal';

describe('DesignSystem/Components/Modal', () => {
  it('should not render a modal by default', () => {
    const { container } = renderWithProviders(
      <Modal onClose={jest.fn}>
        <p>{'modal child'}</p>
      </Modal>
    );
    ReactModal.setAppElement(container);

    expect(
      screen.queryByRole('dialog', { hidden: true })
    ).not.toBeInTheDocument();
  });

  it('should render a modal when isOpen is true', () => {
    const { container } = renderWithProviders(
      <Modal onClose={jest.fn} isOpen>
        <p>{'modal child'}</p>
      </Modal>
    );
    ReactModal.setAppElement(container);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
