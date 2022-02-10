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
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
} from '@googleforcreators/design-system';
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import { useMemo } from '@googleforcreators/react';
/**
 * Internal dependencies
 */
import { MANDATORY_INPUT_VALUE_TYPES } from '../types';
import useInspector from '../../inspector/useInspector';
import { DOCUMENT_PANEL_NAMES } from '../../panels/document';
import MandatoryStoryInfo from './mandatoryStoryInfo';
import StoryPreview from './storyPreview';

const Main = styled.div`
  display: grid;
  min-width: 917px;
  width: 100%;
  height: 100%;
  margin: 0 -3.7% 0 3.7%;
  grid-gap: 3.7%;
  /* grid-template-columns: 230px 276px 308px; */
  grid-template-columns: 25% 30% 34%;
  grid-template-rows: auto;
  grid-template-areas:
    'preview mandatory panel'
    'footer footer panel';
`;

const _StoryPreview = styled.div`
  grid-area: preview;
  padding-top: 20px;
`;

const _MandatoryStoryInfo = styled.div`
  grid-area: mandatory;
`;

const PanelContainer = styled.div.attrs({ role: 'tabpanel' })`
  grid-area: panel;
  overflow: overlay;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
`;

const Footer = styled.div`
  grid-area: footer;
`;

const WP_STATUS_PANEL = 'status'; // Unsure what the best way to grab this value is, if any, from wp-story-editor
const HIDDEN_PANELS = [WP_STATUS_PANEL, DOCUMENT_PANEL_NAMES.EXCERPT];
const MainContent = ({
  handleReviewChecklist,
  handleUpdateStoryInfo,
  handleUpdateSlug,
  inputValues,
}) => {
  const {
    availablePaneNames = [],
    Pane: DocumentPane,
    title: paneTitle,
    id: paneId,
  } = useInspector(({ data }) => data?.modalInspectorTab || {});

  const IsolatedStatusTab = useMemo(() => {
    if (availablePaneNames.indexOf(WP_STATUS_PANEL) > -1) {
      return (
        <DocumentPane isolatedPanel={WP_STATUS_PANEL} variant="publish_modal" />
      );
    }
    return null;
  }, [availablePaneNames]);

  return (
    <Main>
      <_StoryPreview>
        <StoryPreview />
      </_StoryPreview>
      <_MandatoryStoryInfo>
        <MandatoryStoryInfo
          handleUpdateStoryInfo={handleUpdateStoryInfo}
          handleUpdateSlug={handleUpdateSlug}
          inputValues={inputValues}
        >
          {IsolatedStatusTab}
        </MandatoryStoryInfo>
      </_MandatoryStoryInfo>
      {DocumentPane && (
        <PanelContainer aria-label={paneTitle} id={paneId}>
          <DocumentPane variant="publish_modal" hiddenPanels={HIDDEN_PANELS} />
        </PanelContainer>
      )}
      <Footer>
        <Button
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onClick={handleReviewChecklist}
        >
          {__('Checklist', 'web-stories')}
        </Button>
      </Footer>
    </Main>
  );
};

export default MainContent;

MainContent.propTypes = {
  handleReviewChecklist: PropTypes.func,
  handleUpdateStoryInfo: PropTypes.func,
  handleUpdateSlug: PropTypes.func,
  inputValues: MANDATORY_INPUT_VALUE_TYPES, // update types when panel is figured out
};
