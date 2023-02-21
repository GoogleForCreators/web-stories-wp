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
    this.lightboxElement =
      document.querySelector(
        `.ws-lightbox-${this.instanceId} .web-stories-list__lightbox`
      ) ||
      document.querySelector(
        `.ws-lightbox-${this.instanceId} .web-stories-singleton__lightbox`
      );
    this.player = this.lightboxElement.querySelector('amp-story-player');
    this.currentLocation = location.href;

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

    this.player.addEventListener('navigation', (event) => {
      const storyObject = this.stories[event.detail.index];
      if (storyObject && storyObject.href !== document.location.href) {
        history.pushState({}, '', storyObject.href);
      }
    });

    const player = this.player;
    const lightboxElement = this.lightboxElement;

    function closeLightbox() {
      if (!player) {
        return;
      }

      // Rewind the story and pause there upon closing the lightbox.
      player.rewind();
      player.pause();
      player.mute();

      lightboxElement.classList.toggle('show');
      document.body.classList.toggle('web-stories-lightbox-open');
    }

    // Event triggered when user clicks on close (X) button.
    this.player.addEventListener('amp-story-player-close', () => {
      history.pushState({}, '', this.currentLocation);

      closeLightbox();
    });

    window.addEventListener('popstate', () => {
      const isLightboxOpen = this.lightboxElement.classList.contains('show');

      const storyObject = this.stories.find(
        (story) => story.href === document.location.href
      );

      if (storyObject) {
        if (!isLightboxOpen) {
          this.lightboxElement.classList.toggle('show');
          document.body.classList.toggle('web-stories-lightbox-open');
          this.player.play();
        }

        this.player.show(storyObject.href);
      } else if (isLightboxOpen) {
        closeLightbox();
      }
    });
  }

  initializeLightbox() {
    this.stories = this.player.getStories();
    this.bindStoryClickListeners();
    this.lightboxInitialized = true;
  }

  bindStoryClickListeners() {
    const cards = this.wrapperDiv.querySelectorAll(
      '.web-stories-list__story,.wp-block-embed__wrapper'
    );

    cards.forEach((card) => {
      card.addEventListener('click', (event) => {
        event.preventDefault();
        const storyObject = this.stories.find(
          (story) => story.href === card.querySelector('a').href
        );
        this.player.show(storyObject.href);
        this.player.play();

        history.pushState({}, '', storyObject.href);

        this.lightboxElement.classList.toggle('show');
        document.body.classList.toggle('web-stories-lightbox-open');
      });
    });
  }
}

export default function initializeWebStoryLightbox() {
  const webStoryBlocks = document.querySelectorAll(
    '.web-stories-list,.web-stories-singleton'
  );
  if ('undefined' !== typeof webStoryBlocks) {
    Array.from(webStoryBlocks).forEach((webStoryBlock) => {
      /* eslint-disable-next-line no-new -- we do not store the object as no further computation required. */
      new Lightbox(webStoryBlock);
    });
  }
}
