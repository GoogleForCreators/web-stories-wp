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
import { ACTION_TEXT } from '../../../app/highlights';
import { Container } from './container';

export class QuickActionMenu extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get changeBackgroundColorButton() {
    return this.queryByRole('button', {
      name: ACTION_TEXT.CHANGE_BACKGROUND_COLOR,
    });
  }

  get insertBackgroundMediaButton() {
    return this.queryByRole('button', {
      name: ACTION_TEXT.INSERT_BACKGROUND_MEDIA,
    });
  }

  get insertTextButton() {
    return this.queryByRole('button', {
      name: ACTION_TEXT.INSERT_TEXT,
    });
  }

  get replaceMediaButton() {
    return this.queryByRole('button', {
      name: ACTION_TEXT.REPLACE_MEDIA,
    });
  }

  get addAnimationButton() {
    return this.queryByRole('button', {
      name: ACTION_TEXT.ADD_ANIMATION,
    });
  }

  get addLinkButton() {
    return this.queryByRole('button', {
      name: ACTION_TEXT.ADD_LINK,
    });
  }

  get clearAnimationsButton() {
    return this.queryByRole('button', {
      name: ACTION_TEXT.CLEAR_ANIMATIONS,
    });
  }
}
