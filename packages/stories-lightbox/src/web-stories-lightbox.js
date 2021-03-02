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
 * Handles the 'amp-story-player' lightbox.
 *
 * Displays the story that user interacted with in a lightbox.
 */
class Lightbox {
  constructor(wrapperDiv) {
    if ('undefined' === typeof wrapperDiv) {
      return;
    }

    this.lightboxInitialized = false;
    this.wrapperDiv = wrapperDiv;
    this.instanceId = this.wrapperDiv.dataset.id;
    this.lightboxElement = document.querySelector(
      `.ws-lightbox-${this.instanceId} .web-stories-list__lightbox`
    );
    this.player = this.lightboxElement.querySelector('amp-story-player');

    if (
      'undefined' === typeof this.player ||
      'undefined' === typeof this.lightboxElement
    ) {
      return;
    }

    if (this.player.isReady && !this.lightboxInitialized) {
      this.initializeLightbox();
    }

    this.player.addEventListener('ready', () => {
      if (!this.lightboxInitialized) {
        this.initializeLightbox();
      }
    });

    // Event triggered when user clicks on close (X) button.
    this.player.addEventListener('amp-story-player-close', () => {
      this.player.pause();
      this.lightboxElement.classList.toggle('show');
    });
  }

  initializeLightbox() {
    this.stories = this.player.getStories();
    this.bindStoryClickListeners();
    this.lightboxInitialized = true;
  }

  bindStoryClickListeners() {
    const cards = this.wrapperDiv.querySelectorAll('.web-stories-list__story');

    cards.forEach((card) => {
      card.addEventListener('click', (event) => {
        event.preventDefault();
        const storyObject = this.stories.find(
          (story) => story.href === card.dataset.storyUrl
        );
        this.player.show(storyObject.href);
        this.player.play();
        this.lightboxElement.classList.toggle('show');
      });
    });
  }
}

export default function initializeWebStoryLightbox() {
  const webStoryBlocks = document.getElementsByClassName('web-stories-list');
  if ('undefined' !== typeof webStoryBlocks) {
    Array.from(webStoryBlocks).forEach((webStoryBlock) => {
      /* eslint-disable-next-line no-new -- we do not store the object as no further computation required. */
      new Lightbox(webStoryBlock);
    });
  }
}
