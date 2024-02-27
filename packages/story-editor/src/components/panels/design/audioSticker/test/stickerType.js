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
 * External dependencies
 */
import { fireEvent, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { renderPanel } from '../../../shared/test/_utils';
import AudioStickerStylePanel from '../audioStickerStyle';
import { AudioStickerPreset } from '../stickerType';

describe('Panels/AudioStickerType', () => {
  const DEFAULT_ELEMENT = {
    opacity: 100,
    flip: {
      vertical: false,
      horizontal: false,
    },
    rotationAngle: 0,
    lockAspectRatio: true,
    size: 'small',
    sticker: 'headphone-cat',
    style: 'none',
    lockDimensions: true,
    x: 100,
    y: 100,
    width: 149,
    height: 120,
    type: 'audioSticker',
    id: '8c0c1b7e-7ad3-4140-aa69-4c2011373370',
  };

  beforeAll(() => {
    localStorage.setItem(
      'web_stories_ui_panel_settings:audioStickerType',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  function arrange(...args) {
    const view = renderPanel(AudioStickerStylePanel, ...args);
    const buttons = {};
    Object.keys(AudioStickerPreset).forEach((sticker) => {
      const label = AudioStickerPreset[sticker].label;
      buttons[sticker] = screen.getByLabelText(`Sticker Type: ${label}`);
    });
    return { ...view, buttons };
  }

  describe('Buttons Rendering and Click Handling', () => {
    it.each(Object.keys(AudioStickerPreset))(
      'should render %s button',
      (sticker) => {
        const { buttons } = arrange([DEFAULT_ELEMENT]);
        const button = buttons[sticker];
        expect(button).toBeInTheDocument();
      }
    );

    it.each(Object.keys(AudioStickerPreset))(
      'should update element on %s button click',
      (sticker) => {
        const { buttons, pushUpdate } = arrange([DEFAULT_ELEMENT]);
        const button = buttons[sticker];
        fireEvent.click(button);
        expect(pushUpdate).toHaveBeenCalledWith({ sticker }, true);
      }
    );
  });
});
