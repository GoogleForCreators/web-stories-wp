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
import { memoize } from '../utils';
import getTemplates from './getTemplates';

const memoizedGetTemplates = memoize(getTemplates);

export default function ({ assetsURL }) {
  const templates = memoizedGetTemplates(assetsURL);

  const globalConfig = {
    createdBy: 'Google Web Stories',
    modified: '2020-04-21',
  };

  return [
    {
      id: 1,
      title: 'Beauty',
      ...globalConfig,
      tags: ['Health', 'Bold', 'Joy'],
      colors: [
        { label: 'Pink', color: '#f3d9e1' },
        { label: 'Green', color: '#d8ddcc' },
        { label: 'Black', color: '#28292b' },
        { label: 'White', color: '#fff' },
        { label: 'Brown', color: '#eadfd6' },
      ],
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consectetur mauris sodales magna elementum maximus.',
      pages: templates.beauty.pages,
      version: templates.beauty.version,
    },
    {
      id: 2,
      title: 'Cooking',
      ...globalConfig,
      tags: ['Delicious', 'Baker', 'Cook'],
      colors: [
        { label: 'Cream', color: '#fff933' },
        { label: 'Orange', color: '#ff922e' },
        { label: 'Grey', color: '#676461' },
        { label: 'Black', color: '#2a2928' },
        { label: 'White', color: '#fff' },
      ],
      description:
        'Maecenas ultrices tortor nibh, eu consequat magna maximus non. Quisque nec tellus lacus.',
      pages: templates.cooking.pages,
      version: templates.cooking.version,
    },
    {
      id: 3,
      title: 'DIY',
      ...globalConfig,
      tags: ['Doers', 'Expand', 'Start'],
      colors: [
        { label: 'Black', color: '#211f1e' },
        { label: 'Grey', color: '#353332' },
        { label: 'Orange', color: '#ff7324' },
        { label: 'Cream', color: '#faf4ea' },
        { label: 'Light Grey', color: '#858280' },
        { label: 'White', color: '#fff' },
      ],
      description:
        'Mauris placerat velit ut nunc ornare porta. Integer auctor hendrerit aliquam. Proin egestas nisi et nisl commodo.',
      pages: templates.diy.pages,
      version: templates.diy.version,
    },
    {
      id: 4,
      title: 'Entertainment',
      ...globalConfig,
      tags: ['Funny', 'Action', 'Hip'],
      colors: [
        { label: 'Black', color: '#000' },
        { label: 'White', color: '#fff' },
        { label: 'Pink', color: '#ff00d6' },
        { label: 'Grey', color: '#525252' },
      ],
      description:
        'Nam a tellus tortor. Aenean non mi porta quam feugiat vehicula in a lectus. Suspendisse eget justo ac quam.',
      pages: templates.entertainment.pages,
      version: templates.entertainment.version,
    },
    {
      id: 5,
      title: 'Fashion',
      ...globalConfig,
      tags: ['Clothing', 'Sparkle'],
      colors: [
        { label: 'Cream', color: '#ffece3' },
        { label: 'Orange', color: '#ff6c4a' },
        { label: 'Black', color: '#212121' },
        { label: 'Grey', color: '#858280' },
        { label: 'White', color: '#fff' },
      ],
      description:
        'Duis auctor libero vel dui tincidunt, at mattis nisi placerat. Nam id lacinia lectus.',
      pages: templates.fashion.pages,
      version: templates.fashion.version,
    },
    {
      id: 6,
      title: 'Fitness',
      ...globalConfig,
      tags: ['Exercise', 'Fitness', 'Health', 'Workout', 'Bold'],
      colors: [
        { label: 'Black', color: '#1a1a1a' },
        { label: 'Red', color: '#cf1323' },
        { label: 'White', color: '#fff' },
      ],
      description:
        'Quisque dignissim urna id lectus ultricies blandit. Cras laoreet pharetra lectus. Nunc mollis suscipit feugiat.',
      pages: templates.fitness.pages,
      version: templates.fitness.version,
    },
    {
      id: 7,
      title: 'Travel',
      ...globalConfig,
      tags: ['Explore', 'Adventure', 'Taste'],
      colors: [
        { label: 'Green', color: '#094228' },
        { label: 'White', color: '#fff' },
        { label: 'Yellow', color: '#fec85a' },
        { label: 'Blue', color: '#0648ad' },
      ],
      description:
        'Vestibulum lobortis quis nunc eget pulvinar. Duis auctor eros quis dignissim iaculis.',
      pages: templates.travel.pages,
      version: templates.travel.version,
    },
    {
      id: 8,
      title: 'Wellbeing',
      ...globalConfig,
      tags: ['Health', 'Happiness', 'Joy', 'Mindfulness'],
      colors: [
        { label: 'Blue', color: '#1f2a2e' },
        { label: 'Green', color: '#4b5c54' },
        { label: 'Yellow', color: '#fbebba' },
        { label: 'Grey', color: '#858280' },
        { label: 'Light Grey', color: '#d8d8d8' },
        { label: 'White', color: '#fff' },
      ],
      description:
        'In lorem est, aliquam tempus justo nec, tincidunt aliquet diam. Fusce ut nisl ex. Nam mollis dolor non arcu.',
      pages: templates.wellbeing.pages,
      version: templates.wellbeing.version,
    },
  ];
}
