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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { PreviewPage } from '../../components';
import ApiProvider from '../../app/api/apiProvider';
import FontProvider from '../../app/font/fontProvider';
import { UnitsProvider } from '../../../edit-story/units';
import { TransformProvider } from '../../../edit-story/components/transform';
import travelData from '../data/travel.json';

export default {
  title: 'Dashboard/Templates/Travel',
};

const PageContainer = styled.div`
  position: relative;
  width: 280px;
  height: 420px;
  border-radius: 8px;
  margin: 20px;
  overflow: hidden;
`;

const StoryProviders = ({ width, height, children }) => (
  <ApiProvider>
    <FontProvider>
      <TransformProvider>
        <UnitsProvider pageSize={{ width, height }}>{children}</UnitsProvider>
      </TransformProvider>
    </FontProvider>
  </ApiProvider>
);

StoryProviders.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

const TemplateFonts = () => (
  <link
    rel="stylesheet"
    id="google-sans-font-css"
    href="https://fonts.googleapis.com/css2?family=Lora&family=Oswald:wght@500&family=Playfair+Display&display=swap"
    media="all"
  />
);

export const _default = () => {
  const { pages } = travelData;

  return (
    <>
      <TemplateFonts />
      <StoryProviders width={280} height={420}>
        {pages.map((page, index) => (
          <PageContainer key={index}>
            <PreviewPage page={page} />
          </PageContainer>
        ))}
      </StoryProviders>
    </>
  );
};
