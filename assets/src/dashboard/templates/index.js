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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import memoize from '../utils/memoize';
import getTemplates from './getTemplates';

const memoizedGetTemplates = memoize(getTemplates);

export default async function ({ cdnURL }) {
  const templates = await memoizedGetTemplates(cdnURL);

  const globalConfig = {
    createdBy: 'Google',
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
      description: __(
        'The modern and bright Beauty template lends itself well as a foundation for stories covering make up, beauty products, shopping guides, instructions & tutorials and more.',
        'web-stories'
      ),
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
      description: __(
        'Make your audience salivate by using the Cooking template to create web stories about ingredients, food recipes, how-to’s, restaurant guides and kitchen inspiration.',
        'web-stories'
      ),
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
      description: __(
        'Motivate your audience to get out there and make something with the bold DIY template. Use it for DIY, crafting, 3D printing, woodworking or any other content targeting makers.',
        'web-stories'
      ),
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
      description: __(
        'Cover the world of entertainment with this template that comes with an edgy, interesting look. Works well as foundation for celebrity, movie, TV and music coverage, insights and inspiration.',
        'web-stories'
      ),
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
      description: __(
        'The elegant serif Fashion template works well for New York Fashion Week highlights, high fashion shopping guides and accessory trends.',
        'web-stories'
      ),
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
      description: __(
        'This modern, bold theme lends itself well for workout routines, fitness gear shopping lists, but also tech, internet and gadget news, reviews, recommendations and coverage, due to its timeless, simple look.',
        'web-stories'
      ),
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
      description: __(
        'Designed to instil a sense of wanderlust & wonder, the Travel template can be a great foundation for travel inspiration, travel itineraries, restaurant hopping guides, Best-of attraction listicles and other types of travel content.',
        'web-stories'
      ),
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
      description: __(
        'With a warm color palette and soothing shapes, the Wellbeing template works best for web stories covering mindfulness, lifestyle health and related exercise and activities like Yoga, Spa treatments and the like.',
        'web-stories'
      ),
      pages: templates.wellbeing.pages,
      version: templates.wellbeing.version,
    },
  ];
}
