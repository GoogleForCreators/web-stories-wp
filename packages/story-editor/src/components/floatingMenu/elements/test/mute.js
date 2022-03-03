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
import Mute from '../mute';
import mockUseVideoTranscoding from '../shared/useVideoTranscoding';

jest.mock('../shared/useVideoTranscoding', () => jest.fn());
jest.mock('../shared/icon', () =>
  jest.fn().mockImplementation(function MockButton({ title, Icon, ...rest }) {
    return (
      <button role="menuitem" {...rest}>
        {title}
      </button>
    );
  })
);

describe('Design Menu: Mute video', () => {
  it('should not render if mute is not possible', () => {
    mockUseVideoTranscoding.mockImplementationOnce(() => ({
      canMute: false,
    }));
    renderWithTheme(<Mute />);
    const mute = screen.queryByRole('menuitem', { name: 'Remove audio' });
    expect(mute).not.toBeInTheDocument();
  });

  it('should render if mute is possible', () => {
    mockUseVideoTranscoding.mockImplementationOnce(() => ({
      canMute: true,
    }));
    renderWithTheme(<Mute />);
    const mute = screen.getByRole('menuitem', { name: 'Remove audio' });
    expect(mute).toBeInTheDocument();
  });

  it('should render as disabled with alternate title if mute is ongoing', () => {
    mockUseVideoTranscoding.mockImplementationOnce(() => ({
      canMute: true,
      isMuting: true,
    }));
    renderWithTheme(<Mute />);
    const mute = screen.getByRole('menuitem', { name: 'Removing audio' });
    expect(mute).toBeInTheDocument();
    expect(mute).toBeDisabled();
  });

  it('should render as disabled if other transcoding is ongoing', () => {
    mockUseVideoTranscoding.mockImplementationOnce(() => ({
      canMute: true,
      isDisabled: true,
    }));
    renderWithTheme(<Mute />);
    const mute = screen.getByRole('menuitem', { name: 'Remove audio' });
    expect(mute).toBeInTheDocument();
    expect(mute).toBeDisabled();
  });

  it('should invoke mute function when clicked', () => {
    const handleMute = jest.fn();
    mockUseVideoTranscoding.mockImplementationOnce(() => ({
      canMute: true,
      handleMute,
    }));
    renderWithTheme(<Mute />);
    const mute = screen.getByRole('menuitem', { name: 'Remove audio' });
    fireEvent.click(mute);
    expect(handleMute).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click' })
    );
  });
});
