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

import { Fixture, FIXTURE_DEFAULT_CONFIG } from '../fixture';
import storyResponse from '../fixture/db/storyResponse';

describe('Integration Layer tests : Optional API Callbacks', () => {
  let fixture;

  const shouldRenderWithoutError = async () => {
    let error;
    try {
      await fixture.render();
    } catch (e) {
      error = e;
    }
    expect(error).toBeUndefined();
  };

  it('should not break editor, if getCurrentUser callback is not defined', async () => {
    fixture = new Fixture({ mocks: { getCurrentUser: undefined } });
    await shouldRenderWithoutError();
  });

  it('should not break editor, if updateCurrentUser callback is not defined', async () => {
    fixture = new Fixture({ mocks: { updateCurrentUser: undefined } });
    await shouldRenderWithoutError();
  });

  it('should not break editor, if getProxyUrl callback is not defined', async () => {
    fixture = new Fixture({ mocks: { getProxyUrl: undefined } });
    await shouldRenderWithoutError();
  });

  it('should not break editor, if getPublisherLogos callback is not defined', async () => {
    fixture = new Fixture({ mocks: { getPublisherLogos: undefined } });
    await shouldRenderWithoutError();
  });

  it('should not break editor, if addPublisherLogo callback is not defined', async () => {
    fixture = new Fixture({ mocks: { addPublisherLogo: undefined } });
    await shouldRenderWithoutError();
  });

  it('if initialEdits is NOT passed, getStoryById should be called to load a story', async () => {
    const getStoryById = jasmine
      .createSpy('getStoryById')
      .and.callFake((storyId) => {
        return Promise.resolve({
          storyId,
          ...storyResponse,
        });
      });
    fixture = new Fixture({ mocks: { getStoryById } });
    await shouldRenderWithoutError();
    expect(getStoryById).toHaveBeenCalledWith(FIXTURE_DEFAULT_CONFIG.storyId);
  });

  it('should not render 1p media panel if getMedia callback is not defined', async () => {
    fixture = new Fixture({ mocks: { getMedia: undefined } });
    await fixture.render();

    //clear localStorage to force 3p media usage notice to appear
    localStorage.clear();

    await waitFor(async () => {
      await fixture.events.click(fixture.screen.getByText('Dismiss'));
    });
    await fixture.collapseHelpCenter();

    const firstMediaButton = fixture.querySelector(`[id=library-tab-media]`);
    const thirdMediaButton = fixture.querySelector(`[id=library-tab-media3p]`);

    expect(firstMediaButton).not.toBeTruthy();
    expect(thirdMediaButton).toBeTruthy();
  });

  it('should not render custom page templates option if getCustomPageTemplates callback is undefined', async () => {
    fixture = new Fixture({ mocks: { getCustomPageTemplates: undefined } });
    await shouldRenderWithoutError();

    //clear localStorage to force selection of default page templates.
    localStorage.clear();

    await fixture.collapseHelpCenter();

    await waitFor(async () => {
      await fixture.events.click(fixture.editor.library.pageTemplatesTab);
    });

    expect(fixture.editor.library.pageTemplatesPane.dropDown).toBeNull();
  });
});
