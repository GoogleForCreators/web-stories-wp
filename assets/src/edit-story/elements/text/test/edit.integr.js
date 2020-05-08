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
import { Editor, EditorState } from 'draft-js';

/**
 * Internal dependencies
 */
import { Fixture, browserDebug } from '../../../app/test/_utils';
import { useStory } from '../../../app/story';
import { useInsertElement } from '../../../components/canvas';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../../app/font/defaultFonts';
import { getSelectionForAll } from '../util';

describe.only('TextEdit integration', () => {
  let fixture;
  let editorStub;

  beforeEach(async () => {
    fixture = new Fixture();
    editorStub = fixture.stubComponent(Editor);
    editorStub.mockImplementation((props, ref) => (
      <div ref={ref} contentEditable={true} />
    ));

    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render ok', () => {
    expect(
      fixture.container.querySelector('[data-testid="fullbleed"]')
    ).toBeTruthy();
  });

  describe('add a text', () => {
    let element;
    let frame;

    beforeEach(async () => {
      const insertElement = await fixture.renderHook(() => useInsertElement());
      element = await fixture.act(() =>
        insertElement('text', {
          font: TEXT_ELEMENT_DEFAULT_FONT,
          content: 'hello world!',
        })
      );

      frame = fixture.querySelector(
        `[data-element-id="${element.id}"] [data-testid="textFrame"]`
      );
    });

    it('should render initial content', () => {
      expect(frame).toHaveTextContent('hello world!');
    });

    describe('edit mode', () => {
      let editor;
      let editLayer;

      beforeEach(() => {
        fixture.fireEvent.click(frame);
        editor = fixture.querySelector('[data-testid="textEditor"]');
        editLayer = fixture.querySelector('[data-testid="editLayer"]');
      });

      it('should mount editor', () => {
        expect(editor).toBeTruthy();
        expect(editorStub.props.editorState).toBeTruthy();
        expect(editLayer).toBeTruthy();
      });

      describe('handle a command', () => {
        beforeEach(async () => {
          // Select all.
          await fixture.act(() => {
            const { onChange, editorState } = editorStub.props;
            onChange(
              EditorState.forceSelection(
                editorState,
                getSelectionForAll(editorState.getCurrentContent())
              )
            );
          });

          // Run a command.
          await fixture.act(() => {
            const { handleKeyCommand, editorState } = editorStub.props;
            return handleKeyCommand('bold', editorState);
          });
        });

        it('should exit and save', async () => {
          // Exit edit mode.
          fixture.fireEvent.mouseDown(editLayer);

          expect(
            fixture.querySelector('[data-testid="textEditor"]')
          ).toBeNull();

          // The element is still selected and updated.
          const storyContext = await fixture.renderHook(() => useStory());
          expect(storyContext.state.selectedElementIds).toStrictEqual([
            element.id,
          ]);
          expect(storyContext.state.selectedElements[0].content).toStrictEqual(
            '<strong>hello world!</strong>'
          );

          // The content is updated in the frame.
          expect(frame.innerHTML).toStrictEqual(
            '<strong>hello world!</strong>'
          );

          await browserDebug();
        });
      });
    });
  });
});
