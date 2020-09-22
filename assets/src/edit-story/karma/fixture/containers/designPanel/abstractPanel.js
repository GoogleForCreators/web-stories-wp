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
import { Container } from '../container';

/**
 * An abstract panel supporting properties that all panels have -
 * such as title and collapsed status.
 */
export class AbstractPanel extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get title() {
    // @todo: implement
    return null;
  }

  get isCollapsed() {
    // @todo: implement
    return null;
  }
}
