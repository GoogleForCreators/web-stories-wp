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
 * Internal dependencies
 */
import { ACTIONS } from '../../../app/highlights';
import { Container } from './container';

export class QuickActionMenu extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get changeBackgroundColorButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.CHANGE_BACKGROUND_COLOR.text,
    });
  }

  get changeColorButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.CHANGE_COLOR.text,
    });
  }

  get insertBackgroundMediaButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.INSERT_BACKGROUND_MEDIA.text,
    });
  }

  get insertTextButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.INSERT_TEXT.text,
    });
  }

  get replaceMediaButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.REPLACE_MEDIA.text,
    });
  }

  get replaceBackgroundMediaButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.REPLACE_BACKGROUND_MEDIA.text,
    });
  }

  get addAnimationButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.ADD_ANIMATION.text,
    });
  }

  get addLinkButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.ADD_LINK.text,
    });
  }

  get addCaptionsButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.ADD_CAPTIONS.text,
    });
  }

  get resetElementButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.RESET_ELEMENT.text,
    });
  }

  get textColorButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.CHANGE_TEXT_COLOR.text,
    });
  }

  get fontButton() {
    return this.queryByRole('menuitem', {
      name: ACTIONS.CHANGE_FONT.text,
    });
  }

  get closeButton() {
    return this.queryByRole('menuitem', {
      name: 'Close',
    });
  }

  get optionsButton() {
    return this.queryByRole('menuitem', {
      name: 'Options',
    });
  }

  get disableAudioButton() {
    return this.queryByRole('menuitem', {
      name: 'Disable Audio',
    });
  }

  get enableAudioButton() {
    return this.queryByRole('menuitem', {
      name: 'Enable Audio',
    });
  }
}
