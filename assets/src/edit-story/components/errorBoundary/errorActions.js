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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

function ErrorActions() {
  const reload = () => {
    window.location.reload(true);
  };

  return (
    <div>
      <h3 className="loading-message" style={{ padding: 40 }}>
        {__('Editor has crashed.', 'web-stories')}
        <br />
        {__(
          "Try to reload if that doesn't help, wait for a fix.",
          'web-stories'
        )}
        <br />
        <button onClick={reload}>{__('Reload', 'web-stories')}</button>
      </h3>
    </div>
  );
}

export default ErrorActions;
