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

function ShoppingAttachment({ products, theme, ctaText }) {
  return (
    <amp-story-shopping-attachment
      theme={theme}
      cta-text={ctaText || undefined}
    >
      <script
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            items: products,
          }),
        }}
      />
    </amp-story-shopping-attachment>
  );
}

ShoppingAttachment.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']),
  ctaText: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.object),
};

export default ShoppingAttachment;
