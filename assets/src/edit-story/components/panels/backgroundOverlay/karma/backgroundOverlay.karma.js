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
 * Internal dependencies
 */
import { Fixture } from '../../../../karma';
import { useStory } from '../../../../app/story';

describe('Background Overlay Panel', () => {
  let fixture;
  let bgImageId;
  const getOverlay = () => getElementOverlay(fixture, bgImageId);
  const getOverlaySwitcher = (type) =>
    fixture.screen.getByLabelText(`Set overlay: ${type}`);

  beforeEach(async () => {
    jasmine.addMatchers(customMatchers);

    fixture = new Fixture();
    await fixture.render();

    await addDummyImage(fixture, 0);
    const setAsBackground = fixture.screen.getByRole('button', {
      name: 'Set as background',
    });
    await fixture.events.click(setAsBackground);
    const {
      state: {
        currentPage: { elements },
      },
    } = await fixture.renderHook(() => useStory());
    bgImageId = elements[0].id;
  });

  afterEach(() => {
    fixture.restore();
  });

  it('should render when there is an image in the background', () => {
    expect(getOverlaySwitcher('None')).toBeTruthy();

    const overlay = getOverlay();
    expect(overlay).not.toBeTruthy();
  });

  it('should render correct overlay when clicking "solid"', async () => {
    getOverlaySwitcher('Solid').click();

    const overlay = await waitFor(getOverlay);
    expect(overlay).toBeTruthy();
    expect(overlay).toHaveStyle('background-color', 'rgba(0, 0, 0, 0.3)');
  });

  it('should render correct overlay when clicking "linear"', async () => {
    getOverlaySwitcher('Linear').click();

    const overlay = await waitFor(getOverlay);
    expect(overlay).toBeTruthy();
    expect(overlay).toHaveStyle(
      'background-image',
      'linear-gradient(rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.9) 100%)'
    );
  });

  it('should render correct overlay when clicking "radial"', async () => {
    getOverlaySwitcher('Radial').click();

    const overlay = await waitFor(getOverlay);
    expect(overlay).toBeTruthy();
    expect(overlay).toHaveStyle(
      'background-image',
      'radial-gradient(80% 50%, rgba(0, 0, 0, 0) 25%, rgba(0, 0, 0, 0.6) 100%)'
    );
  });
});

function getMediaLibraryElementByIndex(fixture, index) {
  return fixture.querySelectorAll('[data-testid=mediaElement]')[index];
}

function getElementOverlay(fixture, id) {
  return fixture.querySelector(
    `[data-element-id="${id}"] [class^="displayElement__BackgroundOverlay"]`
  );
}

async function addDummyImage(fixture, index) {
  await fixture.events.click(getMediaLibraryElementByIndex(fixture, index));
}

const customMatchers = {
  toHaveStyle: (util, customEqualityTesters) => ({
    compare: function (element, property, expected) {
      const actual = getComputedStyle(element)[property];
      const pass = util.equals(actual, expected, customEqualityTesters);
      return {
        pass,
        message: pass
          ? `Expected element to not have style "${property}: ${expected}"`
          : `Expected element to have style "${property}: ${expected}" but found "${actual}"`,
      };
    },
  }),
};

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function waitFor(callback) {
  let msToWait = [0, 1, 5, 10, 100]; // we use some exponential fall-off

  while (msToWait.length) {
    let [msToWaitNow, ...msToWaitNext] = msToWait;
    msToWait = msToWaitNext;
    // Disable reason: This is how this function is normally defined
    // See e.g. https://makandracards.com/makandra/75562-jasmine-using-async-await-to-write-nice-asynchronous-specs
    // eslint-disable-next-line no-await-in-loop
    await wait(msToWaitNow);
    let result = callback();
    if (result) {
      return result;
    }
  }

  throw new Error('timed out waiting');
}
