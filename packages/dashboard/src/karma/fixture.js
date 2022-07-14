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

import {
  act,
  configure,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { setAppElement } from '@googleforcreators/design-system';
import {
  FixtureEvents,
  ComponentStub,
  actPromise,
} from '@googleforcreators/karma-fixture';

/**
 * Internal dependencies
 */
import Dashboard from '../dashboard';
import ApiProvider from '../app/api/apiProvider';
import { AppFrame } from '../components';
import InterfaceSkeleton from '../components/interfaceSkeleton';
import { noop } from '../utils';
import ApiProviderFixture from './apiProviderFixture';

const React = require('react');

if ('true' === WEB_STORIES_CI) {
  configure({
    getElementError: (message) => {
      const error = new Error(message);
      error.name = 'TestingLibraryElementError';
      error.stack = null;
      return error;
    },
  });
}
export const FIXTURE_DEFAULT_CONFIG = {
  capabilities: {
    canManageSettings: true,
    canUploadFiles: true,
  },
  allowedImageMimeTypes: ['image/png', 'image/jpeg', 'image/gif'],
  canViewDefaultTemplates: true,
  siteKitStatus: {
    installed: false,
    active: false,
    analyticActive: false,
    link: 'https://example.com/wp-admin/plugins.php',
  },
  maxUpload: 104857600,
  maxUploadFormatted: '100 MB',
  isRTL: false,
  userId: 123,
  locale: {
    dateFormat: 'F j, Y',
    timeFormat: 'g:i a',
    gmtOffset: -4,
    timezone: 'America/New_York',
    weekStartsOn: 0,
  },
  newStoryURL:
    'http://localhost:8899/wp-admin/post-new.php?post_type=web-story',
  cdnURL: 'https://cdn.example.com/',
  version: '1.0.0-alpha.9',
  archiveURL: 'https://example.com/archive',
  defaultArchiveURL: 'https://example.com/web-stories',
  api: {
    stories: '/web-stories/v1/web-story',
  },
  flags: {},
  apiCallbacks: {
    trashStory: noop,
    duplicateStory: noop,
    updateStory: noop,
    getAuthors: noop,
    fetchStories: noop,
    createStoryFromTemplate: noop,
  },
  vendors: { none: 'None', shopify: 'Shopify', woocommerce: 'WooCommerce' },
};

export default class Fixture {
  constructor({ config = {}, flags = {} } = {}) {
    this._config = { ...FIXTURE_DEFAULT_CONFIG, ...config };
    this._flags = flags;
    this._container = null;
    this._appFrameStub = null;
    this._screen = null;
    this._componentStubs = new Map();
    this._events = new FixtureEvents(act);

    const createElement = React.createElement;
    //eslint-disable-next-line jasmine/no-unsafe-spy
    spyOn(React, 'createElement').and.callFake((type, props, ...children) => {
      if (!props?._wrapped) {
        const stubs = this._componentStubs.get(type);
        if (stubs) {
          const match = stubs.find((stub) => {
            if (!stub._matcher) {
              return true;
            }
            return stub._matcher(props);
          });
          if (match) {
            type = match._wrapper;
          }
        }
      }
      return createElement(type, props, ...children);
    });

    this.stubComponent(ApiProvider).callFake(ApiProviderFixture);

    this._appFrameStub = this.stubComponent(AppFrame);
  }

  get container() {
    return this._container;
  }

  /**
   * A fixture utility to fire native browser events. See `FixtureEvents` for
   * more info.
   *
   * @return {FixtureEvents} fixture events that are executed on the native
   * browser.
   */
  get events() {
    return this._events;
  }

  get screen() {
    return this._screen;
  }

  /**
   * Set the feature flags. See `flags.js` for the list of flags.
   *
   * For instance, to enable a flag in your test call `setFlags` before
   * calling the `render()` method:
   * ```
   * beforeEach(async () => {
   *   fixture = new Fixture();
   *   fixture.setFlags({FEATURE_NAME: true});
   *   await fixture.render();
   * });
   * ```
   *
   * @param {Object} flags Flags object.
   */
  setFlags(flags) {
    this._flags = { ...this._config.flags, ...flags };
    this._config.flags = this._flags;
  }

  setConfig(config) {
    this._config = { ...this._config, ...config };
  }

  /**
   * Stubs a component. Can be used to render hooks on this component's level
   * or even to completely replace the implementation of the component.
   *
   * All components must be stubbed before the `fixture.render()` is called.
   *
   * Use sparingly. See `ComponentStub` for more info.
   *
   * @param {Function} component Component.
   * @param {Function|undefined} matcher Matcher.
   * @return {ComponentStub} The component's stub.
   */
  stubComponent(component, matcher) {
    const stub = new ComponentStub(this, component, matcher);
    let stubs = this._componentStubs.get(component);
    if (!stubs) {
      stubs = [];
      this._componentStubs.set(component, stubs);
    }
    stubs.push(stub);
    return stub;
  }

  /**
   * Renders the editor similarly to the `@testing-library/react`'s `render()`
   * method.
   *
   * @return {Promise} Yields when the editor rendering is complete.
   */
  async render() {
    const root = document.querySelector('test-root');

    // see http://reactcommunity.org/react-modal/accessibility/
    setAppElement(root);

    const { container } = render(
      <Dashboard key={Math.random()} config={this._config}>
        <InterfaceSkeleton />
      </Dashboard>,
      {
        container: root,
      }
    );
    // The editor should always be given 100%:100% size. The testing-library
    // renders an extra container so it should be given the same size.
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.overflow = 'scroll';
    this._container = container;
    this._screen = screen;

    // Check to see if Google Sans font is loaded.
    await waitFor(async () => {
      const weights = ['400', '700'];
      const font = '12px "Google Sans"';
      const fonts = weights.map((weight) => `${weight} ${font}`);
      await Promise.all(
        fonts.map((thisFont) => document.fonts.load(thisFont, ''))
      );
      fonts.forEach((thisFont) => {
        if (!document.fonts.check(thisFont, '')) {
          throw new Error('Not ready: Google Sans font could not be loaded');
        }
      });
    });
  }

  restore() {
    window.location.hash = '#';
    localStorage.clear();
  }

  /**
   * Calls a hook in the context of the whole dashboard.
   *
   * Similar to the `@testing-library/react`'s `renderHook()` method.
   *
   * @param {Function} func The hook function. E.g. `useStory`.
   * @return {Promise<Object>} Resolves when the hook is rendered with the
   * value of the hook.
   */
  renderHook(func) {
    return this._appFrameStub.renderHook(func);
  }

  /**
   * Calls the specified callback and performs rendering actions on the
   * whole editor.
   *
   * Similar to the `@testing-library/react`'s `act()` method.
   *
   * @param {Function} callback Callback.
   * @return {Promise<Object>} Yields when the `act()` and all related
   * editor rendering activity is complete. Resolves to the result of the
   * callback.
   */
  act(callback) {
    return actPromise(callback);
  }

  /**
   * To be deprecated.
   *
   * @param {string} selector Selector.
   * @return {Element|null} The found element or null.
   */
  querySelector(selector) {
    return this._container.querySelector(selector);
  }

  /**
   * To be deprecated?
   *
   * @param {string} selector Selector.
   * @return {Array.<Element>} The potentially empty list of found elements.
   */
  querySelectorAll(selector) {
    return this._container.querySelectorAll(selector);
  }

  /**
   * @param {Element} element Element.
   * @return {Promise} Yields when the element is displayed on the screen.
   */
  waitOnScreen(element) {
    return new Promise((resolve) => {
      const io = new IntersectionObserver((records) => {
        records.forEach((record) => {
          if (record.isIntersecting) {
            resolve();
            io.disconnect();
          }
        });
      });
      io.observe(element);
    });
  }

  /**
   * Makes a DOM snapshot of the current editor state. Karma must be run
   * with the `--snapshots` option for the snapshotting to be enabled. When
   * enabled, all snapshots are stored in the `/.test_artifacts/karma_snapshots`
   * directory.
   *
   * @param {string} name Snapshot name.
   * @return {Promise} Yields when the snapshot is completed.
   */
  snapshot(name) {
    return karmaSnapshot(name);
  }
}
