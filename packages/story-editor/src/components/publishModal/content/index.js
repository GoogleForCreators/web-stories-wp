/*
 * Copyright 2022 Google LLC
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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { themeHelpers } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import useInspector from '../../inspector/useInspector';
import { useHasChecklist } from '../../checklist';
import { HEADER_BAR_HEIGHT, HEADER_BAR_MARGIN } from '../constants';
import MainStoryInfo from './mainStoryInfo';
import StoryPreview from './storyPreview';
import ChecklistButton from './checklistButton';

const Main = styled.div`
  display: grid;
  min-width: 917px;
  width: 100%;
  height: calc(100% - ${HEADER_BAR_MARGIN} - ${HEADER_BAR_HEIGHT});
  /* grid-template-columns: 281px 313px 326.5px; */
  grid-template-columns: 30.5% 34% 35.5%;
  grid-template-rows: auto;
  grid-template-areas:
    'preview mainPanel sidePanel'
    'footer mainPanel sidePanel';
`;

const _StoryPreview = styled.div`
  grid-area: preview;
  margin: 20px 18px 0 32px;
`;

const _MainStoryInfo = styled.div`
  grid-area: mainPanel;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  overflow-y: scroll;
  gap: 34px;

  & > section {
    border: none; // Override the default border that is part of the base panel structure since this is destructured
    // overriding this way because of how isolated panel is inserted
    & > h2 {
      padding-top: 0;
      padding-bottom: 2px;
      & > button {
        height: 1em;
      }
    }
  }
`;

const PanelContainer = styled.div.attrs({ role: 'tabpanel' })`
  grid-area: sidePanel;
  height: 100%;
  margin-left: 18px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  border-bottom-right-radius: ${({ theme }) => theme.borders.radius.medium};
  overflow-y: scroll;

  ${themeHelpers.scrollbarCSS};
`;

const Footer = styled.div`
  grid-area: footer;
  display: flex;
  align-items: flex-end;
  margin: 0 18px 20px 32px;
`;

const Content = ({ handleReviewChecklist }) => {
  const { DocumentPane, id: paneId } = useInspector(
    ({ data }) => data?.modalInspectorTab || {}
  );
  const hasChecklist = useHasChecklist();

  return (
    <Main>
      <_StoryPreview>
        <StoryPreview />
      </_StoryPreview>
      <_MainStoryInfo>
        <MainStoryInfo />
      </_MainStoryInfo>
      {DocumentPane && (
        <PanelContainer
          aria-label={__('Story Settings', 'web-stories')}
          id={paneId}
        >
          <DocumentPane />
        </PanelContainer>
      )}
      {hasChecklist && (
        <Footer>
          <ChecklistButton handleReviewChecklist={handleReviewChecklist} />
        </Footer>
      )}
    </Main>
  );
};

export default Content;

Content.propTypes = {
  handleReviewChecklist: PropTypes.func,
};
