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
import { boolean, text } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { PageHeading } from '../';
import { NavProvider, LeftRail } from '../../../../components';

export default {
  title: 'Dashboard/Views/Shared/PageHeading',
  component: PageHeading,
};

const InnerContent = styled.div`
  background-color: red;
  width: 100%;
  height: 50%;
`;

export const _default = () => {
  return (
    <NavProvider>
      <LeftRail />
      <PageHeading
        centerContent={boolean('Center Inner Content', false)}
        stories={[]}
        handleTypeaheadChange={(value) => action('Search with value: ', value)}
        defaultTitle={text('Page Heading', 'My Stories')}
        searchPlaceholder={text('Search Placeholder', 'Find Stories')}
      >
        <InnerContent />
      </PageHeading>
    </NavProvider>
  );
};
