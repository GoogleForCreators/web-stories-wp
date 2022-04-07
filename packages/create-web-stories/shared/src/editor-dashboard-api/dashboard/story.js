/**
 * Internal dependencies
 */
 import { LOCAL_STORAGE_CONTENT_KEY } from '../../constants';

 export const updateStory = (story) => {
   const storyData =
     JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};

   const singleStoryData = storyData[story.id];

   singleStoryData.title = story.title;
   storyData[singleStoryData.storyId] = singleStoryData;

   window.localStorage.setItem(
     LOCAL_STORAGE_CONTENT_KEY,
     JSON.stringify(storyData),
   );

   return Promise.resolve({
     id: Number(singleStoryData?.storyId),
     status: 'publish',
     title: story.title.raw,
     created: '2021-11-04T10:12:47',
     createdGmt: '2021-11-04T10:12:47Z',
     author: singleStoryData?.author,
     capabilities: {
       hasEditAction: true,
     },
     featuredMediaUrl: '',
     editStoryLink: '/editor?id=' + Number(singleStoryData?.storyId),
   });
 };

 export const fetchStories = () => {
   const content =
     JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};
   const contentKeys = Object.keys(content).map((x)=>{return parseInt(x)});
   let response = {
     stories: {},
     totalPages: 1,
     totalStoriesByStatus: {
       all: contentKeys.length,
       publish: contentKeys.length,
     },
     fetchedStoryIds: contentKeys,
   };
   contentKeys.forEach((key) => {
     const { storyId, author, title } = content[key];
     response.stories[storyId] = {
       id: Number(storyId),
       status: 'publish',
       title: title?.raw || '',
       created: '2021-11-04T10:12:47',
       createdGmt: '2021-11-04T10:12:47Z',
       author: author,
       capabilities: {
         hasEditAction: true,
         hasDeleteAction: true,
       },
       featuredMediaUrl: '',
       editStoryLink: '/editor?id=' + Number(storyId),
     };
   });
   return Promise.resolve(response);
 };
 export const trashStory = (id) => {
   try {
     const storyData =
       JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_CONTENT_KEY)) || {};

     const newStoryData = {}
     const storyIdList = Object.keys(storyData);

     storyIdList.forEach((storyId)=>{
       if( Number( storyId ) !== id ){
         newStoryData[id] = storyData[id]
       }
     })

     window.localStorage.setItem(
       LOCAL_STORAGE_CONTENT_KEY,
       JSON.stringify(newStoryData),
     );
     return Promise.resolve();
   } catch (err) {
     console.error('trash story', err);
   }
 };
