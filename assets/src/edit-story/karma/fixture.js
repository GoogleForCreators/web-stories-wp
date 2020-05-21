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
import React, { useCallback, useState, useMemo, forwardRef } from 'react';
import { render, act } from '@testing-library/react';

/**
 * Internal dependencies
 */
import App from '../app/index';
import APIProvider from '../app/api/apiProvider';
import APIContext from '../app/api/context';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../app/font/defaultFonts';
import Layout from '../app/layout';
import FixtureEvents from './fixtureEvents';

const DEFAULT_CONFIG = {
  storyId: 1,
  api: {},
  allowedMimeTypes: {
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    video: ['video/mp4'],
  },
  allowedFileTypes: ['png', 'jpeg', 'jpg', 'gif', 'mp4'],
  capabilities: {},
};

export class Fixture {
  constructor() {
    this._config = { ...DEFAULT_CONFIG };

    this._componentStubs = new Map();
    const origCreateElement = React.createElement;
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
      return origCreateElement(type, props, ...children);
    });

    this.apiProviderFixture_ = new APIProviderFixture();
    this.stubComponent(APIProvider).callFake(
      this.apiProviderFixture_.Component
    );

    this._layoutStub = this.stubComponent(Layout);

    this._events = new FixtureEvents(this.act.bind(this));

    this._container = null;
  }

  restore() {}

  get container() {
    return this._container;
  }

  get events() {
    return this._events;
  }

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

  render() {
    const { container } = render(
      <App key={Math.random()} config={this._config} />
    );
    this._container = container;

    // @todo: find a stable way to wait for the story to fully render. Can be
    // implemented via `waitFor`.
    return Promise.resolve();
  }

  renderHook(func) {
    return this._layoutStub.renderHook(func);
  }

  act(callback) {
    return actPromise(callback);
  }

  querySelector(selector) {
    return this._container.querySelector(selector);
  }

  snapshot(name) {
    return karmaSnapshot(name);
  }
}

/**
 * A component stub. Allows two main features:
 * 1. Mock a component's implementation.
 * 2. Execute a hook against a component.
 */
class ComponentStub {
  constructor(fixture, Component, matcher) {
    this._fixture = fixture;
    this._matcher = matcher;
    this._implementation = null;

    this._props = null;

    let setRefresher;
    this._refresh = () => {
      act(() => {
        if (setRefresher) {
          setRefresher((v) => v + 1);
        }
      });
    };

    const pendingHooks = [];
    this._pushPendingHook = (func) => {
      let resolver;
      const promise = new Promise((resolve) => {
        resolver = resolve;
      });
      pendingHooks.push(() => {
        const result = func();
        resolver(result);
      });
      this._refresh();
      return promise;
    };

    const Wrapper = forwardRef((props, ref) => {
      this._props = props;

      const [refresher, setRefresherInternal] = useState(0);
      setRefresher = setRefresherInternal;
      const hooks = useMemo(
        () => {
          const hooksToExecute = pendingHooks.slice(0);
          pendingHooks.length = 0;
          return hooksToExecute;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [refresher]
      );

      const Impl = useMemo(
        () => {
          if (this._implementation) {
            const MockImpl = forwardRef((fProps, fRef) =>
              this._implementation(fProps, fRef)
            );
            MockImpl.displayName = `Stub(${
              Component.displayName || Component.name || ''
            })`;
            return MockImpl;
          }
          return Component;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [refresher]
      );

      return (
        <HookExecutor key={refresher} hooks={hooks}>
          <Impl _wrapped={true} ref={ref} {...props} />
        </HookExecutor>
      );
    });
    Wrapper.displayName = `Mock(${
      Component.displayName || Component.name || ''
    })`;
    this._wrapper = Wrapper;
  }

  get and() {
    return this;
  }

  get props() {
    return this._props;
  }

  mockImplementation(implementation) {
    this._implementation = implementation;
    this._refresh();
    return this;
  }

  callFake(implementation) {
    return this.mockImplementation(implementation);
  }

  renderHook(func) {
    return this._fixture.act(() => this._pushPendingHook(func));
  }
}

function HookExecutor({ hooks, children }) {
  hooks.forEach((func) => func());
  return children;
}

class APIProviderFixture {
  constructor() {
    // eslint-disable-next-line react/prop-types
    const Comp = ({ children }) => {
      const getStoryById = useCallback(
        // @todo: put this to __db__/
        () =>
          asyncResponse({
            title: { raw: 'Auto Draft' },
            status: 'draft',
            author: 1,
            slug: '',
            date_gmt: '2020-05-06T22:32:37',
            modified: '2020-05-06T22:32:37',
            excerpt: { raw: '' },
            link: 'http://stories.local/?post_type=web-story&p=1',
            story_data: [],
            featured_media: 0,
            featured_media_url: '',
            publisher_logo_url:
              'http://stories.local/wp-content/plugins/web-stories/assets/images/logo.png',
            permalink_template: 'http://stories3.local/stories/%pagename%/',
            style_presets: { textStyles: [], fillColors: [], textColors: [] },
            password: '',
          }),
        []
      );

      const autoSaveById = useCallback(
        () => jasmine.createSpy('autoSaveById'),
        []
      );
      const saveStoryById = useCallback(
        () => jasmine.createSpy('saveStoryById'),
        []
      );
      const deleteStoryById = useCallback(
        () => jasmine.createSpy('deleteStoryById'),
        []
      );

      const getAllFonts = useCallback(() => {
        // @todo: put actual data to __db__/
        return asyncResponse(
          [TEXT_ELEMENT_DEFAULT_FONT].map((font) => ({
            name: font.family,
            value: font.family,
            ...font,
          }))
        );
      }, []);

      // eslint-disable-next-line no-unused-vars
      const getMedia = useCallback(({ mediaType, searchTerm, pagingNum }) => {
        // @todo: arg support
        // @todo: put actual data to __db__/
        return asyncResponse({ data: [], headers: {} });
      }, []);
      const uploadMedia = useCallback(
        () => jasmine.createSpy('uploadMedia'),
        []
      );
      const updateMedia = useCallback(
        () => jasmine.createSpy('updateMedia'),
        []
      );

      const getLinkMetadata = useCallback(
        () => jasmine.createSpy('getLinkMetadata'),
        []
      );

      const getAllStatuses = useCallback(
        () => jasmine.createSpy('getAllStatuses'),
        []
      );
      const getAllUsers = useCallback(
        () => jasmine.createSpy('getAllUsers'),
        []
      );

      const state = {
        actions: {
          autoSaveById,
          getStoryById,
          getMedia,
          getLinkMetadata,
          saveStoryById,
          deleteStoryById,
          getAllFonts,
          getAllStatuses,
          getAllUsers,
          uploadMedia,
          updateMedia,
        },
      };
      return (
        <APIContext.Provider value={state}>{children}</APIContext.Provider>
      );
    };
    Comp.displayName = 'Fixture(APIProvider)';
    this._comp = Comp;
  }

  get Component() {
    return this._comp;
  }
}

/**
 * Wraps a fixture response in a promise. May additionally add `act()` calls as
 * needed.
 *
 * @param {*} value The reponse value.
 * @return {!Promise} The promise of the response.
 */
function asyncResponse(value) {
  return Promise.resolve(value);
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
