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
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import Media3pCategories from '../media3pCategories';

export default {
  title: 'Stories Editor/Components/Media3pCategories',
  component: Media3pCategories,
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v3};
  max-width: 350px;
`;

const categories = [
  {
    name: 'categories/unsplash:KHXRtL69hcY',
    displayName: 'Sustainability',
  },
  {
    name: 'categories/unsplash:bo8jQKTaE0Y',
    displayName: 'Wallpapers',
  },
  {
    name: 'categories/unsplash:c7USHrQ0Ljw',
    displayName: 'COVID-19',
  },
  {
    name: 'categories/unsplash:Fzo3zuOHN6w',
    displayName: 'Travel',
  },
  {
    name: 'categories/unsplash:6sMVjTLSkeQ',
    displayName: 'Nature',
  },
  {
    name: 'categories/unsplash:iUIsnVtjB0Y',
    displayName: 'Textures & Patterns',
  },
  {
    name: 'categories/unsplash:BJJMtteDJA4',
    displayName: 'Current Events',
  },
  {
    name: 'categories/unsplash:towJZFskpGg',
    displayName: 'People',
  },
  {
    name: 'categories/unsplash:aeu6rL-j6ew',
    displayName: 'Business & Work',
  },
  {
    name: 'categories/unsplash:J9yrPaHXRQY',
    displayName: 'Technology',
  },
  {
    name: 'categories/unsplash:Jpg6Kidl-Hk',
    displayName: 'Animals',
  },
  {
    name: 'categories/unsplash:R_Fyn-Gwtlw',
    displayName: 'Interiors',
  },
  {
    name: 'categories/unsplash:rnSKDHwwYUk',
    displayName: 'Architecture',
  },
  {
    name: 'categories/unsplash:xjPR4hlkBGA',
    displayName: 'Food & Drink',
  },
  {
    name: 'categories/unsplash:Bn-DjrcBrwo',
    displayName: 'Athletics',
  },
  {
    name: 'categories/unsplash:_8zFHuhRhyo',
    displayName: 'Spirituality',
  },
  {
    name: 'categories/unsplash:_hb-dl4Q-4U',
    displayName: 'Health & Wellness',
  },
  {
    name: 'categories/unsplash:hmenvQhUmxM',
    displayName: 'Film',
  },
  {
    name: 'categories/unsplash:S4MKLAsBB74',
    displayName: 'Fashion',
  },
  {
    name: 'categories/unsplash:qPYsDzvJOYc',
    displayName: 'Experimental',
  },
];

export const empty = () => {
  return (
    <Container>
      <Media3pCategories categories={[]} />
    </Container>
  );
};

export const unselected = () => {
  return (
    <Container>
      <Media3pCategories categories={categories} />
    </Container>
  );
};

export const selected = () => {
  return (
    <Container>
      <Media3pCategories
        categories={categories}
        selectedCategoryName={categories[1].name}
      />
    </Container>
  );
};
