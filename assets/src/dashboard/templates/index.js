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
 * External dependencies
 */
import { __, _x } from '@web-stories-wp/i18n';

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
      title: _x('Beauty', 'template name', 'web-stories'),
      ...globalConfig,
      tags: [
        _x('Health', 'template keyword', 'web-stories'),
        _x('Bold', 'template keyword', 'web-stories'),
        _x('Joy', 'template keyword', 'web-stories'),
      ],
      colors: [
        { label: _x('Pink', 'color', 'web-stories'), color: '#f3d9e1' },
        { label: _x('Green', 'color', 'web-stories'), color: '#d8ddcc' },
        { label: _x('Black', 'color', 'web-stories'), color: '#28292b' },
        { label: _x('White', 'color', 'web-stories'), color: '#fff' },
        { label: _x('Brown', 'color', 'web-stories'), color: '#eadfd6' },
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
      title: _x('Cooking', 'template name', 'web-stories'),
      ...globalConfig,
      tags: [
        _x('Delicious', 'template keyword', 'web-stories'),
        _x('Baker', 'template keyword', 'web-stories'),
        _x('Cook', 'template keyword', 'web-stories'),
      ],
      colors: [
        { label: _x('Cream', 'color', 'web-stories'), color: '#fff933' },
        { label: _x('Orange', 'color', 'web-stories'), color: '#ff922e' },
        { label: _x('Grey', 'color', 'web-stories'), color: '#676461' },
        { label: _x('Black', 'color', 'web-stories'), color: '#2a2928' },
        { label: _x('White', 'color', 'web-stories'), color: '#fff' },
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
      title: _x('DIY', 'template name', 'web-stories'),
      ...globalConfig,
      tags: [
        _x('Doers', 'template keyword', 'web-stories'),
        _x('Expand', 'template keyword', 'web-stories'),
        _x('Start', 'template keyword', 'web-stories'),
      ],
      colors: [
        { label: _x('Black', 'color', 'web-stories'), color: '#211f1e' },
        { label: _x('Grey', 'color', 'web-stories'), color: '#353332' },
        { label: _x('Orange', 'color', 'web-stories'), color: '#ff7324' },
        { label: _x('Cream', 'color', 'web-stories'), color: '#faf4ea' },
        { label: _x('Light Grey', 'color', 'web-stories'), color: '#858280' },
        { label: _x('White', 'color', 'web-stories'), color: '#fff' },
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
      title: _x('Entertainment', 'template name', 'web-stories'),
      ...globalConfig,
      tags: [
        _x('Funny', 'template keyword', 'web-stories'),
        _x('Action', 'template keyword', 'web-stories'),
        _x('Hip', 'template keyword', 'web-stories'),
      ],
      colors: [
        { label: _x('Black', 'color', 'web-stories'), color: '#000' },
        { label: _x('White', 'color', 'web-stories'), color: '#fff' },
        { label: _x('Pink', 'color', 'web-stories'), color: '#ff00d6' },
        { label: _x('Grey', 'color', 'web-stories'), color: '#525252' },
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
      title: _x('Fashion', 'template name', 'web-stories'),
      ...globalConfig,
      tags: [
        _x('Clothing', 'template keyword', 'web-stories'),
        _x('Sparkle', 'template keyword', 'web-stories'),
      ],
      colors: [
        { label: _x('Cream', 'color', 'web-stories'), color: '#ffece3' },
        { label: _x('Orange', 'color', 'web-stories'), color: '#ff6c4a' },
        { label: _x('Black', 'color', 'web-stories'), color: '#212121' },
        { label: _x('Grey', 'color', 'web-stories'), color: '#858280' },
        { label: _x('White', 'color', 'web-stories'), color: '#fff' },
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
      title: _x('Fitness', 'template name', 'web-stories'),
      ...globalConfig,
      tags: [
        _x('Exercise', 'template keyword', 'web-stories'),
        _x('Fitness', 'template keyword', 'web-stories'),
        _x('Health', 'template keyword', 'web-stories'),
        _x('Workout', 'template keyword', 'web-stories'),
        _x('Bold', 'template keyword', 'web-stories'),
      ],
      colors: [
        { label: _x('Black', 'color', 'web-stories'), color: '#1a1a1a' },
        { label: _x('Red', 'color', 'web-stories'), color: '#cf1323' },
        { label: _x('White', 'color', 'web-stories'), color: '#fff' },
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
      title: _x('Travel', 'template name', 'web-stories'),
      ...globalConfig,
      tags: [
        _x('Explore', 'template keyword', 'web-stories'),
        _x('Adventure', 'template keyword', 'web-stories'),
        _x('Taste', 'template keyword', 'web-stories'),
      ],
      colors: [
        { label: _x('Green', 'color', 'web-stories'), color: '#094228' },
        { label: _x('White', 'color', 'web-stories'), color: '#fff' },
        { label: _x('Yellow', 'color', 'web-stories'), color: '#fec85a' },
        { label: _x('Blue', 'color', 'web-stories'), color: '#0648ad' },
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
      title: _x('Wellbeing', 'template name', 'web-stories'),
      ...globalConfig,
      tags: [
        _x('Health', 'template keyword', 'web-stories'),
        _x('Happiness', 'template keyword', 'web-stories'),
        _x('Joy', 'template keyword', 'web-stories'),
        _x('Mindfulness', 'template keyword', 'web-stories'),
      ],
      colors: [
        { label: _x('Blue', 'color', 'web-stories'), color: '#1f2a2e' },
        { label: _x('Green', 'color', 'web-stories'), color: '#4b5c54' },
        { label: _x('Yellow', 'color', 'web-stories'), color: '#fbebba' },
        { label: _x('Grey', 'color', 'web-stories'), color: '#858280' },
        { label: _x('Light Grey', 'color', 'web-stories'), color: '#d8d8d8' },
        { label: _x('White', 'color', 'web-stories'), color: '#fff' },
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
