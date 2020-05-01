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
import { convertFromRaw, EditorState, SelectionState } from 'draft-js';

/**
 * Internal dependencies
 */
import {
  getPrefixStyleForCharacter,
  getPrefixStylesInSelection,
  togglePrefixStyle,
} from '../styleManipulation';

expect.extend({
  toHaveStyleAtCursor(received, style) {
    const styles = received.getCurrentInlineStyle().toArray();
    const pass = styles.includes(style);
    if (pass) {
      return {
        message: () => `expected ${styles} to not include ${style}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${styles} to include ${style}`,
        pass: false,
      };
    }
  },
  toHaveStyleInSelection(received, style, stylePrefix = null) {
    stylePrefix = stylePrefix ?? style;
    const styles = getPrefixStylesInSelection(received, stylePrefix);
    const pass = styles.includes(style);
    if (pass) {
      return {
        message: () => `expected selection ${styles} to not include ${style}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected selection ${styles} to include ${style}`,
        pass: false,
      };
    }
  },
  toHaveStyleInEntireSelection(received, style, stylePrefix = null) {
    stylePrefix = stylePrefix ?? style;
    const styles = getPrefixStylesInSelection(received, stylePrefix);
    const pass = styles.includes(style) && styles.length === 1;
    if (pass) {
      return {
        message: () =>
          `expected selection ${styles} to not only include ${style}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected selection ${styles} to only include ${style}`,
        pass: false,
      };
    }
  },
});

describe('getPrefixStyleForCharacter', () => {
  function setup(styleArray, prefix) {
    return getPrefixStyleForCharacter({ toArray: () => styleArray }, prefix);
  }

  it('should return a direct match', () => {
    const match = setup(['ALPHA', 'BRAVO', 'CHARLIE'], 'BRAVO');
    expect(match).toStrictEqual('BRAVO');
  });

  it('should return a prefix match', () => {
    const match = setup(['ALPHA-1', 'BRAVO-2', 'CHARLIE-3'], 'BRAVO');
    expect(match).toStrictEqual('BRAVO-2');
  });

  it('should return first match if multiple', () => {
    const match = setup(['ALPHA-1', 'BRAVO-2', 'BRAVO-3'], 'BRAVO');
    expect(match).toStrictEqual('BRAVO-2');
  });

  it('should return NONE if no match', () => {
    const match = setup(['ALPHA-1', 'BRAVO-2', 'CHARLIE-3'], 'DELTA');
    expect(match).toStrictEqual('NONE');
  });
});

describe('getPrefixStylesInSelection', () => {
  it('should return all different matched styles for non-collapsed selection', () => {
    // Let's select "World"
    const editorState = getEditorState(6, 11);
    const matches = getPrefixStylesInSelection(editorState, 'CUSTOM-WEIGHT');
    expect(matches).toIncludeSameMembers([
      'CUSTOM-WEIGHT-700',
      'CUSTOM-WEIGHT-900',
    ]);
  });

  it('should include NONE if at least one character did not match for non-collapsed selection', () => {
    // Let's select "Hello World"
    const editorState = getEditorState(0, 11);
    const matches = getPrefixStylesInSelection(editorState, 'CUSTOM-WEIGHT');
    expect(matches).toIncludeSameMembers([
      'NONE',
      'CUSTOM-WEIGHT-700',
      'CUSTOM-WEIGHT-900',
    ]);
  });

  it('should return matched style for collapsed selection', () => {
    // Let's place selection where the * is: "Hello W*orld"
    const editorState = getEditorState(7);
    const matches = getPrefixStylesInSelection(editorState, 'CUSTOM-WEIGHT');
    expect(matches).toIncludeSameMembers(['CUSTOM-WEIGHT-700']);
  });

  it('should return NONE if no match for collapsed selection', () => {
    // Let's place selection where the * is: "H*ello World"
    const editorState = getEditorState(1);
    const matches = getPrefixStylesInSelection(editorState, 'CUSTOM-WEIGHT');
    expect(matches).toIncludeSameMembers(['NONE']);
  });
});

describe('togglePrefixStyle', () => {
  describe('on collapsed selection', () => {
    it('should toggle simple style off if selection is not inside matching style', () => {
      // Let's place selection where the * is: "H*ello World"
      // So, inside italic style
      const editorState = getEditorState(1);

      // Verify that it doesn't include italic:
      expect(editorState).not.toHaveStyleAtCursor('CUSTOM-ITALIC');

      // Now toggle italic
      const newState = togglePrefixStyle(editorState, 'CUSTOM-ITALIC');

      // And verify that it now has italic
      expect(newState).toHaveStyleAtCursor('CUSTOM-ITALIC');
    });

    it('should toggle simple style off if selection is inside matching style', () => {
      // Let's place selection where the * is: "Hel*lo World"
      // So, inside italic style
      const editorState = getEditorState(3);

      // Verify that it includes italic:
      expect(editorState).toHaveStyleAtCursor('CUSTOM-ITALIC');

      // Now toggle italic
      const newState = togglePrefixStyle(editorState, 'CUSTOM-ITALIC');

      //And verify that it doesn't have italic anymore
      expect(newState).not.toHaveStyleAtCursor('CUSTOM-ITALIC');
    });

    it('should do nothing when toggling simple style *on* in selection *with style*', () => {
      // Let's place selection where the * is: "Hel*lo World"
      // So, inside italic style
      const editorState = getEditorState(3);

      // Verify that it already includes italic:
      expect(editorState).toHaveStyleAtCursor('CUSTOM-ITALIC');

      // Now toggle italic
      const newState = togglePrefixStyle(
        editorState,
        'CUSTOM-ITALIC',
        () => true
      );

      // And verify that it still includes italic
      expect(newState).toHaveStyleAtCursor('CUSTOM-ITALIC');
    });

    it('should do nothing when toggling simple style *off* in selection *without style*', () => {
      // Let's place selection where the * is: "H*ello World"
      // So, inside italic style
      const editorState = getEditorState(1);

      // Verify that it doesn't include italic:
      expect(editorState).not.toHaveStyleAtCursor('CUSTOM-ITALIC');

      // Now toggle italic
      const newState = togglePrefixStyle(
        editorState,
        'CUSTOM-ITALIC',
        () => false
      );

      // And verify that it still doesn't have italic
      expect(newState).not.toHaveStyleAtCursor('CUSTOM-ITALIC');
    });

    it('should toggle complex style based on callbacks', () => {
      // Let's place selection where the * is: "Hel*lo World"
      // So, inside bold style
      const editorState = getEditorState(3);

      // Verify that it has custom weight 700:
      expect(editorState).toHaveStyleAtCursor('CUSTOM-WEIGHT-700');

      // Now toggle according to callbacks:
      const shouldSetStyle = jest.fn().mockImplementation(() => true);
      const styleToSet = jest
        .fn()
        .mockImplementation(() => 'CUSTOM-WEIGHT-900');
      const newState = togglePrefixStyle(
        editorState,
        'CUSTOM-WEIGHT',
        shouldSetStyle,
        styleToSet
      );

      // And verify that it now has given style
      expect(newState).toHaveStyleAtCursor('CUSTOM-WEIGHT-900');

      // And verify given callbacks have been invoked correctly
      expect(shouldSetStyle).toHaveBeenCalledWith(['CUSTOM-WEIGHT-700']);
      expect(styleToSet).toHaveBeenCalledWith(['CUSTOM-WEIGHT-700']);
    });
  });

  describe('on non-collapsed selection', () => {
    it('should toggle simple style off if selection contains style throughout', () => {
      // Let's place selection here: "Hel[lo] World"
      // So, everything is underlined
      const editorState = getEditorState(3, 5);

      // Verify that it is underline throughout:
      expect(editorState).toHaveStyleInEntireSelection('CUSTOM-UNDERLINE');

      // Now toggle underline
      const newState = togglePrefixStyle(editorState, 'CUSTOM-UNDERLINE');

      // And verify that it doesn't have underline anywhere
      expect(newState).not.toHaveStyleInSelection('CUSTOM-UNDERLINE');
    });

    it('should toggle simple style on if selection contains style somewhere but not everywhere', () => {
      // Let's place selection here: "H[ello] World"
      // So, some is underlined, some not
      const editorState = getEditorState(1, 5);

      // Verify that it is underline somewhere, but not everywhere:
      expect(editorState).not.toHaveStyleInEntireSelection('CUSTOM-UNDERLINE');
      expect(editorState).toHaveStyleInSelection('CUSTOM-UNDERLINE');

      // Now toggle underline
      const newState = togglePrefixStyle(editorState, 'CUSTOM-UNDERLINE');

      // And verify that now has underline throughout
      expect(newState).toHaveStyleInEntireSelection('CUSTOM-UNDERLINE');
    });

    it('should toggle simple style on if selection does not contain style at all', () => {
      // Let's place selection here: "[He]llo World"
      // So, no underline at all
      const editorState = getEditorState(0, 2);

      // Verify that it is underline nowhere:
      expect(editorState).not.toHaveStyleInSelection('CUSTOM-UNDERLINE');

      // Now toggle underline
      const newState = togglePrefixStyle(editorState, 'CUSTOM-UNDERLINE');

      // And verify that now has underline throughout
      expect(newState).toHaveStyleInEntireSelection('CUSTOM-UNDERLINE');
    });

    it('should toggle complex style according to callbacks', () => {
      // Let's place selection here: "Hell[o Worl]d"
      // So, some regular weight, some bold, some black
      const editorState = getEditorState(4, 10);

      // Verify that it is both none, bold and black somewhere:
      expect(editorState).toHaveStyleInSelection('NONE', 'CUSTOM-WEIGHT');
      expect(editorState).toHaveStyleInSelection(
        'CUSTOM-WEIGHT-700',
        'CUSTOM-WEIGHT'
      );
      expect(editorState).toHaveStyleInSelection(
        'CUSTOM-WEIGHT-900',
        'CUSTOM-WEIGHT'
      );

      // Now toggle font weight according to callbacks
      const shouldSetStyle = jest.fn().mockImplementation(() => true);
      const styleToSet = jest
        .fn()
        .mockImplementation(() => 'CUSTOM-WEIGHT-300');
      const newState = togglePrefixStyle(
        editorState,
        'CUSTOM-WEIGHT',
        shouldSetStyle,
        styleToSet
      );

      // And verify that now has new font weight throughout
      expect(newState).toHaveStyleInEntireSelection(
        'CUSTOM-WEIGHT-300',
        'CUSTOM-WEIGHT'
      );

      // And verify given callbacks have been invoked correctly
      expect(shouldSetStyle).toHaveBeenCalledWith([
        'NONE',
        'CUSTOM-WEIGHT-700',
        'CUSTOM-WEIGHT-900',
      ]);
      expect(styleToSet).toHaveBeenCalledWith([
        'NONE',
        'CUSTOM-WEIGHT-700',
        'CUSTOM-WEIGHT-900',
      ]);
    });
  });
});

/* Editor state has this content:
 *   Hello World
 *
 * With 7 different sections with styles as follows:
 *
 * 1. "He"  is unstyled
 * 2. "l"   is bold (700) and italic
 * 3. "l"   is bold (700), italic and underline
 * 4. "o"   is underline
 * 5. " "   is unstyled
 * 6. "Wo"  is bold (700)
 * 7. "rld" is black (900)
 */
function getEditorState(selectionStart, selectionEnd = null) {
  const raw = {
    blocks: [
      {
        key: '65t0d',
        text: 'Hello world',
        type: 'unstyled',
        depth: 0,
        inlineStyleRanges: [
          { offset: 2, length: 2, style: 'CUSTOM-WEIGHT-700' },
          { offset: 2, length: 2, style: 'CUSTOM-ITALIC' },
          { offset: 3, length: 2, style: 'CUSTOM-UNDERLINE' },
          { offset: 6, length: 2, style: 'CUSTOM-WEIGHT-700' },
          { offset: 8, length: 3, style: 'CUSTOM-WEIGHT-900' },
        ],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };
  const contentState = convertFromRaw(raw);
  const unselectedState = EditorState.createWithContent(contentState);
  const selection = new SelectionState({
    anchorKey: raw.blocks[0].key,
    anchorOffset: selectionStart,
    focusKey: raw.blocks[0].key,
    focusOffset: selectionEnd ?? selectionStart,
  });
  return EditorState.forceSelection(unselectedState, selection);
}
