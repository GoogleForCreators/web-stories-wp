/*
 * Copyright 2021 Google LLC
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
import { __ } from '@web-stories-wp/i18n';
import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFeatures } from 'flagged';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import {
  BUTTON_TRANSITION_TIMING,
  THEME_CONSTANTS,
  Text,
  useSnackbar,
  themeHelpers,
} from '../../../../../design-system';
import { useAPI } from '../../../../app/api';
import { useStory } from '../../../../app/story';
import isDefaultPage from '../../../../utils/isDefaultPage';
import { ReactComponent as Icon } from './illustration.svg';

const SaveButton = styled.button`
  border: 0;
  background: none;
  height: 56px;
  width: 100%;
  padding: 7px;
  background-color: ${({ theme }) =>
    theme.colors.interactiveBg.secondaryNormal};
  transition: background-color ${BUTTON_TRANSITION_TIMING};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryHover};
  }

  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 42px;
  margin-right: 29px;
  svg {
    color: ${({ theme }) => theme.colors.fg.tertiary};

    path:nth-child(2) {
      fill: ${({ theme }) => theme.colors.fg.secondary};
    }
    path:nth-child(3) {
      fill: ${({ theme }) => theme.colors.fg.primary};
    }
  }
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function TemplateSave({ setShowDefaultTemplates, updateList }) {
  const {
    actions: { addPageTemplate },
  } = useAPI();
  const { showSnackbar } = useSnackbar();

  const { currentPage } = useStory(({ state: { currentPage } }) => ({
    currentPage,
  }));

  const { customPageTemplates } = useFeatures();
  const handleSaveTemplate = useCallback(() => {
    // Don't add empty page.
    if (isDefaultPage(currentPage)) {
      showSnackbar({
        message: __(
          'An empty page can’t be saved as a template. Add elements and try again.',
          'web-stories'
        ),
        dismissable: true,
      });
      return;
    }
    addPageTemplate({ ...currentPage, id: uuidv4(), title: null }).then(
      (addedTemplate) => {
        updateList?.(addedTemplate);
        // @todo Add error handling.
        showSnackbar({
          message: __('Page template saved.', 'web-stories'),
          dismissable: true,
        });
      }
    );
    setShowDefaultTemplates(false);
  }, [
    addPageTemplate,
    currentPage,
    setShowDefaultTemplates,
    showSnackbar,
    updateList,
  ]);

  const textId = useMemo(() => `template_save_btn_${uuidv4()}`, []);
  if (!customPageTemplates) {
    return null;
  }
  return (
    <SaveButton onClick={handleSaveTemplate} aria-labelledby={textId}>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <StyledText
        id={textId}
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
      >
        {__('Save current page as template', 'web-stories')}
      </StyledText>
    </SaveButton>
  );
}

TemplateSave.propTypes = {
  setShowDefaultTemplates: PropTypes.func.isRequired,
  updateList: PropTypes.func,
};

export default TemplateSave;
