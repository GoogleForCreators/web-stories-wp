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
  configure,
  render,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { setAppElement } from '@googleforcreators/design-system';
import { FixtureEvents } from '@googleforcreators/karma-fixture';
import { DATA_VERSION } from '@googleforcreators/migration';
import {
  createPage,
  TEXT_ELEMENT_DEFAULT_FONT,
  registerElementType,
} from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import StoryEditor from '../../storyEditor';
import APIProvider from '../../app/api/apiProvider';
import APIContext from '../../app/api/context';
import Layout from '../../components/layout';
import formattedTemplatesArray from '../../dataUtils/formattedTemplatesArray';
import { PRESET_TYPES } from '../../constants';
import getMediaResponse from './db/getMediaResponse';
import { Editor as EditorContainer } from './containers';
import taxonomiesResponse from './db/getTaxonomiesResponse';
import singleSavedTemplate from './db/singleSavedTemplate';
import HeaderLayout from './components/header';
import storyResponse from './db/storyResponse';
import DocumentPane, {
  PublishModalDocumentPane,
} from './components/documentPane';
import { Accessibility, Design, Priority } from './components/checklist';

const React = require('react');
const { useCallback, useState, useMemo, forwardRef } = React;

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

export const MEDIA_PER_PAGE = 20;
export const LOCAL_MEDIA_PER_PAGE = 50;

function MediaUpload({ render: _render, onSelect }) {
  const open = () => {
    const image = {
      type: 'image',
      src: 'http://localhost:9876/__static__/saturn.jpg',
      baseColor: '#734727',
      id: 4,
      guid: {
        rendered: 'http://localhost:9876/__static__/saturn.jpg',
      },
      alt: 'saturn',
      mimeType: 'image/jpeg',
      width: 634,
      height: 640,
    };
    onSelect(image);
  };

  return _render(open);
}

export const FIXTURE_DEFAULT_CONFIG = {
  storyId: 1,
  api: {},
  allowedMimeTypes: {
    audio: ['audio/mpeg', 'audio/aac', 'audio/wav', 'audio/ogg'],
    image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
    caption: ['text/vtt'],
    vector: ['image/svg+xml'],
    video: ['video/mp4', 'video/webm'],
  },
  capabilities: {
    hasUploadMediaAction: true,
  },
  nonce: '123456789',
  version: '1.0.0-alpha.9',
  isRTL: false,
  showMedia3p: true,
  canViewDefaultTemplates: true,
  locale: {
    dateFormat: 'F j, Y',
    timeFormat: 'g:i a',
    gmtOffset: -4,
    timezone: 'America/New_York',
    weekStartsOn: 0,
  },
  flags: {},
  MediaUpload,
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
 *
 * Network calls are mocked out in the {@link:APIProviderFixture} but can be
 * overridden by passing `mocks` when initializing the fixture
 * Ex: `new Fixture({ mocks: { getCurrentUser: noop, updateCurrentUser: noop } })
 */
export class Fixture {
  /**
   *
   * @param {Object} config The configuration object
   * @param {Object} config.mocks An object containing functions to be used as stubs for the api.
   */
  constructor({ mocks } = {}) {
    this._config = { ...FIXTURE_DEFAULT_CONFIG };

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

    this.apiProviderFixture_ = new APIProviderFixture({ mocks });
    this.stubComponent(APIProvider).callFake(
      this.apiProviderFixture_.Component
    );

    this._layoutStub = this.stubComponent(Layout);

    this._events = new FixtureEvents(this.act.bind(this));

    this._container = null;

    this._editor = null;

    const panels = [
      'animation',
      'borderStyle',
      'captions',
      'globalStoryStyles',
      'colorPresets',
      'filter',
      'imageAccessibility',
      'link',
      'pageAttachment',
      'pageBackground',
      'videoPoster',
      'size',
      'shapeStyle',
      'text',
      'textBox',
      'textStyle',
      'videoOptions',
      'videoAccessibility',
      'elementAlignment',
      'noselection',
      'publishing',
      'status',
      `stylepreset-${PRESET_TYPES.STYLE}`,
    ];
    // Open all panels by default.
    panels.forEach((panel) => {
      localStorage.setItem(
        `web_stories_ui_panel_settings:${panel}`,
        JSON.stringify({ isCollapsed: false })
      );
    });
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
    this._flags = { ...this._config.flags, ...flags };
    this._config.flags = this._flags;
  }

  setConfig(config) {
    this._config = { ...this._config, ...config };
  }

  /**
   * @param {Array<Object>} pages Pages.
   */
  setPages(pages) {
    elementTypes.forEach(registerElementType);
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
    root.setAttribute('dir', this._config.isRTL ? 'rtl' : 'ltr');

    // see http://reactcommunity.org/react-modal/accessibility/
    setAppElement(root);

    elementTypes.forEach(registerElementType);

    const { container, getByRole } = render(
      <StoryEditor key={Math.random()} config={this._config}>
        <Layout
          header={<HeaderLayout />}
          footer={{
            secondaryMenu: {
              checklist: {
                Priority,
                Design,
                Accessibility,
              },
            },
          }}
          sidebarTabs={{
            document: {
              title: 'Document',
              Pane: DocumentPane,
            },
            publishModal: {
              DocumentPane: PublishModalDocumentPane,
            },
          }}
        />
      </StoryEditor>,
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
    await waitFor(
      () => {
        mediaElements = this.querySelectorAll('[data-testid^=mediaElement]');
        if (!mediaElements?.length) {
          throw new Error(
            `Not ready: only found ${mediaElements?.length} media elements`
          );
        }
      },
      { timeout: 5000 }
    );

    // Check to see if Google Sans font is loaded.
    await waitFor(async () => {
      const weights = ['400', '700'];
      const font = '12px "Google Sans"';
      const fonts = weights.map((weight) => `${weight} ${font}`);
      await Promise.all(
        fonts.map((thisFont) => {
          document.fonts.load(thisFont, '');
        })
      );
      fonts.forEach((thisFont) => {
        if (!document.fonts.check(thisFont, '')) {
          throw new Error('Not ready: Google Sans font could not be loaded');
        }
      });
    });
  }

  /**
   * Tells the fixture to close the help center
   * which will default to open the first time the fixture renders.
   *
   * @return {Promise<Object>} Resolves when help center toggle is clicked.
   */
  collapseHelpCenter() {
    const { _editor, _events } = this;
    if (!_editor || !_events) {
      throw new Error('Not ready: Help Center unable to collapse');
    }

    const { toggleButton } = _editor.helpCenter;

    return _events.click(toggleButton);
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
          <Impl _wrapped ref={ref} {...props} />
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

/* eslint-disable jasmine/no-unsafe-spy */
class APIProviderFixture {
  /**
   * @param {Object} config The configuration object
   * @param {Object} config.mocks function that will be used as a stub. Property name must match the action name exactly.
   */
  constructor({ mocks = {} } = {}) {
    this._pages = [];
    // begins at 4 because mocks have children with ids [1, 2, 3]
    this._termAutoIncrementId = 4;

    // eslint-disable-next-line react/prop-types
    const Comp = ({ children }) => {
      const getStoryById = useCallback(
        () =>
          asyncResponse({
            ...storyResponse,
            storyData: {
              version: DATA_VERSION,
              pages: this._pages,
            },
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
          ? ({ mimeType }) => mimeType.startsWith(mediaType)
          : () => true;
        const filterBySearchTerm = searchTerm
          ? ({ alt_text }) => alt_text.includes(searchTerm)
          : () => true;
        // Generate 8*13=104 items, 3 pages
        const clonedMedia = Array(13)
          .fill(getMediaResponse)
          .flat()
          .map((media, i) => ({ ...media, id: i + 1 }));
        return asyncResponse({
          data: clonedMedia
            .slice(
              (pagingNum - 1) * LOCAL_MEDIA_PER_PAGE,
              pagingNum * LOCAL_MEDIA_PER_PAGE
            )
            .filter(filterByMediaType)
            .filter(filterBySearchTerm),
          headers: { totalPages: 3 },
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

      const getHotlinkInfo = useCallback(
        () =>
          asyncResponse({
            ext: 'jpg',
            mimeType: 'image/jpeg',
            type: 'image',
            fileName: 'example.jpg',
          }),
        []
      );

      const getProxyUrl = useCallback(
        () => 'http://localhost:9876/__static__/saturn.jpg',
        []
      );

      const getAllStatuses = useCallback(
        () => jasmine.createSpy('getAllStatuses'),
        []
      );

      const users = useMemo(
        () => [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Doe' },
        ],
        []
      );

      const getAuthors = useCallback(() => asyncResponse(users), [users]);

      const getCurrentUser = useCallback(
        () =>
          asyncResponse({
            id: 1,
            trackingOptin: false,
            onboarding: {},
            mediaOptimization: true,
          }),
        []
      );

      const updateCurrentUser = useCallback(
        () =>
          asyncResponse({
            id: 1,
            trackingOptin: false,
            onboarding: {},
            mediaOptimization: true,
          }),
        []
      );

      const getStatusCheck = useCallback(
        () =>
          asyncResponse({
            success: true,
          }),
        []
      );

      const getPageTemplates = useCallback(
        () => asyncResponse(formattedTemplatesArray),
        []
      );

      const getCustomPageTemplates = useCallback(
        () => asyncResponse({ templates: [], hasMore: false }),
        []
      );
      const addPageTemplate = useCallback(
        () => asyncResponse({ ...singleSavedTemplate, templateId: 123 }),
        []
      );
      const deletePageTemplate = useCallback(() => asyncResponse(), []);

      const getTaxonomyTerm = useCallback(
        (_, args) =>
          asyncResponse(
            args.orderby
              ? [
                  {
                    id: this._termAutoIncrementId++,
                    count: 3,
                    description: '',
                    link: '',
                    name: 'related slug 1',
                    slug: 'related-slug-1',
                    taxonomy: 'web_story_tag',
                    meta: [],
                  },
                  {
                    id: this._termAutoIncrementId++,
                    count: 2,
                    description: '',
                    link: '',
                    name: 'related slug 2',
                    slug: 'related-slug-2',
                    taxonomy: 'web_story_tag',
                    meta: [],
                  },
                ]
              : []
          ),
        []
      );

      const createTaxonomyTerm = useCallback(
        (_endpoint, data) =>
          asyncResponse({
            id: this._termAutoIncrementId++,
            count: 0,
            description: '',
            link: '',
            name: 'random name',
            slug:
              data?.name?.toLowerCase().replace(/[\s./_]/, '-') ||
              'random-slug',
            taxonomy: 'web_story_category',
            parent: 0,
            meta: [],
            ...data,
          }),
        []
      );

      const getTaxonomies = useCallback(
        () => asyncResponse(taxonomiesResponse),
        []
      );

      const getFonts = useCallback((params) => {
        let fonts = [
          {
            name: 'Abel',
            value: 'Abel',
            family: 'Abel',
            fallbacks: ['sans-serif'],
            weights: [400],
            styles: ['regular'],
            variants: [[0, 400]],
            service: 'fonts.google.com',
            metrics: {
              upm: 2048,
              asc: 2006,
              des: -604,
              tAsc: 2006,
              tDes: -604,
              tLGap: 0,
              wAsc: 2006,
              wDes: 604,
              xH: 1044,
              capH: 1434,
              yMin: -604,
              yMax: 2005,
              hAsc: 2006,
              hDes: -604,
              lGap: 0,
            },
          },
          {
            name: 'Abhaya Libre',
            value: 'Abhaya Libre',
            family: 'Abhaya Libre',
            fallbacks: ['serif'],
            weights: [400, 500, 600, 700, 800],
            styles: ['regular'],
            variants: [
              [0, 400],
              [0, 500],
              [0, 600],
              [0, 700],
              [0, 800],
            ],
            service: 'fonts.google.com',
            metrics: {
              upm: 1024,
              asc: 860,
              des: -348,
              tAsc: 860,
              tDes: -348,
              tLGap: 0,
              wAsc: 860,
              wDes: 348,
              yMin: -340,
              yMax: 856,
              hAsc: 860,
              hDes: -348,
              lGap: 0,
            },
          },
          {
            value: 'Overpass Regular',
            name: 'Overpass Regular',
            family: 'Overpass Regular',
            fallbacks: ['sans-serif'],
            weights: [400],
            styles: ['regular'],
            variants: [[0, 400]],
            url: 'https://overpass-30e2.kxcdn.com/overpass-regular.ttf',
            service: 'custom',
            metrics: {
              upm: 1000,
              asc: 982,
              des: -284,
              tAsc: 750,
              tDes: -250,
              tLGap: 266,
              wAsc: 1062,
              wDes: 378,
              xH: 511,
              capH: 700,
              yMin: -378,
              yMax: 1062,
              hAsc: 982,
              hDes: -284,
              lGap: 266,
            },
          },
          {
            ...TEXT_ELEMENT_DEFAULT_FONT,
            name: TEXT_ELEMENT_DEFAULT_FONT.family,
            value: TEXT_ELEMENT_DEFAULT_FONT.family,
          },
          {
            name: 'Source Serif Pro',
            value: 'Source Serif Pro',
            family: 'Source Serif Pro',
            fallbacks: ['serif'],
            weights: [200, 300, 400, 600, 700, 900],
            styles: ['italic', 'regular'],
            variants: [
              [0, 200],
              [1, 200],
              [0, 300],
              [1, 300],
              [0, 400],
              [1, 400],
              [0, 600],
              [1, 600],
              [0, 700],
              [1, 700],
              [0, 900],
              [1, 900],
            ],
            service: 'fonts.google.com',
            metrics: {
              upm: 1000,
              asc: 918,
              des: -335,
              tAsc: 918,
              tDes: -335,
              tLGap: 0,
              wAsc: 1036,
              wDes: 335,
              xH: 475,
              capH: 670,
              yMin: -335,
              yMax: 1002,
              hAsc: 918,
              hDes: -335,
              lGap: 0,
            },
          },
          {
            name: 'Space Mono',
            value: 'Space Mono',
            family: 'Space Mono',
            fallbacks: ['monospace'],
            weights: [400, 700],
            styles: ['regular', 'italic'],
            variants: [
              [0, 400],
              [1, 400],
              [0, 700],
              [1, 700],
            ],
            service: 'fonts.google.com',
            metrics: {
              upm: 1000,
              asc: 1120,
              des: -361,
              tAsc: 1120,
              tDes: -361,
              tLGap: 0,
              wAsc: 1120,
              wDes: 361,
              xH: 496,
              capH: 700,
              yMin: -309,
              yMax: 1090,
              hAsc: 1120,
              hDes: -361,
              lGap: 0,
            },
          },
          {
            name: 'Ubuntu',
            value: 'Ubuntu',
            family: 'Ubuntu',
            fallbacks: ['sans-serif'],
            weights: [300, 400, 500, 700],
            styles: ['italic', 'regular'],
            variants: [
              [0, 300],
              [1, 300],
              [0, 400],
              [1, 400],
              [0, 500],
              [1, 500],
              [0, 700],
              [1, 700],
            ],
            service: 'fonts.google.com',
            metrics: {
              upm: 1000,
              asc: 932,
              des: -189,
              tAsc: 776,
              tDes: -185,
              tLGap: 56,
              wAsc: 932,
              wDes: 189,
              xH: 520,
              capH: 693,
              yMin: -189,
              yMax: 962,
              hAsc: 932,
              hDes: -189,
              lGap: 28,
            },
          },
          {
            name: 'Vazir Regular',
            value: 'Vazir Regular',
            family: 'Vazir Regular',
            fallbacks: ['sans-serif'],
            weights: [400],
            styles: ['regular'],
            variants: [[0, 400]],
            url: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.ttf',
            service: 'custom',
            metrics: {
              upm: 2048,
              asc: 2200,
              des: -1100,
              tAsc: 2200,
              tDes: -1100,
              tLGap: 0,
              wAsc: 2200,
              wDes: 1100,
              xH: 1082,
              capH: 1638,
              yMin: -1116,
              yMax: 2163,
              hAsc: 2200,
              hDes: -1100,
              lGap: 0,
            },
          },
          {
            name: 'Yrsa',
            value: 'Yrsa',
            family: 'Yrsa',
            fallbacks: ['serif'],
            weights: [300, 400, 500, 600, 700],
            styles: ['regular', 'italic'],
            variants: [
              [0, 300],
              [0, 400],
              [0, 500],
              [0, 600],
              [0, 700],
              [1, 300],
              [1, 400],
              [1, 500],
              [1, 600],
              [1, 700],
            ],
            service: 'fonts.google.com',
            metrics: {
              upm: 1000,
              asc: 728,
              des: -272,
              tAsc: 728,
              tDes: -272,
              tLGap: 218,
              wAsc: 971,
              wDes: 422,
              xH: 413,
              capH: 568,
              yMin: -211,
              yMax: 925,
              hAsc: 728,
              hDes: -272,
              lGap: 218,
            },
          },
        ];

        if (params.include) {
          fonts = fonts.filter(({ family }) => params.include.includes(family));
        }

        if (params.search) {
          fonts = fonts.filter(({ family }) =>
            family.toLowerCase().includes(params.search.toLowerCase())
          );
        }

        // If we're getting custom fonts, return custom only.
        if (params.service) {
          fonts = fonts.filter(({ service }) => {
            if ('custom' === params.service) {
              return service === params.service;
            }
            if ('builtin' === params.service) {
              return 'fonts.google.com' === params.service;
            }
            return [];
          });
        }

        return asyncResponse(fonts);
      }, []);

      const state = {
        actions: {
          autoSaveById,
          getStoryById,
          getMedia,
          getLinkMetadata,
          getHotlinkInfo,
          getProxyUrl,
          saveStoryById,
          getAllStatuses,
          getAuthors,
          uploadMedia,
          updateMedia,
          getStatusCheck,
          addPageTemplate,
          getCustomPageTemplates,
          deletePageTemplate,
          getPageTemplates,
          getCurrentUser,
          updateCurrentUser,
          getTaxonomyTerm,
          createTaxonomyTerm,
          getTaxonomies,
          getFonts,
          ...mocks,
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
