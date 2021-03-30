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
import { EditorState, ContentState } from 'draft-js';

/**
 * Internal dependencies
 */
import getPastedBlocks from '../getPastedBlocks';
import customExport from '../customExport';

describe('getPastedBlocks', () => {
  function blockMapToHTML(blockMap) {
    const blockArray = blockMap.toArray();
    const contentState = ContentState.createFromBlockArray(blockArray);
    const editorState = EditorState.createWithContent(contentState);
    return customExport(editorState);
  }

  it('should convert various types of bold content correctly', () => {
    const blockMap = getPastedBlocks(
      [
        '<strong>This</strong>',
        '<b>is</b>',
        '<span style="font-weight: 800">also</span>',
        '<span style="font-weight: bolder">bold</span>',
      ].join(' ')
    );
    const expected = [
      '<span style="font-weight: 700">This</span>',
      '<span style="font-weight: 700">is</span>',
      '<span style="font-weight: 700">also</span>',
      '<span style="font-weight: 700">bold</span>',
    ].join(' ');
    const actual = blockMapToHTML(blockMap);

    expect(actual).toStrictEqual(expected);
  });

  it('should convert italic and underline correctly', () => {
    const blockMap = getPastedBlocks(
      ['<u>Underline</u>', '<em>Italic</em>', '<i>Also italic</i>'].join(' ')
    );
    const expected = [
      '<span style="text-decoration: underline">Underline</span>',
      '<span style="font-style: italic">Italic</span>',
      '<span style="font-style: italic">Also italic</span>',
    ].join(' ');
    const actual = blockMapToHTML(blockMap);

    expect(actual).toStrictEqual(expected);
  });

  it('should convert nested types', () => {
    const blockMap = getPastedBlocks('<em>Mi<b>xed</b></em>');
    const expected1 =
      '<span style="font-style: italic">Mi</span><span style="font-weight: 700; font-style: italic">xed</span>';
    const expected2 =
      '<span style="font-style: italic">Mi</span><span style="font-style: italic; font-weight: 700">xed</span>';
    const actual = blockMapToHTML(blockMap);

    expect(actual).toBeOneOf([expected1, expected2]);
  });

  it('should ignore various irrelevant inline styles and attributes', () => {
    const blockMap = getPastedBlocks(
      [
        '<code>Ignore</code>',
        '<ins>Ignore</ins>',
        '<sup>Ignore</sup>',
        '<date>Ignore</date>',
        '<label>Ignore</label>',
        '<button>Ignore</button>',
        '<svg><text>Ignore</text></svg>',
        '<a href="http://ignore-me.example">Ignore</a>',
        // The following 4 would normally be considered block level, but are inlined
        // in the draftjs parser, so that's how it is.
        '<footer>Ignore</footer>',
        '<aside>Ignore</aside>',
        '<chapter>Ignore</chapter>',
        '<main>Ignore</main>',
      ].join(' ')
    );
    // Note they're joined by a space, as they're all inlined
    const expected = Array(12).fill('Ignore').join(' ');
    const actual = blockMapToHTML(blockMap);

    expect(actual).toStrictEqual(expected);
  });

  it('should ignore various irrelevant block level styles and attributes', () => {
    const blockMap = getPastedBlocks(
      [
        '<h1>Ignore</h1>',
        '<h5 class="ignore-me">Ignore</h5>',
        '<pre>Ignore</pre>',
        '<p>Ignore</p>',
        '<nav>Ignore</nav>',
      ].join('\n')
    );
    // Note they're joined by a newline, as they're treated as separate paragraphs
    const expected = Array(5).fill('Ignore').join('\n');
    const actual = blockMapToHTML(blockMap);

    expect(actual).toStrictEqual(expected);
  });

  it('should remove irrelevant elements completely', () => {
    const blockMap = getPastedBlocks(
      [
        'Some actual content',
        '<input value="hello" />',
        '<hr />',
        '<br />',
        '<img src="" alt="image" />',
      ].join('\n')
    );
    const expected = 'Some actual content';
    const actual = blockMapToHTML(blockMap);

    expect(actual).toStrictEqual(expected);
  });

  it('should prefix list items correctly', () => {
    const blockMap = getPastedBlocks(
      [
        '<ol>',
        '<li>Ordered 1</li>',
        '<li>Ordered 2</li>',
        '</ol>',
        '<ul>',
        '<li>Unordered 1</li>',
        '<li>Unordered 2</li>',
        '</ul>',
        '<ol>',
        '<li>Extra ordered</li>',
        '</ol>',
      ].join('\n')
    );
    const expected = [
      '1. Ordered 1',
      '2. Ordered 2',
      '– Unordered 1',
      '– Unordered 2',
      '1. Extra ordered',
    ].join('\n');
    const actual = blockMapToHTML(blockMap);

    expect(actual).toStrictEqual(expected);
  });
});
