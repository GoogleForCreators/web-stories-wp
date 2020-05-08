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
import { render, act, fireEvent } from '@testing-library/react';
import puppeteer from 'puppeteer';

/**
 * Internal dependencies
 */
import App from '../index';
import APIProvider from '../api/apiProvider';
import Context from '../api/context';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../font/defaultFonts';
import Layout from '../layout';

jest.mock('../api/apiProvider');

const DEFAULT_CONFIG = {
  storyId: 1,
  api: {},
  allowedMimeTypes: {
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    video: ['video/mp4'],
  },
  allowedFileTypes: ['png', 'jpeg', 'jpg', 'gif', 'mp4'],
};

export class Fixture {
  constructor() {
    this._config = { ...DEFAULT_CONFIG };

    this.apiProviderFixture_ = new APIProviderFixture();
    APIProvider.mockImplementation(this.apiProviderFixture_.Component);

    this._componentStubs = new Map();
    const origCreateElement = React.createElement;
    jest
      .spyOn(React, 'createElement')
      .mockImplementation((type, props, ...children) => {
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

    this._layoutStub = this.stubComponent(Layout);

    this._fireEvent = new FixtureFireEvent();

    this._container = null;
  }

  restore() {
    jest.restoreAllMocks();
  }

  get container() {
    return this._container;
  }

  get fireEvent() {
    return this._fireEvent;
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
    const { container } = render(<App config={this._config} />);
    this._container = container;

    // @todo: find a stable way to wait for the story to fully render. Can be
    // implemented via `waitFor`.
    return Promise.resolve();
  }

  renderHook(func) {
    return this._layoutStub.renderHook(func);
  }

  act(callback) {
    let responsePromise;
    return Promise.resolve(
      act(() => {
        responsePromise = callback();
      })
    ).then(() => responsePromise);
  }

  querySelector(selector) {
    return this._container.querySelector(selector);
  }
}

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

    this._wrapper = forwardRef((props, ref) => {
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
            return forwardRef(this._implementation);
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
  }

  get props() {
    return this._props;
  }

  mockImplementation(implementation) {
    this._implementation = implementation;
    this._refresh();
    return this;
  }

  renderHook(func) {
    return this._fixture.act(() => this._pushPendingHook(func));
  }
}

class FixtureFireEvent {
  pointerDown(element, options = {}) {
    const { pointerType = 'mouse' } = options;

    fireEvent.pointerDown(element, options);
    if (pointerType === 'mouse') {
      fireEvent.mouseDown(element, options);
    }
  }

  pointerUp(element, options = {}) {
    const { pointerType = 'mouse' } = options;

    fireEvent.pointerUp(element, options);
    if (pointerType === 'mouse') {
      fireEvent.mouseUp(element, options);
    }
  }

  mouseDown(element, options = {}) {
    this.pointerDown(element, { ...options, pointerType: 'mouse' });
  }

  mouseUp(element, options = {}) {
    this.pointerUp(element, { ...options, pointerType: 'mouse' });
  }

  click(element, options = {}) {
    this.pointerDown(element, options);
    this.pointerUp(element, options);
    fireEvent.click(element, options);
  }
}

function HookExecutor({ hooks, children }) {
  hooks.forEach((func) => func());
  return children;
}

class APIProviderFixture {
  constructor() {
    this._comp = ({ children }) => {
      const getStoryById = useCallback(
        // @todo: put this to __db__/
        () =>
          actPromise({
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

      const autoSaveById = useCallback(() => jest.fn(), []);
      const saveStoryById = useCallback(() => jest.fn(), []);
      const deleteStoryById = useCallback(() => jest.fn(), []);

      const getAllFonts = useCallback(() => {
        // @todo: put actual data to __db__/
        return actPromise(
          [TEXT_ELEMENT_DEFAULT_FONT].map((font) => ({
            name: font.family,
            value: font.family,
            ...font,
          }))
        );
      }, []);

      const getMedia = useCallback(({ mediaType, searchTerm, pagingNum }) => {
        // @todo: arg support
        // @todo: put actual data to __db__/
        return actPromise({ data: [], headers: {} });
      }, []);
      const uploadMedia = useCallback(() => jest.fn(), []);
      const updateMedia = useCallback(() => jest.fn(), []);

      const getLinkMetadata = useCallback(() => jest.fn(), []);

      const getAllStatuses = useCallback(() => jest.fn(), []);
      const getAllUsers = useCallback(() => jest.fn(), []);

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
      return <Context.Provider value={state}>{children}</Context.Provider>;
    };
  }

  get Component() {
    return this._comp;
  }
}

function actPromise(value) {
  const promise = Promise.resolve(value);
  return {
    then(callback, errback) {
      return actPromise(
        promise.then(
          (result) => act(() => callback(result)),
          (reason) => act(() => errback(reason))
        )
      );
    },
    catch(errback) {
      return actPromise(promise.catch((reason) => act(() => errback(reason))));
    },
    finally(callback) {
      return actPromise(
        promise.finally((result) => act(() => callback(result)))
      );
    },
  };
}

export async function browserDebug() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.evaluate((head, body) => {
    document.open();
    document.write('<!DOCTYPE html>');
    document.write('<html>');

    document.write('<head>');
    document.write(`
      <style>
        body {
          margin: 0;
          width: 100vw;
          height: 100vh;
        }
      </style>
    `);
    document.write(head);
    document.write('</head>');

    document.write('<body>');
    document.write(body);
    document.write('</body>');

    document.write('</html>');
    document.close();
  }, document.head.innerHTML, document.body.innerHTML);
}
