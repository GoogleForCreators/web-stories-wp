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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useAPI } from '../../';

function useLoadFonts({ fonts, setFonts }) {
  const {
    actions: { getAllFonts },
  } = useAPI();

  useEffect(() => {
    if (fonts.length === 0) {
      getAllFonts({}).then(setFonts);
    }
  }, [fonts, getAllFonts, setFonts]);
}

export default useLoadFonts;
