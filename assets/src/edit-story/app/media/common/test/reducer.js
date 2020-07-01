// /*
//  * Copyright 2020 Google LLC
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     https://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// /**
//  * External dependencies
//  */
// import { renderHook, act } from '@testing-library/react-hooks';

// /**
//  * Internal dependencies
//  */
// import useMediaReducer from '../../useMediaReducer';
// import reducer from '../reducer';
// import * as actionsToWrap from '../../actions';

// describe('reducer', () => {
//   let state;
//   let actions;

//   beforeEach(render);

//   function render() {
//     const { result } = renderHook(() => useMediaReducer(reducer, actionsToWrap));
//     state = result.current.state;
//     actions = result.current.actions;
//   }

//   it('should assign isMediaLoading=true on fetchMediaStart', async () => {
//     await act(async () => await actions.fetchMediaStart({ pageToken: 'page2' }));
//     render();
//     expect(state, expect.objectContaining({
//       isMediaLoading: true,
//       isMediaLoaded: false,
//     }));
//   });

//   it('should assign isMediaLoading=false on fetchMediaSuccess', async () => {
//     await act(async () => await actions.fetchMediaSuccess({ media: [{id: 'id'}] }));
//     render();
//     expect(state, expect.objectContaining({
//       isMediaLoaded: true,
//       isMediaLoading: false,
//     }));
//   });

//   it('should update state on fetchMediaSuccess', async () => {
//     await act(async () => await actions.fetchMediaSuccess({
//       media: [{id: 'id'}],
//       nextPageToken: 'page2',
//       totalPages: 10,
//     }));
//     render();
//     expect(state, expect.objectContaining({
//       media: [{id: 'id'}],
//       pageToken: undefined,
//       nextPageToken: 'page2',
//       totalPages: 10,
//       hasMore: true,
//     }));
//   });

//   it('should assign isMediaLoading=false on fetchMediaError', async () => {
//     await act(async () => await actions.fetchMediaError());
//     render();
//     expect(state, expect.objectContaining({
//       isMediaLoaded: true,
//       isMediaLoading: false,
//     }));
//   });

//   it('should update pageToken on setNextPage', async () => {
//     await act(async () => await actions.fetchMediaSuccess({ nextPageToken: 'page2' }));
//     render();

//     await act(async () => await actions.setNextPage());
//     render();
//     expect(state, expect.objectContaining({ pageToken: 'page2', nextPageToken: 'page2' }));

//     await act(async () => await fetchMediaSuccess({ nextPageToken: 'page3' }));
//     render();
//     expect(state, expect.objectContaining({ pageToken: 'page2', nextPageToken: 'page3' }));
//   });
// });
