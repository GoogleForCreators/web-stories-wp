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
import { createResource } from '@googleforcreators/media';

function createDummyImageData({
  mimeType = 'image/jpeg',
  src,
  width,
  height,
  id,
  title,
}) {
  return createResource({
    mimeType,
    creationDate: '2021-10-29T11:43:38',
    src,
    width,
    height,
    id,
    alt: title,
    sizes: {
      medium: {
        file: `${title}-300x84.jpeg`,
        width: 300,
        height: 84,
        mimeType,
        sourceUrl: src,
      },
      large: {
        file: `${title}-1024x288.jpeg`,
        width: 1024,
        height: 288,
        mimeType,
        sourceUrl: src,
      },
      thumbnail: {
        file: `${title}-150x150.jpeg`,
        width: 150,
        height: 150,
        mimeType,
        sourceUrl: src,
      },
      medium_large: {
        file: `${title}-768x216.jpeg`,
        width: 768,
        height: 216,
        mimeType,
        sourceUrl: src,
      },
      '1536x1536': {
        file: `${title}-1536x432.jpeg`,
        width: 1536,
        height: 432,
        mimeType,
        sourceUrl: src,
      },
      '2048x2048': {
        file: `${title}-2048x576.jpeg`,
        width: 2048,
        height: 576,
        mimeType,
        sourceUrl: src,
      },
      'post-thumbnail': {
        file: `${title}-1568x441.jpeg`,
        width: 1568,
        height: 441,
        mimeType,
        sourceUrl: src,
      },
      'web-stories-poster-portrait': {
        file: `${title}-640x853.jpeg`,
        width: 640,
        height: 853,
        mimeType,
        sourceUrl: src,
      },
      'web-stories-publisher-logo': {
        file: `${title}-96x96.jpeg`,
        width: 96,
        height: 96,
        mimeType,
        sourceUrl: src,
      },
      'web-stories-thumbnail': {
        file: `${title}-150x42.jpeg`,
        width: 150,
        height: 42,
        mimeType,
        sourceUrl: src,
      },
      full: {
        file: title,
        width,
        height,
        mimeType,
        sourceUrl: src,
      },
    },
  });
}

function createDummyVideoData({
  mimeType = 'video/mp4',
  src,
  mediaDetails,
  id,
  title,
  poster,
}) {
  return createResource({
    mimeType,
    creationDate: '2021-10-29T11:56:33',
    src,
    width: mediaDetails.width,
    height: mediaDetails.height,
    poster: poster.src,
    posterId: 57,
    id,
    length: mediaDetails.length,
    bitsPerSample: mediaDetails.bitsPerSample,
    alt: title,
  });
}

function getDummyMedia() {
  return [
    createDummyImageData({
      mimeType: 'image/png',
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page1_bg-alt.png',
      width: 412,
      height: 732,
      id: 1,
      title: 'Fresh and Bright 1',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page3_figure.jpg',
      width: 720,
      height: 844,
      id: 2,
      title: 'Fresh and Bright 2',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page4_bg.png',
      width: 750,
      height: 1334,
      id: 3,
      title: 'Fresh and Bright 3',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page5_figure.jpg',
      width: 750,
      height: 1079,
      id: 4,
      title: 'Fresh and Bright 4',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page7_product1.jpg',
      width: 720,
      height: 900,
      id: 5,
      title: 'Fresh and Bright 5',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page8_figure.jpg',
      width: 408,
      height: 544,
      id: 6,
      title: 'Fresh and Bright 6',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page9_story1.jpg',
      width: 720,
      height: 405,
      id: 7,
      title: 'Fresh and Bright 7',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page9_story2.jpg',
      width: 480,
      height: 720,
      id: 8,
      title: 'Fresh and Bright 8',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page9_story3.jpg',
      width: 480,
      height: 720,
      id: 9,
      title: 'Fresh and Bright 9',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/food-and-stuff/page1_bg.jpg',
      width: 1080,
      height: 1620,
      id: 10,
      title: 'Fresh and Bright 10',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/food-and-stuff/page3_image1.jpg',
      width: 1080,
      height: 720,
      id: 11,
      title: 'Food and Stuff 1',
    }),
    createDummyImageData({
      src: 'https://wp.stories.google/static/main/images/templates/food-and-stuff/page5_bg.jpg',
      width: 731,
      height: 1300,
      id: 12,
      title: 'Food and Stuff 2',
    }),
    createDummyVideoData({
      src: 'https://stream.mux.com/OGTmBYTMkV7Ez601cRNpH6BP10102fQu9C00/high.mp4?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InQ5UHZucm9ZY0hQNjhYSmlRQnRHTEVVSkVSSXJ0UXhKIn0.eyJleHAiOjE2MjYxNzgxMTIsImF1ZCI6InYiLCJzdWIiOiJPR1RtQllUTWtWN0V6NjAxY1JOcEg2QlAxMDEwMmZRdTlDMDAifQ.Jvddeah-XyF0AMmfYND-fFaIfgeDYW_cAuIVIXOrk2so_YalyMMAQ11YXHA1h11yKpLM-xa8xiNXazPqA0Suq1tfxHjJjEqiQOzSlPYd4visiPdTjUgT50FkwYdJrN0IldfXoS19yi3GyAd9McVFoSGCZ6qp8m_hgJ39y8FJJbOrvGtrzEvElpz1M8M1Dat3PF-BSLvFcTvCOlec9dipajxHG_2Xg-EE_vOqww6z81kC09evj5gu_A-Vz58Q-ebd08R47ybNejhE3rzMr1dCKgUikjkkQokPPQyrwVEy8zeZ68elax-ZRvDokZ2mTVPGvKIye6m_CQ-WVlG5XRjw7A',
      mediaDetails: {
        filesize: 1867215,
        mimeType: 'video/mp4',
        length: 12,
        lengthFormatted: '0:12',
        width: 720,
        height: 406,
        fileformat: 'mp4',
        dataformat: 'quicktime',
        audio: {
          dataformat: 'mp4',
          codec: 'ISO/IEC 14496-3 AAC',
          sampleRate: 48000,
          channels: 2,
          bitsPerSample: 16,
          lossless: false,
          channelmode: 'stereo',
        },
        createdTimestamp: -2082844800,
        sizes: {},
      },
      id: 13,
      title: 'Story',
      poster: {
        src: 'https://image.mux.com/OGTmBYTMkV7Ez601cRNpH6BP10102fQu9C00/thumbnail.jpg?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InQ5UHZucm9ZY0hQNjhYSmlRQnRHTEVVSkVSSXJ0UXhKIn0.eyJ0aW1lIjowLCJleHAiOjMxNzE3MDYwNjg4MSwiYXVkIjoidCIsInN1YiI6Ik9HVG1CWVRNa1Y3RXo2MDFjUk5wSDZCUDEwMTAyZlF1OUMwMCJ9.WxHU2cpFdNqqiWF08KEv1g7barfbE_Nw4JDvVrtrQc9mVKiSZ6pEHpYl14NZeaBOf4Ep9MiomaegCVrD-UANhURlxWuHWFx5h7Msg74-q_ojjuZbLZtFPUdA0NA3_GTq5y0LDAeXijM7oENn_IkuDSY0fbRhRUVh-hYqCzw_OqMx7B1IxoOkkZUCHgkm9VnPdAMQRpmaanCHB8SHVRI_vIJo577DxLd88KBFP3UWK1XTvN5NYr0oPtwc82XMYUW4HrxZZTmxzLSZckxzwB7T5E6zAtXpo-xwd52yB1OUhoihlTqiOPWbntpvt9H4lFVRISLwsT39d1Tw80HF_X02eQ',
        width: 1920,
        height: 1080,
        generated: false,
      },
    }),
    createDummyVideoData({
      src: 'https://storage.coverr.co/videos/PDolZIrwdONTFJd005VOT4qvFsyxVfB01N/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjI2ODM0NDQzfQ._6LJb2Ad843im0xV4-2I2vVpDNoPiy8nPc3-3IkSSuw',
      mediaDetails: {
        filesize: 1510877,
        mimeType: 'video/quicktime',
        length: 18,
        lengthFormatted: '0:18',
        width: 640,
        height: 360,
        fileformat: 'mp4',
        dataformat: 'quicktime',
        createdTimestamp: -2082844800,
        sizes: {},
      },
      id: 14,
      title: 'Low',
      poster: {
        src: 'https://storage.coverr.co/p/PDolZIrwdONTFJd005VOT4qvFsyxVfB01N',
        width: 2048,
        height: 1152,
        generated: false,
      },
    }),
    createDummyVideoData({
      src: 'https://storage.coverr.co/videos/qMc3OVOA8a6Q9j01T2L3pGfF029UA00OvZJ/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjI2ODM3NDkwfQ.rHiHdTyik8sDuP8viRbC4ph-qjHHJ81I7kdawP2-1eQ',
      mediaDetails: {
        filesize: 456538,
        mimeType: 'video/mp4',
        length: 15,
        lengthFormatted: '0:15',
        width: 360,
        height: 640,
        fileformat: 'mp4',
        dataformat: 'quicktime',
        createdTimestamp: -2082844800,
        sizes: {},
        audio: {
          bitsPerSample: 16,
          channelmode: 'stereo',
          channels: 2,
          codec: 'ISO/IEC 14496-3 AAC',
          dataformat: 'mp4',
          lossless: false,
          sampleRate: 48000,
        },
      },
      id: 15,
      title: 'Mountain Video',
      poster: {
        src: 'https://storage.coverr.co/p/qMc3OVOA8a6Q9j01T2L3pGfF029UA00OvZJ',
        width: 1080,
        height: 1920,
        generated: false,
      },
    }),
    createDummyVideoData({
      src: 'https://storage.coverr.co/videos/XHtOLYGTnHiXVxofSdO8oTcA02vxasheL/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjI2ODM3NDkwfQ.rHiHdTyik8sDuP8viRbC4ph-qjHHJ81I7kdawP2-1eQ',
      mediaDetails: {
        filesize: 2536304,
        mimeType: 'video/mp4',
        length: 27,
        lengthFormatted: '0:27',
        width: 640,
        height: 360,
        fileformat: 'mp4',
        dataformat: 'quicktime',
        createdTimestamp: -2082844800,
        sizes: {},
        audio: {
          bitsPerSample: 16,
          channelmode: 'stereo',
          channels: 2,
          codec: 'ISO/IEC 14496-3 AAC',
          dataformat: 'mp4',
          lossless: false,
          sampleRate: 48000,
        },
      },
      id: 16,
      title: 'Beautiful Cloud Video',
      poster: {
        src: 'https://storage.coverr.co/p/XHtOLYGTnHiXVxofSdO8oTcA02vxasheL',
        width: 1920,
        height: 1080,
        generated: false,
      },
    }),
    createDummyVideoData({
      src: 'https://storage.coverr.co/videos/X4pOA7IG76p95Gl3IcU3oX26S2sbGsc2/preview?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBJZCI6IjEyNjFDMkM5QUYxNEY5NkJDRTc2IiwiaWF0IjoxNjI2ODM4Mjc3fQ.lIznWsYEFy3abrDbou1mKJivj6GzQnHO6gJ8jdisPW0',
      mediaDetails: {
        filesize: 1029136,
        mimeType: 'video/mp4',
        length: 10,
        lengthFormatted: '0:10',
        width: 640,
        height: 360,
        fileformat: 'mp4',
        dataformat: 'quicktime',
        createdTimestamp: -2082844800,
        sizes: {},
        audio: {
          bitsPerSample: 16,
          channelmode: 'stereo',
          channels: 2,
          codec: 'ISO/IEC 14496-3 AAC',
          dataformat: 'mp4',
          lossless: false,
          sampleRate: 48000,
        },
      },
      id: 17,
      title: 'Beautiful Fire Video',
      poster: {
        src: 'https://storage.coverr.co/p/X4pOA7IG76p95Gl3IcU3oX26S2sbGsc2',
        width: 1920,
        height: 1080,
        generated: false,
      },
    }),
  ];
}

export { getDummyMedia };
