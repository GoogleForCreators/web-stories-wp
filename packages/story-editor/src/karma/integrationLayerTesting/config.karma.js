/*
 * Copyright 2021 Google LLC
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

import { waitFor } from '@testing-library/react';

/**
 * Internal dependencies
 */

import getDefaultConfig from '../../getDefaultConfig';
import { Fixture, FIXTURE_DEFAULT_CONFIG } from '../fixture';
import storyResponse from '../fixture/db/storyResponse';

describe('Integration Layer tests : EditorConfig Params :', () => {
  let fixture;

  // fixture.setConfig() doesn't overwrite the whole object but merges
  // therefore optional params need to be set undefined explicitly.
  const MINIMUM_CONFIG = {};

  for (const key of Object.keys(getDefaultConfig())) {
    MINIMUM_CONFIG[key] = undefined;
  }

  MINIMUM_CONFIG.storyId = 1;
  MINIMUM_CONFIG.apiCallbacks = {
    saveStoryById: () => new Promise.resolve({}),
  };

  afterEach(() => {
    fixture.restore();
  });

  const shouldRenderWithConfig = async (config) => {
    let error;
    try {
      fixture.setConfig(config);
      await fixture.render();
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  };

  it('should work with optional params being undefined', async () => {
    fixture = new Fixture();
    await shouldRenderWithConfig(MINIMUM_CONFIG);
  });

  it('should NOT show media 3p panel if showMedia3p param is false', async () => {
    fixture = new Fixture();
    await shouldRenderWithConfig({
      ...MINIMUM_CONFIG,
      showMedia3p: false,
    });
    await fixture.collapseHelpCenter();

    const firstMediaButton = fixture.querySelector(`[id=library-tab-media]`);
    const thirdMediaButton = fixture.querySelector(`[id=library-tab-media3p]`);

    expect(firstMediaButton).toBeTruthy();
    expect(thirdMediaButton).toBeFalsy();
  });

  it('should add new tip using additionalTips param into helpcenter', async () => {
    fixture = new Fixture();

    const exampleTip = {
      title: 'Example Tip Title',
      figureSrcImg: 'images/help-center/story_embed_module_1',
      figureAlt: 'Figure alt text',
      description: [
        'This is an example tip used for testing. <a>Learn more</a>',
      ],
      href: 'https://github.com/googleforcreators/web-stories-wp',
    };
    await shouldRenderWithConfig({
      ...MINIMUM_CONFIG,
      additionalTips: {
        exampleTip,
      },
    });

    //do not close helpcenter, check for additional tip

    await expect(fixture.screen.findByText(exampleTip.title)).toBeTruthy();
  });

  it('should call getStoryById with storyId passed in editorConfig', async () => {
    const STORY_ID = 11;
    const getStoryById = jasmine
      .createSpy('getStoryById')
      .and.callFake((storyId) => {
        return Promise.resolve({
          storyId,
          ...storyResponse,
          status: 'publish',
        });
      });

    fixture = new Fixture({
      mocks: { getStoryById },
    });

    await shouldRenderWithConfig({
      ...MINIMUM_CONFIG,
      storyId: STORY_ID,
    });

    expect(getStoryById).toHaveBeenCalledWith(STORY_ID);
  });

  it('should render upload button if capabilities.hasUploadMediaAction is true', async () => {
    fixture = new Fixture();

    await shouldRenderWithConfig({
      ...MINIMUM_CONFIG,
      apiCallbacks: {
        ...MINIMUM_CONFIG.apiCallbacks,
      },
      capabilities: {
        hasUploadMediaAction: true,
      },
      MediaUpload: FIXTURE_DEFAULT_CONFIG.MediaUpload,
    });

    await fixture.collapseHelpCenter();

    const uploadButton = await fixture.screen.findByRole('button', {
      name: 'Upload',
    });

    expect(uploadButton).toBeTruthy();
  });

  it('should not render upload button if capabilities.hasUploadMediaAction is false', async () => {
    fixture = new Fixture();

    await shouldRenderWithConfig({
      ...MINIMUM_CONFIG,
      apiCallbacks: {
        ...MINIMUM_CONFIG.apiCallbacks,
      },
      capabilities: {
        hasUploadMediaAction: false,
      },
      MediaUpload: FIXTURE_DEFAULT_CONFIG.MediaUpload,
    });

    await fixture.collapseHelpCenter();

    //wait for mediaPane to stabalize
    await fixture.events.sleep(500);

    const uploadButton = fixture.screen.queryByRole('button', {
      name: 'Upload',
    });
    expect(uploadButton).toBeFalsy();
  });

  it('should not render upload by link button if flags.enableHotlinking is false', async () => {
    fixture = new Fixture();

    fixture.setFlags({ enableHotlinking: false });

    await shouldRenderWithConfig({
      ...MINIMUM_CONFIG,
      capabilities: {
        hasUploadMediaAction: true,
      },
      MediaUpload: FIXTURE_DEFAULT_CONFIG.MediaUpload,
    });

    await fixture.collapseHelpCenter();

    //wait for mediaPane to stabalize
    await fixture.events.sleep(500);

    const insertByLinkButton = fixture.querySelector(
      `[aria-label="Insert by link"]`
    );

    expect(insertByLinkButton).toBeFalsy();
  });

  it('should render upload by link button if flags.enableHotlinking is true', async () => {
    fixture = new Fixture();

    fixture.setFlags({ enableHotlinking: true });

    await shouldRenderWithConfig({
      ...MINIMUM_CONFIG,
      capabilities: {
        hasUploadMediaAction: true,
      },
      MediaUpload: FIXTURE_DEFAULT_CONFIG.MediaUpload,
    });

    await fixture.collapseHelpCenter();

    await waitFor(() => {
      const insertByLinkButton = fixture.querySelector(
        `[aria-label="Insert by link"]`
      );
      if (!insertByLinkButton) {
        throw new Error('insertByLinkButton not ready');
      }
      expect(insertByLinkButton).toBeTruthy();
    });
  });
});
