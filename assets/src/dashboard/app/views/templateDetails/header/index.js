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
import { __, sprintf } from '@web-stories-wp/i18n';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
} from '../../@web-stories-wp/design-system';
import { Layout } from '../../../../components';
import { APP_ROUTES, ROUTE_TITLES } from '../../../../constants';
import { parentRoute } from '../../../router/route';

const Nav = styled.nav`
  justify-content: space-between;
  align-items: center;
  display: flex;
  margin: 48px 0 84px;
  padding: 0 88px;
`;

const HiddenHeading = styled.h2`
  ${themeHelpers.visuallyHidden};
`;
function Header({ onHandleCtaClick, templateTitle }) {
  return (
    <Layout.Fixed>
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
          variant={BUTTON_VARIANTS.CIRCLE}
          size={BUTTON_SIZES.SMALL}
          as="a"
          aria-label={sprintf(
            /* translators: %s: page title of link */
            __('Go to %s', 'web-stories'),
            ROUTE_TITLES[APP_ROUTES.TEMPLATES_GALLERY]
          )}
          href={parentRoute()}
        >
          <Icons.CrossLarge />
        </Button>
        <Button
          onClick={onHandleCtaClick}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          aria-label={sprintf(
            /* translators: %s: template title */
            __('Use %s template to create new story', 'web-stories'),
            templateTitle
          )}
        >
          {__('Use template', 'web-stories')}
        </Button>
      </Nav>
    </Layout.Fixed>
  );
}

Header.propTypes = {
  onHandleCtaClick: PropTypes.func,
  templateTitle: PropTypes.string,
};

export default Header;
