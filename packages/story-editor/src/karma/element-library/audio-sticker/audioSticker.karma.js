/*
 * Copyright 2023 Google LLC
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
 * Internal dependencies
 */
import { useStory } from '../../../app';
import { Fixture } from '../../fixture';

const stickerTypes = [
  ['headphone-cat', 'headphoneCat'],
  ['tape-player', 'tapePlayer'],
  ['loud-speaker', 'loudSpeaker'],
  ['audio-cloud', 'audioCloud'],
];
const stickerSizes = ['small', 'large'];
const stickerStyles = ['none', 'outline', 'dropshadow'];

describe('Audio Sticker', () => {
  let fixture;

  async function clickCanvas() {
    const focusContainer = fixture.screen.getByTestId('canvas-focus-container');
    await fixture.events.click(focusContainer);
  }

  async function insertAudioSticker() {
    await fixture.events.click(fixture.editor.sidebar.designTab);
    await clickCanvas();
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.pageBackgroundAudio.uploadButton
    );
    const storyContext = await fixture.renderHook(() => useStory());

    expect(
      storyContext.state.currentPage.backgroundAudio.resource.src
    ).not.toBeNull();

    await fixture.events.click(
      fixture.editor.canvas.quickActionMenu.insertAudioStickerButton
    );
  }

  async function clickAudioStickerTypeButton(type) {
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.audioStickerType[type]
    );
  }

  async function clickAudioStickerStyleButton(style) {
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.audioStickerStyle[style]
    );
  }

  async function clickAudioStickerSizeButton(size) {
    await fixture.events.click(
      fixture.editor.sidebar.designPanel.audioStickerSize[size]
    );
  }

  async function getSelectedAudioStickerElement() {
    const element = await fixture.renderHook(() =>
      useStory(({ state }) => state.currentPage.elements[1])
    );
    return element;
  }

  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
    await fixture.collapseHelpCenter();
    await fixture.showFloatingMenu();
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render', async () => {
    await insertAudioSticker();
    const selectedElement = await getSelectedAudioStickerElement();
    expect(selectedElement.type).toBe('audioSticker');
  });

  describe('should update sticker type', () => {
    beforeEach(async () => {
      await insertAudioSticker();
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.audioStickerType.sectionHeading
      );
    });

    for (const [stickerType, buttonName] of stickerTypes) {
      it(`on pressing ${stickerType} button`, async () => {
        await clickAudioStickerTypeButton(buttonName);
        const selectedElement = await getSelectedAudioStickerElement();
        expect(selectedElement.sticker).toBe(stickerType);
      });
    }
  });

  describe('should update sticker style', () => {
    beforeEach(async () => {
      await insertAudioSticker();
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.audioStickerStyle.sectionHeading
      );
    });

    for (const stickerStyle of stickerStyles) {
      it(`on pressing ${stickerStyle} button`, async () => {
        await clickAudioStickerStyleButton(stickerStyle);
        const selectedElement = await getSelectedAudioStickerElement();
        expect(selectedElement.style).toBe(stickerStyle);
      });
    }
  });

  describe('should update sticker size', () => {
    beforeEach(async () => {
      await insertAudioSticker();
      await fixture.events.click(
        fixture.editor.sidebar.designPanel.audioStickerSize.sectionHeading
      );
    });

    for (const stickerSize of stickerSizes) {
      it(`on pressing ${stickerSize} button`, async () => {
        await clickAudioStickerSizeButton(stickerSize);
        const selectedElement = await getSelectedAudioStickerElement();
        expect(selectedElement.size).toBe(stickerSize);
      });
    }
  });
});
