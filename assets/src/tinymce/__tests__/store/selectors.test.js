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
 * Internal dependencies
 */
import * as selector from '../../store/selectors';

jest.mock('@wordpress/data', () => ({
  select: jest.fn(() => ({
    getCurrentView: () => 'round',
  })),
}));

describe('Test Store Selectors', () => {
  it('get settings', () => {
    const expected = {
      test: 'dummy',
    };

    const state = {
      settings: expected,
    };

    const Settings = selector.getSettings(state);
    expect(Settings).toStrictEqual(expected);
  });

  it('get modal open state', () => {
    const state = {
      modalOpen: true,
    };

    const ModalOpen = selector.getModal(state);
    expect(ModalOpen).toBe(true);
  });

  it('get editor', () => {
    const state = {
      editor: 'test',
    };

    const Editor = selector.getEditor(state);
    expect(Editor).toBe('test');
  });

  it('get current view as `round`', () => {
    const state = {
      currentView: 'round',
    };

    const CurrentView = selector.getCurrentView(state);
    expect(CurrentView).toBe('round');
  });

  it('get current view settings for round', () => {
    const state = {
      settings: {
        round: {
          test: 'dummy',
        },
      },
    };

    const CurrentView = selector.getCurrentViewSettings(state);
    expect(CurrentView).toStrictEqual({ test: 'dummy' });
  });
});
