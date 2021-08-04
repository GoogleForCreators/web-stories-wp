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
import { Container } from './container';

export class RightClickMenu extends Container {
  constructor(node, path) {
    super(node, path);
  }

  // default actions
  get copy() {
    return this.queryByRole('button', {
      name: /^Copy/i,
    });
  }

  get paste() {
    return this.queryByRole('button', {
      name: /^Paste/i,
    });
  }

  get delete() {
    return this.queryByRole('button', {
      name: /^Delete$/i,
    });
  }

  // foreground media actions
  get sendBackward() {
    return this.getByRole('button', {
      name: /^Send Backward/i,
    });
  }

  get sendToBack() {
    return this.getByRole('button', {
      name: /^Send to Back/i,
    });
  }

  get bringForward() {
    return this.getByRole('button', {
      name: /^Bring Forward/i,
    });
  }

  get bringToFront() {
    return this.getByRole('button', {
      name: /^Bring to Front/i,
    });
  }

  get setAsPageBackground() {
    return this.getByRole('button', {
      name: /^Set as page Background/i,
    });
  }

  get scaleAndCropImage() {
    return this.getByRole('button', {
      name: /^Scale & Crop Image/i,
    });
  }

  // page actions
  get duplicatePage() {
    return this.queryByRole('button', {
      name: /Duplicate Page/i,
    });
  }

  get deletePage() {
    return this.queryByRole('button', {
      name: /^Delete Page/i,
    });
  }

  get copyImageStyles() {
    return this.getByRole('button', {
      name: /^Copy Image Styles/i,
    });
  }

  get pasteImageStyles() {
    return this.getByRole('button', {
      name: /^Paste Image Styles/i,
    });
  }

  get clearImageStyles() {
    return this.getByRole('button', {
      name: /^Clear Image Styles/i,
    });
  }
}
