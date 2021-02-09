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
import * as actions from '../../store/actions';

describe("Test actions' returned object", () => {
  describe('Test set settings actions', () => {
    it('pass empty setting', () => {
      const expected = {
        type: 'SET_SETTINGS',
        settings: {},
      };

      const settingsActionObject = actions.setSettings({});
      expect(settingsActionObject).toEqual(expected);
    });
  });

  describe('Test toggle Modal action', () => {
    it('pass true', () => {
      const expected = {
        type: 'TOGGLE_MODAL',
        modalOpen: true,
      };

      const toggleModal = actions.toggleModal(true);
      expect(toggleModal).toStrictEqual(expected);
    });

    it('pass false', () => {
      const expected = {
        type: 'TOGGLE_MODAL',
        modalOpen: false,
      };

      const toggleModal = actions.toggleModal(false);
      expect(toggleModal).toStrictEqual(expected);
    });
  });

  describe('Test setting editor via action object', () => {
    it('set editor instance', () => {
      const expected = {
        type: 'SET_EDITOR',
        editor: 'test_editor',
      };

      const Editor = actions.setEditor('test_editor');
      expect(Editor).toStrictEqual(expected);
    });
  });

  describe('Set current view', () => {
    it('set current view to list', () => {
      const expected = {
        type: 'SET_CURRENT_VIEW',
        currentView: 'list',
      };

      const View = actions.setCurrentView('list');
      expect(View).toStrictEqual(expected);
    });
  });

  describe('Set view settings', () => {
    it('set view related settings', () => {
      const expected = {
        type: 'SET_VIEW_SETTINGS',
        view: 'list',
        settings: {
          test: 'test',
        },
      };

      const ViewSettings = actions.setViewSettings('list', { test: 'test' });
      expect(ViewSettings).toStrictEqual(expected);
    });
  });
});
