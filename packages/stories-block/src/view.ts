/*
 * Copyright 2025 Google LLC
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
 * WordPress dependencies
 */
import { store, getContext, getElement } from '@wordpress/interactivity';

interface StoryDef {
  href: string;
  title: string | null;
  posterImage: string | null;
  idx: number;
  distance: number;
  storyContentLoaded: boolean;
  desktopAspectRatio: number | null;
}

interface AmpStoryPlayerElement extends HTMLElement {
  getStories: () => StoryDef[];
  play: () => void;
  pause: () => void;
  rewind: () => void;
  mute: () => void;
  show: (href: string) => void;
}

interface AmpStoryPlayerNavigationEvent extends Event {
  detail: {
    index: number;
    remaining: number;
  };
}

type State = {
  lightboxElement: HTMLElement | null;
  player: null | AmpStoryPlayerElement;
  stories: StoryDef[];
  instanceId: string | null;
  currentLocation: string | null;
};

type BlockContext = {
  instanceId: string;
};

function runWithViewTransition(f: () => void) {
  if (!document.startViewTransition) {
    f();
  } else {
    document.startViewTransition(() => f());
  }
}

const { state, actions } = store('web-stories-block', {
  state: {
    lightboxElement: null,
    player: null,
    stories: [],
    instanceId: null,
    currentLocation: null,
  } as State,
  actions: {
    storyContentReady: (
      storyObject: StoryDef,
      callback: () => void,
      maxRetries = 5
    ) => {
      const stateIntervalObj = setInterval(() => {
        if (storyObject.storyContentLoaded === true) {
          window.clearInterval(stateIntervalObj);
          callback();
        }
        if (!--maxRetries) {
          window.clearInterval(stateIntervalObj);
        }
      }, 250);
    },
    close: () => {
      history.pushState({}, '', state.currentLocation);

      const { player, lightboxElement } = state;
      if (!player) {
        return;
      }

      // Rewind the story and pause there upon closing the lightbox.
      player.rewind();
      player.pause();
      player.mute();

      lightboxElement?.classList.toggle('show');
      document.body.classList.toggle('web-stories-lightbox-open');
    },
    open: (event: Event) => {
      event.preventDefault();
      const context = getContext<BlockContext>();
      const lightboxElement =
        document.querySelector(
          `.ws-lightbox-${context.instanceId} .web-stories-list__lightbox`
        ) ||
        document.querySelector(
          `.ws-lightbox-singleton-${context.instanceId} .web-stories-singleton__lightbox`
        );

      if (!lightboxElement) {
        return;
      }

      const player = lightboxElement.querySelector(
        'amp-story-player'
      ) as unknown as AmpStoryPlayerElement;
      const stories = player.getStories();

      state.lightboxElement = lightboxElement as HTMLElement;
      state.player = player;
      state.stories = stories;
      state.instanceId = context.instanceId;
      state.currentLocation = location.href;

      const { ref: card } = getElement();

      const storyObject = stories.find(
        (story) => story.href === card?.querySelector('a')?.href
      );

      if (storyObject) {
        player.show(storyObject.href);
        player.play();

        actions.storyContentReady(storyObject, () => {
          history.pushState({}, '', storyObject.href);
        });
      }

      runWithViewTransition(() => {
        lightboxElement.classList.toggle('show');
        document.body.classList.toggle('web-stories-lightbox-open');
      });
    },
    navigation: (event: AmpStoryPlayerNavigationEvent) => {
      const storyObject = state.stories[event.detail.index];
      if (storyObject && storyObject.href !== document.location.href) {
        actions.storyContentReady(storyObject, () => {
          history.pushState({}, '', storyObject.href);
        });
      }
    },
    onPopstate: () => {
      const lightboxElement = state.lightboxElement;
      const player = state.player;
      const isLightboxOpen = lightboxElement?.classList.contains('show');

      const storyObject = state.stories.find(
        (story) => story.href === document.location.href
      );

      if (storyObject) {
        if (!isLightboxOpen) {
          lightboxElement?.classList.toggle('show');
          document.body.classList.toggle('web-stories-lightbox-open');
          player?.play();
        }

        player?.show(storyObject.href);
      } else if (isLightboxOpen) {
        actions.close();
      }
    },
  },
});
