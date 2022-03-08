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
import { renderWithTheme } from '../../../../testUtils';
import Trim from '../trim';
import mockUseVideoElementTranscoding from '../../../../app/media/utils/useVideoElementTranscoding';

jest.mock('../../../../app/media/utils/useVideoElementTranscoding', () =>
  jest.fn()
);
jest.mock('../shared/useProperties', () =>
  jest.fn().mockImplementation(() => ({}))
);
jest.mock('../shared/icon', () =>
  jest.fn().mockImplementation(function MockButton({ title, Icon, ...rest }) {
    return (
      <button role="menuitem" {...rest}>
        {title}
      </button>
    );
  })
);

describe('Design Menu: Trim video', () => {
  it('should not render if trim is not possible', () => {
    mockUseVideoElementTranscoding.mockImplementationOnce(() => ({
      state: { canTrim: false },
      actions: {},
    }));
    renderWithTheme(<Trim />);
    const trim = screen.queryByRole('menuitem', { name: 'Trim video' });
    expect(trim).not.toBeInTheDocument();
  });

  it('should render if trim is possible', () => {
    mockUseVideoElementTranscoding.mockImplementationOnce(() => ({
      state: { canTrim: true },
      actions: {},
    }));
    renderWithTheme(<Trim />);
    const trim = screen.getByRole('menuitem', { name: 'Trim video' });
    expect(trim).toBeInTheDocument();
  });

  it('should render as disabled with alternate title if trim is ongoing', () => {
    mockUseVideoElementTranscoding.mockImplementationOnce(() => ({
      state: { canTrim: true, isTrimming: true },
      actions: {},
    }));
    renderWithTheme(<Trim />);
    const trim = screen.getByRole('menuitem', { name: 'Trimming video' });
    expect(trim).toBeInTheDocument();
    expect(trim).toBeDisabled();
  });

  it('should render as disabled if other transcoding is ongoing', () => {
    mockUseVideoElementTranscoding.mockImplementationOnce(() => ({
      state: { canTrim: true, isDisabled: true },
      actions: {},
    }));
    renderWithTheme(<Trim />);
    const trim = screen.getByRole('menuitem', { name: 'Trim video' });
    expect(trim).toBeInTheDocument();
    expect(trim).toBeDisabled();
  });

  it('should invoke trim function when clicked', () => {
    const handleTrim = jest.fn();
    mockUseVideoElementTranscoding.mockImplementationOnce(() => ({
      state: { canTrim: true },
      actions: { handleTrim },
    }));
    renderWithTheme(<Trim />);
    const trim = screen.getByRole('menuitem', { name: 'Trim video' });
    fireEvent.click(trim);
    expect(handleTrim).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' })
    );
  });
});
