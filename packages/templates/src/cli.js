#!/usr/bin/env node
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

/* eslint-disable no-await-in-loop, no-console */

/**
 * External dependencies
 */
import fs from 'fs';
import puppeteer from 'puppeteer';

const screenshotsPath = `build/template-posters/`;

// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.mkdirSync(screenshotsPath, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({
    defaultViewport: null,
    headless: true,
    args: [`--window-size=1600,800`],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1600,
    height: 800,
    deviceScaleFactor: 2,
  });
  await page.goto(
    'http://localhost:8899/wp-admin/edit.php?post_type=web-story&page=stories-dashboard#/templates-gallery'
  );
  await page.type('#user_login', 'admin');
  await page.type('#user_pass', 'password');
  await page.click('#wp-submit');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  await page.waitForSelector('aria/Explore Templates');
  await page.click('aria/Explore Templates');

  // Wait for templates to be rendered
  await page.waitForSelector('div.templateGridItem');

  // total templates to generate screenshots from
  const templateCount = await page.evaluate(() => {
    return document.querySelectorAll('.templateGridItem').length;
  });

  // Now let's go through each template
  for (
    let currentTemplate = 1;
    currentTemplate <= templateCount;
    currentTemplate++
  ) {
    // Get the template name to use as build directory
    const templateName = await page.evaluate((gridItemId) => {
      return document
        .querySelector(
          `div#template-grid-item-${gridItemId} div[data-testid="card-action-container"]`
        )
        .getAttribute('data-template-slug');
    }, currentTemplate);
    // Prep a directory for the template screenshots
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.mkdirSync(`${screenshotsPath}${templateName}`, { recursive: true });

    console.log(`Getting screenshots for ${templateName}`);

    // Use the template, this will open up the editor
    await page.click(`div#template-grid-item-${currentTemplate} button`);

    // Load the template in the editor to get story id to render preview
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const editorUrl = await page.url(); // 'http://localhost:8899/wp-admin/post.php?post=1163&action=edit#page=%252217fa9c85-89c7-47d0-a7a8-29f6ef56e161%2522'
    const storyId = editorUrl.split('post=')[1].split('&')[0];

    const previewUrl = `http://localhost:8899/?post_type=web-story&p=${storyId}&preview=true`;

    // Need to click preview for the story to save and be loadable in a second window.
    // This is because the "Save" button is disabled at this point.
    // Also not using the tab opened by the preview button and instead assembling `pagePreview`
    // ourselves so that we can emulate `prefers-reduced-motion` and don't have to deal with
    // the story dev tools.
    await page.waitForSelector('aria/Preview');
    await page.click('aria/Preview');

    const pagePreview = await browser.newPage();
    await pagePreview.setViewport({
      width: 1600,
      height: 800,
      deviceScaleFactor: 2,
    });
    // set prefers-reduced-motion to get story without animations so screenshots are complete page views
    await pagePreview.emulateMediaFeatures([
      { name: 'prefers-reduced-motion', value: 'reduce' },
    ]);
    await pagePreview.evaluate(
      () => matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    await pagePreview.goto(previewUrl);
    // Ensure that the page's ready before looping
    await pagePreview.waitForSelector('aria/Next page');

    const totalPages = await pagePreview.evaluate(() => {
      return document.querySelectorAll('amp-story-page').length;
    });

    for (let currentPage = 1; currentPage < totalPages; currentPage++) {
      const templatePageSafeArea = await pagePreview.$(
        `amp-story-page:nth-child(${currentPage}) .page-safe-area`
      );
      // Speed up animations, this in tandem with emulating reduced motion will account for fade in content
      await pagePreview._client.send('Animation.setPlaybackRate', {
        playbackRate: 2,
      });

      await templatePageSafeArea.screenshot({
        path: `${screenshotsPath}${templateName}/${currentPage}.png`,
      });

      await templatePageSafeArea.screenshot({
        path: `${screenshotsPath}${templateName}/${currentPage}.webp`,
      });

      if (currentPage !== totalPages - 1) {
        await pagePreview.click('aria/Next page');
      }
    }

    // Close the preview
    await pagePreview.close();

    // Use the original browser page to go back to the template gallery for the next template.
    await page.goto(
      'http://localhost:8899/wp-admin/edit.php?post_type=web-story&page=stories-dashboard#/templates-gallery'
    );
  }

  await browser.close();
  console.log(
    `\nTemplate images generated in ${screenshotsPath}, please move and commit them to the static-site branch`
  );
})();

/* eslint-enable */
