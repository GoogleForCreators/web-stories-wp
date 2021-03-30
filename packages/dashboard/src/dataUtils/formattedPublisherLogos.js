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

export const publisherLogoIds = [577, 584, 582, 581];

export const rawPublisherLogos = {
  577: {
    id: 577,
    src: 'https://picsum.photos/96',
    title: 'dummy image 1',
  },
  584: {
    id: 584,
    src: 'https://picsum.photos/97',
    title: 'dummy image 2',
  },
  582: {
    id: 582,
    src: 'https://picsum.photos/98',
    title: 'dummy image 3',
  },
  581: {
    id: 581,
    src: 'https://picsum.photos/99',
    title: 'dummy image 4',
  },
};

const formattedPublisherLogos = [
  {
    id: 577,
    src: 'https://picsum.photos/96',
    title: 'dummy image 1',
    isDefault: true,
  },
  {
    id: 584,
    src: 'https://picsum.photos/97',
    title: 'dummy image 2',
  },
  {
    id: 582,
    src: 'https://picsum.photos/98',
    title: 'dummy image 3',
  },
  {
    id: 581,
    src: 'https://picsum.photos/99',
    title: 'dummy image 4',
  },
];

export default formattedPublisherLogos;
