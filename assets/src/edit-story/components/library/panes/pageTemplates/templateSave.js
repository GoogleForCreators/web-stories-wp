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
import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useFeatures } from 'flagged';
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  THEME_CONSTANTS,
  Text,
  themeHelpers,
  useSnackbar,
} from '../../../../../design-system';
import { useAPI } from '../../../../app/api';
import { useStory } from '../../../../app/story';
import isDefaultPage from '../../../../utils/isDefaultPage';
import { ReactComponent as Icon } from './illustration.svg';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  height: ${({ pageSize }) => pageSize.containerHeight - 2}px;
  width: ${({ pageSize }) => pageSize.width - 2}px;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  display: flex;
  flex-direction: column;
  align-items: center;

  ${themeHelpers.focusableOutlineCSS};
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 106px;
  margin-top: 34px;
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
  text-align: center;
  margin-top: 24px;
  margin-bottom: 8px;
`;

const StyledButton = styled(Button)`
  height: 32px;
`;

function TemplateSave({ pageSize, setShowDefaultTemplates, loadTemplates }) {
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
    } else {
      addPageTemplate({ ...currentPage, id: uuidv4(), title: null }).then(
        () => {
          showSnackbar({
            message: __('Page template saved.', 'web-stories'),
            dismissable: true,
          });
          loadTemplates?.();
        }
      );
      setShowDefaultTemplates(false);
    }
  }, [
    addPageTemplate,
    currentPage,
    loadTemplates,
    setShowDefaultTemplates,
    showSnackbar,
  ]);

  if (!customPageTemplates) {
    return null;
  }
  return (
    <Wrapper pageSize={pageSize}>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <StyledText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__('Save current page as template', 'web-stories')}
      </StyledText>
      <StyledButton
        onClick={handleSaveTemplate}
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.SMALL}
        aria-label={__('Save new template', 'web-stories')}
      >
        {__('Save', 'web-stories')}
      </StyledButton>
    </Wrapper>
  );
}

TemplateSave.propTypes = {
  pageSize: PropTypes.object.isRequired,
  setShowDefaultTemplates: PropTypes.func.isRequired,
  loadTemplates: PropTypes.func,
};

export default TemplateSave;
