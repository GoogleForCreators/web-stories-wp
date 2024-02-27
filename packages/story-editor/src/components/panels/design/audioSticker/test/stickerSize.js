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

describe('Panels/AudioStickerSize', () => {
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
      'web_stories_ui_panel_settings:audioStickerSize',
      JSON.stringify({ isCollapsed: false })
    );
  });

  afterAll(() => {
    localStorage.clear();
  });

  function arrange(...args) {
    const view = renderPanel(AudioStickerStylePanel, ...args);
    const sizeSmallSwitch = screen.getByText('Small');
    const sizeLargeSwitch = screen.getByText('Large');

    return {
      ...view,
      sizeSmallSwitch,
      sizeLargeSwitch,
    };
  }

  it('should render sticker size Small button', () => {
    const { sizeSmallSwitch } = arrange([DEFAULT_ELEMENT]);
    expect(sizeSmallSwitch).toBeInTheDocument();
  });

  it('should render sticker size Large button', () => {
    const { sizeLargeSwitch } = arrange([DEFAULT_ELEMENT]);
    expect(sizeLargeSwitch).toBeInTheDocument();
  });

  it('should update element on changing sticker size to Small', () => {
    const { sizeSmallSwitch, pushUpdate } = arrange([
      { ...DEFAULT_ELEMENT, size: 'large' },
    ]);
    fireEvent.click(sizeSmallSwitch);

    expect(pushUpdate).toHaveBeenCalledWith(
      { width: expect.any(Number), height: expect.any(Number), size: 'small' },
      true
    );
  });

  it('should update element on changing sticker size to Large', () => {
    const { sizeLargeSwitch, pushUpdate } = arrange([DEFAULT_ELEMENT]);
    fireEvent.click(sizeLargeSwitch);

    expect(pushUpdate).toHaveBeenCalledWith(
      { width: expect.any(Number), height: expect.any(Number), size: 'large' },
      true
    );
  });
});
