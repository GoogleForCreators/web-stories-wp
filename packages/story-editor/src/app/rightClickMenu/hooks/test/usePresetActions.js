/*
 * Copyright 2022 Google LLC
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
import { useSnackbar } from '@googleforcreators/design-system';
import { renderHook } from '@testing-library/react-hooks';

/**
 * Internal dependencies
 */
import useAddPreset from '../../../../utils/useAddPreset';
import { useStory } from '../../..';
import { usePresetActions } from '..';
import { ELEMENT } from './testUtils';

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: jest.fn(),
}));
jest.mock('@googleforcreators/tracking'); // should be mocked in the testing env.
jest.mock('../../../../utils/useAddPreset');
jest.mock('../../../../components/colorPicker/useDeleteColor', () => ({
  __esModule: true,
  default: jest.fn(() => ({ deleteGlobalPreset: jest.fn() })),
}));
jest.mock('../../../../components/styleManager/useDeleteStyle');
jest.mock('../../../story/useStory');

const mockUseAddPreset = useAddPreset;
const mockUseStory = useStory;
const mockUseSnackbar = useSnackbar;

const mockAddGlobalPreset = jest.fn();
const mockShowSnackbar = jest.fn();

describe('usePresetActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue(ELEMENT);
    mockUseAddPreset.mockReturnValue({ addGlobalPreset: mockAddGlobalPreset });
    mockUseSnackbar.mockReturnValue(mockShowSnackbar);
  });

  it('should add a text preset and show a confirmation snackbar', () => {
    const { result } = renderHook(() => usePresetActions());

    result.current.handleAddTextPreset();

    expect(mockAddGlobalPreset).toHaveBeenCalledTimes(1);

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        actionLabel: 'Undo',
        message: 'Saved style to "Saved Styles".',
      })
    );
  });

  it('should add a color preset and show a confirmation snackbar', () => {
    const { result } = renderHook(() => usePresetActions());

    result.current.handleAddColorPreset(4);

    expect(mockAddGlobalPreset).toHaveBeenCalledTimes(1);

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        actionLabel: 'Undo',
        message: 'Added color to "Saved Colors".',
      })
    );
  });
});
