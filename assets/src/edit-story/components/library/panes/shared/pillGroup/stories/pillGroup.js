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
import PillGroup from '../pillGroup';

export default {
  title: 'Stories Editor/Components/PillGroup',
  component: PillGroup,
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.v3};
  max-width: 350px;
`;

const categories = [
  {
    id: 'categories/unsplash:KHXRtL69hcY',
    label: 'Sustainability',
  },
  {
    id: 'categories/unsplash:bo8jQKTaE0Y',
    label: 'Wallpapers',
  },
  {
    id: 'categories/unsplash:c7USHrQ0Ljw',
    label: 'COVID-19',
  },
  {
    id: 'categories/unsplash:Fzo3zuOHN6w',
    label: 'Travel',
  },
  {
    id: 'categories/unsplash:6sMVjTLSkeQ',
    label: 'Nature',
  },
  {
    id: 'categories/unsplash:iUIsnVtjB0Y',
    label: 'Textures & Patterns',
  },
  {
    id: 'categories/unsplash:BJJMtteDJA4',
    label: 'Current Events',
  },
  {
    id: 'categories/unsplash:towJZFskpGg',
    label: 'People',
  },
  {
    id: 'categories/unsplash:aeu6rL-j6ew',
    label: 'Business & Work',
  },
  {
    id: 'categories/unsplash:J9yrPaHXRQY',
    label: 'Technology',
  },
  {
    id: 'categories/unsplash:Jpg6Kidl-Hk',
    label: 'Animals',
  },
  {
    id: 'categories/unsplash:R_Fyn-Gwtlw',
    label: 'Interiors',
  },
  {
    id: 'categories/unsplash:rnSKDHwwYUk',
    label: 'Architecture',
  },
  {
    id: 'categories/unsplash:xjPR4hlkBGA',
    label: 'Food & Drink',
  },
  {
    id: 'categories/unsplash:Bn-DjrcBrwo',
    label: 'Athletics',
  },
  {
    id: 'categories/unsplash:_8zFHuhRhyo',
    label: 'Spirituality',
  },
  {
    id: 'categories/unsplash:_hb-dl4Q-4U',
    label: 'Health & Wellness',
  },
  {
    id: 'categories/unsplash:hmenvQhUmxM',
    label: 'Film',
  },
  {
    id: 'categories/unsplash:S4MKLAsBB74',
    label: 'Fashion',
  },
  {
    id: 'categories/unsplash:qPYsDzvJOYc',
    label: 'Experimental',
  },
];

export const empty = () => {
  return (
    <Container>
      <PillGroup items={[]} />
    </Container>
  );
};

export const unselected = () => {
  return (
    <Container>
      <PillGroup items={categories} />
    </Container>
  );
};

export const selected = () => {
  return (
    <Container>
      <PillGroup items={categories} selectedItemId={categories[1].id} />
    </Container>
  );
};
