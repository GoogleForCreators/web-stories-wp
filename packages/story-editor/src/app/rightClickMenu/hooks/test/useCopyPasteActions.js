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
import { useCopyPasteActions } from '..';
import { useStory } from '../../..';
import { ACTION_TYPES } from '../../reducer';
import { getElementStyles } from '../utils';
import { COPIED_ELEMENT, ELEMENT } from './constants';

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: jest.fn(),
}));
jest.mock('@googleforcreators/tracking'); // should be mocked in the testing env.
jest.mock('../../../story/useStory');

const mockUseStory = useStory;
const mockUseSnackbar = useSnackbar;

const mockDispatch = jest.fn();
const mockShowSnackbar = jest.fn();
const mockAddAnimations = jest.fn();
const mockUpdateElementsById = jest.fn();

const ANIMATION = { id: 'animation-1' };

describe('useCopyPasteActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue({
      addAnimations: mockAddAnimations,
      selectedElement: ELEMENT,
      selectedElementAnimations: [ANIMATION],
      updateElementsById: mockUpdateElementsById,
      // needed for `useRichTextFormatting`
      selectedElements: [ELEMENT],
    });
    mockUseSnackbar.mockReturnValue({ showSnackbar: mockShowSnackbar });
  });

  it('should copy styles and show a confirmation snackbar', () => {
    const { result } = renderHook(() => useCopyPasteActions(mockDispatch));

    result.current.onCopyStyles();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: ACTION_TYPES.COPY_ELEMENT_STYLES,
      payload: {
        animations: [{ id: 'animation-1' }],
        type: 'image',
        styles: getElementStyles(ELEMENT),
      },
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Copied style.',
        actionLabel: 'Undo',
      })
    );
  });

  it('should paste styles and show a confirmation snackbar', () => {
    const { result } = renderHook(() =>
      useCopyPasteActions(mockDispatch, COPIED_ELEMENT)
    );

    result.current.onPasteStyles();

    // Pasting styles is a multiple step process
    // 1. Update styles on element in story
    // 2. Delete existing animation on target element
    // 3. Add new animations

    expect(mockUpdateElementsById).toHaveBeenCalledWith({
      elementIds: [ELEMENT.id],
      properties: expect.any(Function),
    });

    // Need to call updater fn that is passed to `updateElementById`
    // to see what is being updated.
    const updatedStyles = mockUpdateElementsById.mock.calls[0][0].properties();

    // verify old animation deleted
    // verify styles copied
    expect(updatedStyles).toStrictEqual({
      ...COPIED_ELEMENT.styles,
      animation: { ...ANIMATION, delete: true },
    });

    // verify new animation added
    expect(mockAddAnimations).toHaveBeenCalledWith({
      animations: [
        {
          ...COPIED_ELEMENT.animations[0],
          id: expect.any(String),
          targets: [ELEMENT.id],
        },
      ],
    });

    // verify snackbar showing
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Pasted style.',
        actionLabel: 'Undo',
      })
    );
  });
});
