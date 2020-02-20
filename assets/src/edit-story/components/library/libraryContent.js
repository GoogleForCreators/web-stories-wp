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
import useLibrary from './useLibrary';
import MediaLibrary from './mediaLibrary';
import TextLibrary from './textLibrary';
import ShapeLibrary from './shapeLibrary';
import ElementsLibrary from './elementsLibrary';
import AnimationLibrary from './animationLibrary';

function Library() {
  const {
    state: { tab },
    data: {
      tabs: { MEDIA, TEXT, SHAPES, ELEMENTS, ANIMATION },
    },
  } = useLibrary();
  const ContentLibrary = {
    [MEDIA]: MediaLibrary,
    [TEXT]: TextLibrary,
    [SHAPES]: ShapeLibrary,
    [ELEMENTS]: ElementsLibrary,
    [ANIMATION]: AnimationLibrary,
  }[tab];
  return <ContentLibrary />;
}

export default Library;
