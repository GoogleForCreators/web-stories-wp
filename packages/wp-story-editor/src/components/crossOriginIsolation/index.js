/*
 * Copyright 2023 Google LLC
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
import { useLayoutEffect } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import useMetaBoxes from '../metaBoxes/useMetaBoxes';

/**
 * Complementary component to the Cross_Origin_Isolation PHP class
 * that detects dynamically added DOM nodes that are missing the crossorigin attribute.
 * These are typically found in custom meta boxes and the WordPress admin bar.
 *
 * @return {null} Rendered component
 */
function CrossOriginIsolation() {
  const { metaBoxesVisible, hasMetaBoxes } = useMetaBoxes(({ state }) => ({
    hasMetaBoxes: state.hasMetaBoxes,
    metaBoxesVisible: state.metaBoxesVisible,
  }));

  useLayoutEffect(() => {
    if (!window.crossOriginIsolated) {
      return () => undefined;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        [mutation.addedNodes, mutation.target].forEach((node) => {
          if (!node.querySelectorAll) {
            return;
          }

          const elements = node.querySelectorAll('img');
          elements.forEach((el) => {
            if (el.hasAttribute('crossorigin')) {
              return;
            }

            const imgSrc = new URL(el.src);

            if (imgSrc.origin !== location.origin) {
              el.setAttribute('crossorigin', 'anonymous');
            }
          });
        });
      });
    });

    const subTrees = document.querySelectorAll(
      '#wpadminbar, .web-stories-meta-boxes-area'
    );
    subTrees.forEach((subTree) => {
      observer.observe(subTree, {
        attributes: true,
        subtree: true,
      });
    });

    return () => observer.disconnect();
  }, [hasMetaBoxes, metaBoxesVisible]);

  return null;
}

export default CrossOriginIsolation;
