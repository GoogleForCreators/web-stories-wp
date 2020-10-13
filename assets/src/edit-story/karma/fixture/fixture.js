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
import { FlagsProvider } from 'flagged';
import { render, act, screen, waitFor } from '@testing-library/react';
import Modal from 'react-modal';

/**
 * Internal dependencies
 */
import FixtureEvents from '../../../../../karma/fixture/events';
import App from '../../app/index';
import APIProvider from '../../app/api/apiProvider';
import APIContext from '../../app/api/context';
import FileProvider from '../../app/file/provider';
import FileContext from '../../app/file/context';
import Layout from '../../app/layout';
import { DATA_VERSION } from '../../migration';
import { createPage } from '../../elements';
import { TEXT_ELEMENT_DEFAULT_FONT } from '../../app/font/defaultFonts';
import getMediaResponse from './db/getMediaResponse';
import { Editor as EditorContainer } from './containers';

export const MEDIA_PER_PAGE = 20;
const DEFAULT_CONFIG = {
  storyId: 1,
  api: {},
  allowedMimeTypes: {
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    video: ['video/mp4', 'video/ogg'],
  },
  allowedFileTypes: ['png', 'jpeg', 'jpg', 'gif', 'mp4', 'ogg'],
  capabilities: {
    hasUploadMediaAction: true,
    hasPublishAction: true,
  },
  version: '1.0.0-alpha.9',
  isRTL: false,
  locale: {
    dateFormat: 'F j, Y',
    timeFormat: 'g:i a',
    gmtOffset: -4,
    timezone: 'America/New_York',
    weekStartsOn: 0,
  },
};

/**
 * The fixture mainly follows the `@testing-library/react` library pattern, but
 * in the scope of the whole editor and the real browser. As such:
 *
 * - Call `set` and `stub` methods to configure the fixture before calling
 * the `render()` method.
 * - Call the `fixture.render()` method similarly to the
 * `@testing-library/react`'s `render()` before doing the actual tests.
 * - Call the `fixture.renderHook()` method similarly to the
 * `@testing-library/react`'s `renderHook()` to render a hook in the context
 * of the whole editor. A more fine-grained `renderHook()` can also be called
 * on a component stub. See the `fixture.stubComponent()` for more info.
 * - Call the `await fixture.act()` method similarly to the
 * `@testing-library/react`'s `act()` method for any action. Notice that events
 * automatically use `act()` internally.
 * - Call the `await fixture.events` methods to drive the events similarly
 * to the `@testing-library/react`'s `fireEvent`, except that these events will
 * be executed natively in the browser.
 */
export class Fixture {
  constructor() {
    this._config = { ...DEFAULT_CONFIG };

    this._componentStubs = new Map();
    const origCreateElement = React.createElement;
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
      return origCreateElement(type, props, ...children);
    });

    this.apiProviderFixture_ = new APIProviderFixture();
    this.stubComponent(APIProvider).callFake(
      this.apiProviderFixture_.Component
    );

    this.fileProviderFixture_ = new FileProviderFixture();
    this.stubComponent(FileProvider).callFake(
      this.fileProviderFixture_.Component
    );

    this._layoutStub = this.stubComponent(Layout);

    this._events = new FixtureEvents(this.act.bind(this));

    this._container = null;

    this._editor = null;
  }

  restore() {
    window.location.hash = '#';
    localStorage.clear();
  }

  get container() {
    return this._container;
  }

  get document() {
    return this._container.ownerDocument;
  }

  get screen() {
    return this._screen;
  }

  get editor() {
    return this._editor;
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

  /**
   * Stubs a component. Can be used to render hooks on this component's level
   * or even to completely replace the implementation of the component.
   *
   * All components must be stubbed before the `fixture.render()` is called.
   *
   * Use sparingly. See `ComponentStub` for more info.
   *
   * @param {Function} component Component to stub.
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
   * @param {Object} flags Flags.
   */
  setFlags(flags) {
    this._flags = { ...flags };
  }

  /**
   * @param {Array<Object>} pages Pages.
   */
  setPages(pages) {
    this.apiProviderFixture_.setPages(pages);
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
    Modal.setAppElement(root);

    const { container, getByRole } = render(
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

    this._editor = new EditorContainer(
      getByRole('region', { name: 'Web Stories Editor' }),
      'editor'
    );

    // wait for the media gallery items to load, as many tests assume they're
    // there
    let mediaElements;
    await waitFor(() => {
      mediaElements = this.querySelectorAll('[data-testid=mediaElement]');
      if (!mediaElements?.length) {
        throw new Error(
          `Not ready: only found ${mediaElements?.length} media elements`
        );
      }
    });

    // @todo: find a stable way to wait for the story to fully render. Can be
    // implemented via `waitFor`.
  }

  /**
   * Calls a hook in the context of the whole editor.
   *
   * Similar to the `@testing-library/react`'s `renderHook()` method.
   *
   * @param {Function} func The hook function. E.g. `useStory`.
   * @return {Promise<Object>} Resolves when the hook is rendered with the
   * value of the hook.
   */
  renderHook(func) {
    return this._layoutStub.renderHook(func);
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
        <>
          <HookExecutor key={refresher} hooks={hooks} />
          <Impl _wrapped={true} ref={ref} {...props} />
        </>
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

/* eslint-disable react/prop-types, react/jsx-no-useless-fragment */
function HookExecutor({ hooks }) {
  hooks.forEach((func) => func());
  return <></>;
}
/* eslint-enable react/prop-types, react/jsx-no-useless-fragment */

class FileProviderFixture {
  constructor() {
    this._pages = [];

    // eslint-disable-next-line react/prop-types
    const Comp = ({ children }) => {
      const getFonts = useCallback(
        () =>
          asyncResponse([
            {
              name: 'Abel',
              value: 'Abel',
              family: 'Abel',
              fallbacks: ['sans-serif'],
              service: 'fonts.google.com',
              weights: [400],
              styles: ['regular'],
              variants: [[0, 400]],
            },
            {
              name: 'Abhaya Libre',
              value: 'Abhaya Libre',
              family: 'Abhaya Libre',
              fallbacks: ['serif'],
              service: 'fonts.google.com',
              weights: [400, 500, 600, 700, 800],
              styles: ['regular'],
              variants: [
                [0, 400],
                [0, 500],
                [0, 600],
                [0, 700],
                [0, 800],
              ],
            },
            ...[TEXT_ELEMENT_DEFAULT_FONT].map((font) => ({
              name: font.family,
              value: font.family,
              ...font,
            })),
            {
              name: 'Source Serif Pro',
              value: 'Source Serif Pro',
              family: 'Source Serif Pro',
              fallbacks: ['serif'],
              service: 'fonts.google.com',
              weights: [400, 600, 700],
              styles: ['regular'],
              variants: [
                [0, 400],
                [0, 600],
                [0, 700],
              ],
            },
            {
              name: 'Space Mono',
              value: 'Space Mono',
              family: 'Space Mono',
              fallbacks: ['monospace'],
              service: 'fonts.google.com',
              weights: [400, 700],
              styles: ['regular', 'italic'],
              variants: [
                [0, 400],
                [1, 400],
                [0, 700],
                [1, 700],
              ],
            },
            {
              name: 'Ubuntu',
              value: 'Ubuntu',
              family: 'Ubuntu',
              fallbacks: ['monospace'],
              service: 'fonts.google.com',
              weights: [400, 700],
              styles: ['regular', 'italic'],
              variants: [
                [0, 400],
                [1, 400],
                [0, 700],
                [1, 700],
              ],
            },
            {
              name: 'Yrsa',
              value: 'Yrsa',
              family: 'Yrsa',
              fallbacks: ['serif'],
              service: 'fonts.google.com',
              weights: [300, 400, 500, 600, 700],
              styles: ['regular'],
              variants: [
                [0, 300],
                [0, 400],
                [0, 500],
                [0, 600],
                [0, 700],
              ],
            },
          ]),
        []
      );

      const state = {
        actions: { getFonts },
      };
      return (
        <FileContext.Provider value={state}>{children}</FileContext.Provider>
      );
    };
    Comp.displayName = 'Fixture(FileProvider)';
    this._comp = Comp;
  }

  get Component() {
    return this._comp;
  }
}

/* eslint-disable jasmine/no-unsafe-spy */
class APIProviderFixture {
  constructor() {
    this._pages = [];

    // eslint-disable-next-line react/prop-types
    const Comp = ({ children }) => {
      const getStoryById = useCallback(
        // @todo: put this to __db__/
        () =>
          asyncResponse({
            title: { raw: '' },
            status: 'draft',
            author: 1,
            slug: '',
            date_gmt: '2020-05-06T22:32:37',
            modified: '2020-05-06T22:32:37',
            excerpt: { raw: '' },
            link: 'http://stories.local/?post_type=web-story&p=1',
            story_data: {
              version: DATA_VERSION,
              pages: this._pages,
            },
            featured_media: 0,
            featured_media_url: '',
            publisher_logo_url:
              'http://stories .local/wp-content/plugins/web-stories/assets/images/logo.png',
            permalink_template: 'http://stories3.local/stories/%pagename%/',
            style_presets: { textStyles: [], colors: [] },
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

      const getMedia = useCallback(({ mediaType, searchTerm, pagingNum }) => {
        const filterByMediaType = mediaType
          ? ({ mime_type }) => mime_type.startsWith(mediaType)
          : () => true;
        const filterBySearchTerm = searchTerm
          ? ({ alt_text }) => alt_text.includes(searchTerm)
          : () => true;
        // Generate 7*6=42 items, 3 pages
        const clonedMedia = Array(6)
          .fill(getMediaResponse)
          .flat()
          .map((media, i) => ({ ...media, id: i + 1 }));
        return asyncResponse({
          data: clonedMedia
            .slice((pagingNum - 1) * MEDIA_PER_PAGE, pagingNum * MEDIA_PER_PAGE)
            .filter(filterByMediaType)
            .filter(filterBySearchTerm),
          headers: { 'X-WP-TotalPages': 3 },
        });
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
        () =>
          asyncResponse({
            url: 'https://example.com',
            title: 'Example Site',
            image: 'example.jpg',
          }),
        []
      );

      const getAllStatuses = useCallback(
        () => jasmine.createSpy('getAllStatuses'),
        []
      );

      const getAllUsers = useCallback(
        () => asyncResponse([{ id: 1, name: 'John Doe' }]),
        []
      );

      const state = {
        actions: {
          autoSaveById,
          getStoryById,
          getMedia,
          getLinkMetadata,
          saveStoryById,
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

  /**
   * @param {Array<Object>} pages Pages.
   */
  setPages(pages) {
    this._pages = pages.map((page) => {
      const result = createPage(page);
      // Overwrite ID used in testing.
      if (page.id !== undefined) {
        result.id = page.id;
      }
      return result;
    });
  }

  get Component() {
    return this._comp;
  }
}
/* eslint-enable jasmine/no-unsafe-spy */

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
