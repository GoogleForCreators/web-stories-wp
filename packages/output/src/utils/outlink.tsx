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
import { __ } from '@googleforcreators/i18n';

function Outlink({ ctaText, url, icon, theme, rel = [] }) {
  return (
    <amp-story-page-outlink
      layout="nodisplay"
      cta-image={icon || undefined}
      theme={theme}
    >
      <a href={url} rel={rel.join(' ')}>
        {ctaText || __('Learn more', 'web-stories')}
      </a>
    </amp-story-page-outlink>
  );
}

Outlink.propTypes = {
  icon: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']),
  url: PropTypes.string,
  rel: PropTypes.arrayOf(PropTypes.string),
  ctaText: PropTypes.string,
};

export default Outlink;
