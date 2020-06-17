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
import React from 'react';
import { FlagsProvider } from 'flagged';
import { act, render, screen } from '@testing-library/react';

/**
 * Internal dependencies
 */
import FixtureEvents from '../../edit-story/karma/fixture/events';
import App from '../app';
import ComponentStub from './componentStub';

export class Fixture {
  constructor() {
    this._config = {};
    this._flags = {};
    this._container = null;
    this._screen = null;
    this._componentStubs = new Map();
    this._events = new FixtureEvents();

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
   *   fixture.setFlags({mediaDropdownMenu: true});
   *   await fixture.render();
   * });
   * ```
   *
   * @param {Object} flags
   */
  setFlags(flags) {
    this._flags = { ...flags };
  }

  /**
   * Stubs a component. Can be used to render hooks on this component's level
   * or even to completely replace the implementation of the component.
   *
   * All components must be stubbed before the `fixture.render()` is called.
   *
   * Use sparingly. See `ComponentStub` for more info.
   *
   * @param {Function} component
   * @param {Function|undefined} matcher
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
  render() {
    if (!this._apiProviderFixture) {
      throw new Error('ApiProviderFixture not provided');
    }

    const root = document.querySelector('test-root');
    const { container } = render(
      <FlagsProvider features={this._flags}>
        <App key={Math.random()} config={this._config} />
      </FlagsProvider>,
      {
        container: root,
      }
    );
    // The editor should always be given 100%:100% size. The testing-library
    // renders an extra container so it should be given the same size.
    container.style.width = '100%';
    container.style.height = '100%';
    this._container = container;
    this._screen = screen;

    // @todo: find a stable way to wait for the story to fully render. Can be
    // implemented via `waitFor`.
    return Promise.resolve();
  }

  /**
   * Calls the specified callback and performs rendering actions on the
   * whole editor.
   *
   * Similar to the `@testing-library/react`'s `act()` method.
   *
   * @param {Function} callback
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
   * @param {string} selector
   * @return {Element|null} The found element or null.
   */
  querySelector(selector) {
    return this._container.querySelector(selector);
  }

  /**
   * To be deprecated?
   *
   * @param {string} selector
   * @return {Array.<Element>} The potentially empty list of found elements.
   */
  querySelectorAll(selector) {
    return this._container.querySelectorAll(selector);
  }

  /**
   * @param {Element} element
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
   * @param {string} name
   * @return {Promise} Yields when the snapshot is completed.
   */
  snapshot(name) {
    return karmaSnapshot(name);
  }
}

/**
 * For integration fixture tests we want `act()` to be always async, otherwise
 * a tester would never know what to expect: switching from sync to async
 * is often an implementation detail.
 *
 * See https://github.com/facebook/react/blob/master/packages/react-dom/src/test-utils/ReactTestUtilsAct.js.
 *
 * @param {function():(!Promise|undefined)} callback The body of the `act()`.
 * @return {!Promise} The `act()` promise.
 */
function actPromise(callback) {
  return new Promise((resolve) => {
    let callbackResult;
    const actResult = act(() => {
      callbackResult = callback();
      return Promise.resolve(callbackResult);
    });
    resolve(
      new Promise((aResolve, aReject) => {
        actResult.then(aResolve, aReject);
      }).then(() => callbackResult)
    );
  });
}
