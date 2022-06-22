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

global.webStories = {};
global.webStoriesBlockSettings = {
  config: {
    api: {},
  },
};

global.wp = {};
// eslint-disable-next-line jest/prefer-spy-on  -- test setup
global.wp.media = jest.fn(() => ({
  state: () => ({
    get: () => ({
      first: () => ({
        toJSON: () => ({ url: 'http://dummy:url/' }),
      }),
    }),
  }),
  on: (type, callback) => callback(),
  once: (type, callback) => callback(),
  open: () => {},
}));

global.wp.media.controller = {
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
};

global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// eslint-disable-next-line jest/prefer-spy-on -- test-setup
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

if (typeof window !== 'undefined') { // To prevent breaking tests in @jest-environment node
  // jsdom doesn't support these, so we stub them to make tests work as expected.
  window.HTMLMediaElement.prototype.load = () => undefined;
  window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  window.HTMLMediaElement.prototype.pause = () => undefined;
  File.prototype.arrayBuffer = () =>
    new Promise((resolve) => resolve(new ArrayBuffer(0)));

  // Prevent React warnings when setting the `muted` attribute on `<video>` elements.
  // See https://github.com/testing-library/react-testing-library/issues/470
  // See https://github.com/facebook/react/issues/10389

  Object.defineProperty(HTMLMediaElement.prototype, 'muted', {
    set: () => {},
  });
}
