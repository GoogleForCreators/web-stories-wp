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
import objectPick from '../../../../utils/objectPick';
import { useStory } from '../../..';
import { ATTRIBUTES_TO_COPY } from '../../../story/useStoryReducer/reducers/copyElementById';
import { ELEMENT } from './testUtils';

jest.mock('@googleforcreators/design-system', () => ({
  ...jest.requireActual('@googleforcreators/design-system'),
  useSnackbar: jest.fn(),
}));
jest.mock('@googleforcreators/tracking'); // should be mocked in the testing env.
jest.mock('../../../story/useStory');

const mockUseStory = useStory;
const mockUseSnackbar = useSnackbar;

const mockCopyElementById = jest.fn();
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

const defaultStoryState = {
  addAnimations: mockAddAnimations,
  copyElementById: mockCopyElementById,
  selectedElement: ELEMENT,
  selectedElementAnimations: [ANIMATION],
  updateElementsById: mockUpdateElementsById,
  // needed for `useRichTextFormatting`
  selectedElements: [ELEMENT],
};

describe('useCopyPasteActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseStory.mockReturnValue(defaultStoryState);
    mockUseSnackbar.mockReturnValue(mockShowSnackbar);
  });

  it('should copy styles and show a confirmation snackbar', () => {
    const { result } = renderHook(() => useCopyPasteActions());

    expect(result.current.copiedElementType).toBeUndefined();

    result.current.handleCopyStyles();

    expect(mockCopyElementById).toHaveBeenCalledWith({ elementId: ELEMENT.id });

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Copied style.',
        actionLabel: 'Undo',
      })
    );
  });

  it('should paste styles and show a confirmation snackbar', () => {
    const styles = objectPick(ELEMENT, ATTRIBUTES_TO_COPY);
    // Set copied element in state
    mockUseStory.mockReturnValue({
      ...defaultStoryState,
      copiedElementState: {
        type: ELEMENT.type,
        animations: [ANIMATION],
        styles,
      },
      selectedElement: { id: 'new-element', type: 'image' },
      selectedElementAnimations: [
        { id: 'other-animation', targets: ['new-element'] },
      ],
      // needed for `useRichTextFormatting`
      selectedElements: [{ id: 'new-element', type: 'image' }],
    });

    const { result } = renderHook(() => useCopyPasteActions());

    // paste element
    result.current.handlePasteStyles();

    // Pasting styles is a multiple step process
    // 1. Update styles on element in story
    // 2. Delete existing animation on target element
    // 3. Add new animations

    expect(mockUpdateElementsById).toHaveBeenCalledWith({
      elementIds: ['new-element'],
      properties: expect.any(Function),
    });

    // Need to call updater fn that is passed to `updateElementById`
    // to see what is being updated.
    const updatedStyles = mockUpdateElementsById.mock.calls[0][0].properties();

    // verify old animation deleted
    // verify styles copied
    expect(updatedStyles).toStrictEqual({
      ...styles,
      animation: {
        id: 'other-animation',
        targets: ['new-element'],
        delete: true,
      },
    });

    // verify new animation added
    expect(mockAddAnimations).toHaveBeenCalledWith({
      animations: [
        {
          ...ANIMATION,
          id: expect.any(String),
          targets: ['new-element'],
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
