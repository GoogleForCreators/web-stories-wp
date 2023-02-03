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
import { useRouteHistory } from '@googleforcreators/dashboard';
import { useEffect } from '@googleforcreators/react';

function useSyncAdminMenu() {
  const { currentPath } = useRouteHistory(({ state: { currentPath } }) => ({
    currentPath,
  }));

  // Add hash location to "Dashboard" link on load.
  useEffect(() => {
    document
      .querySelectorAll(
        '#menu-posts-web-story ul.wp-submenu li a[href$="page=stories-dashboard"]'
      )
      ?.forEach((el) => {
        el.setAttribute('href', el.getAttribute('href') + '#/');
      });
  }, []);

  // Sync up WP navigation bar with our hash location.
  useEffect(() => {
    document
      .querySelectorAll('#menu-posts-web-story ul.wp-submenu li')
      ?.forEach((el) => {
        el.classList.remove('current');
        el.querySelector('a')?.classList.remove('current');
        el.querySelector('a')?.removeAttribute('aria-current');

        if (el.querySelector(`a[href$="#${currentPath}"]`)) {
          el.classList.add('current');
          el.querySelector('a')?.classList.add('current');
          el.querySelector('a')?.setAttribute('aria-current', 'page');
        }
      });
  }, [currentPath]);
}

export default useSyncAdminMenu;
