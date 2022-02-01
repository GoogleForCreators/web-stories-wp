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
import { act, renderHook } from '@testing-library/react-hooks';
/**
 * Internal dependencies
 */
import { useCopyPasteActions } from '..';
import { useStory } from '../../..';
import { getElementStyles } from '../utils';
import { ELEMENT } from './testUtils';

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: jest.fn(),
}));
jest.mock('@googleforcreators/tracking'); // should be mocked in the testing env.
jest.mock('../../../story/useStory');

const mockUseStory = useStory;
const mockUseSnackbar = useSnackbar;

const mockShowSnackbar = jest.fn();
const mockAddAnimations = jest.fn();
const mockUpdateElementsById = jest.fn();

const ANIMATION = {
  targets: [ELEMENT.id],
  id: 'element-animation',
  type: 'effect-pulse',
  scale: 0.5,
  iterations: 1,
  duration: 1450,
  delay: 0,
};

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
    const { result } = renderHook(() => useCopyPasteActions());

    expect(result.current.copiedElementType).toBeUndefined();

    act(() => {
      result.current.onCopyStyles();
    });

    expect(result.current.copiedElementType).toStrictEqual(ELEMENT.type);

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Copied style.',
        actionLabel: 'Undo',
      })
    );
  });

  it('should paste styles and show a confirmation snackbar', () => {
    const { result } = renderHook(() => useCopyPasteActions());

    // copy element first
    act(() => {
      result.current.onCopyStyles();
    });

    // paste element
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
      ...getElementStyles(ELEMENT),
      animation: { ...ANIMATION, delete: true },
    });

    // verify new animation added
    expect(mockAddAnimations).toHaveBeenCalledWith({
      animations: [
        {
          ...ANIMATION,
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
