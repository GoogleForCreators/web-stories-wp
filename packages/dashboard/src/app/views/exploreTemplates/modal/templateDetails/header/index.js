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
import PropTypes from 'prop-types';
import { __, sprintf } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { TemplateActionsPropType } from '../../../../../../types';

const Nav = styled.nav`
  justify-content: space-between;
  align-items: center;
  display: flex;
  margin: 48px auto;
  /* line the close and cta buttons up with navigation arrow*/
  width: calc(76% + 121px);
`;

const HiddenHeading = styled.h2`
  ${themeHelpers.visuallyHidden};
`;

const CTAButton = styled(Button).attrs({
  type: BUTTON_TYPES.PRIMARY,
  size: BUTTON_SIZES.SMALL,
})`
  /* Use Template button should be same height as Close button.*/
  padding: 10px 16px;
`;
function Header({
  templateTitle,
  templateId,
  templateActions,
  canCreateStory,
}) {
  const { createStoryFromTemplate, handleDetailsToggle } =
    templateActions || {};
  return (
    <Nav>
      <HiddenHeading>
        {sprintf(
          /* translators: %s: template title */
          __('Template Details for %s', 'web-stories'),
          templateTitle
        )}
      </HiddenHeading>
      <Button
        type={BUTTON_TYPES.TERTIARY}
        variant={BUTTON_VARIANTS.SQUARE}
        size={BUTTON_SIZES.SMALL}
        aria-label={__('Close', 'web-stories')}
        onClick={handleDetailsToggle}
      >
        <Icons.CrossLarge />
      </Button>
      {canCreateStory && (
        <CTAButton
          onClick={() => createStoryFromTemplate(templateId)}
          aria-label={sprintf(
            /* translators: %s: template title */
            __('Use %s template to create new story', 'web-stories'),
            templateTitle
          )}
        >
          {__('Use template', 'web-stories')}
        </CTAButton>
      )}
    </Nav>
  );
}

Header.propTypes = {
  canCreateStory: PropTypes.bool,
  templateActions: TemplateActionsPropType,
  templateId: PropTypes.number,
  templateTitle: PropTypes.string,
};

export default Header;
