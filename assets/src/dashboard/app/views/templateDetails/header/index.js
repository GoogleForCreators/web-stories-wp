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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { DetailViewNavBar, Layout } from '../../../../components';

function Header({ onBookmarkClick, onHandleCtaClick }) {
  return (
    <Layout.Fixed>
      <DetailViewNavBar
        ctaText={__('Use template', 'web-stories')}
        closeViewAriaLabel={__('Go to explore templates', 'web-stories')}
        handleBookmarkClick={onBookmarkClick}
        handleCta={onHandleCtaClick}
      />
    </Layout.Fixed>
  );
}

Header.propTypes = {
  onBookmarkClick: PropTypes.func,
  onHandleCtaClick: PropTypes.func,
};

export default Header;
