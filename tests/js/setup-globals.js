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

window.webStoriesEditorSettings = {};
window.webStoriesDashboardSettings = {};

global.wp = {
  media: {
    controller: {
      Library: {
        prototype: {
          defaults: {
            contentUserSetting: jest.fn(),
          },
        },
      },
      Cropper: {
        extend: jest.fn(),
      },
    },
    View: {
      extend: jest.fn(),
    },
    view: {
      Toolbar: {
        Select: {
          extend: jest.fn(),
        },
      },
      MediaFrame: {
        Select: {
          extend: jest.fn(),
        },
      },
    },
  },
};

global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// eslint-disable-next-line jest/prefer-spy-on
global.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(), // deprecated
  removeListener: jest.fn(), // deprecated
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));
