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
import { _x } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import type { StickerProps, Sticker } from '../types';

const title = _x('Cheese', 'sticker name', 'web-stories');

const Cheese = ({ style }: StickerProps) => (
  <svg
    style={style}
    viewBox="0 0 50 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M47.0601 37.0668C45.361 37.0154 43.6691 36.8612 41.9827 36.6575C41.0024 36.5401 40.0258 36.4006 39.0474 36.2703C38.7496 36.2299 38.4864 36.1161 38.2849 35.8849C37.4118 34.8774 36.2663 34.5378 34.9974 34.5617C33.8356 34.5837 32.7192 34.804 31.7317 35.4867C31.414 35.705 31.0564 35.806 30.6643 35.8152C29.2865 35.8464 27.9086 35.8941 26.5308 35.9344C24.7028 35.9895 22.8748 36.0501 21.045 36.0996C18.4182 36.173 15.7951 36.2941 13.1811 36.5823C11.5945 36.7566 10.0007 36.8686 8.40684 36.9677C6.82571 37.0668 5.25366 37.2173 3.68705 37.4522C3.48737 37.4815 3.28224 37.5017 3.08074 37.4999C2.37096 37.4925 1.96251 37.175 1.79914 36.485C1.71926 36.1437 1.65573 35.7913 1.64121 35.4426C1.58312 33.8827 1.31082 32.3521 1.04942 30.8197C1.04034 30.761 1.02763 30.7041 1.02219 30.6454C0.933237 29.5534 0.764413 29.4561 1.53592 28.5881C1.92621 28.1495 2.06417 27.5769 2.12771 27.0024C2.26385 25.7527 2.08595 24.5708 1.30537 23.5394C0.920529 23.031 0.771675 22.4511 0.748076 21.8143C0.688171 20.3057 0.671833 18.7935 0.432213 17.296C0.32511 16.628 0.519347 16.0003 0.915084 15.4699C1.27088 14.9928 1.67388 14.5432 2.10048 14.1284C3.09889 13.1612 4.22983 12.3574 5.3535 11.5499C5.97978 11.0985 6.60606 10.647 7.22508 10.1845C7.82231 9.73673 8.48127 9.46145 9.21647 9.35501C10.0315 9.23755 10.7849 8.94025 11.491 8.51448C12.0302 8.18781 12.4314 7.73818 12.7164 7.17661C12.769 7.072 12.8271 6.96739 12.8634 6.85728C13.1121 6.06997 13.6621 5.55978 14.3302 5.12667C15.7733 4.19254 17.1929 3.22355 18.6306 2.28208C19.4711 1.73152 20.3116 1.18279 21.2392 0.782713C21.8764 0.507431 22.519 0.434022 23.1979 0.558817C24.1256 0.727657 25.0604 0.868968 25.9862 1.04698C26.5544 1.1571 27.1154 1.31676 27.6799 1.45073C28.0611 1.54066 28.4405 1.63976 28.8254 1.70766C29.1521 1.76639 29.3936 1.91504 29.5333 2.22336C29.5933 2.35733 29.655 2.48946 29.7221 2.61976C30.4174 3.95397 31.4957 4.66787 33.0006 4.71742C34.1751 4.75596 35.2425 4.41277 36.2155 3.78146C36.8363 3.37771 37.4771 3.25658 38.1651 3.46763C39.1363 3.76494 40.1166 4.05123 41.0587 4.42745C42.9975 5.20375 45.0215 5.67173 47.0311 6.1911C47.3542 6.27552 47.6719 6.37829 47.9859 6.49207C48.8173 6.79121 49.302 7.37481 49.3855 8.2759C49.4018 8.45025 49.4182 8.62826 49.4146 8.80261C49.3964 9.58257 49.449 10.3552 49.5689 11.126C49.6542 11.6747 49.558 12.1666 49.115 12.5648C48.7937 12.8548 48.6285 13.2567 48.5396 13.6806C48.3544 14.5487 48.4107 15.4039 48.7175 16.2352C48.8409 16.5729 48.9044 16.9106 48.8827 17.2685C48.7501 19.5001 48.9625 21.7244 49.0224 23.9542C49.0733 25.8609 49.0624 27.7677 49.0805 29.6745C49.0987 31.5226 49.1205 33.3725 49.1314 35.2205C49.1332 35.5564 49.1114 35.8977 49.0515 36.2262C48.9426 36.8264 48.663 37.0484 48.0621 37.0613C47.7281 37.0723 47.3941 37.0668 47.0601 37.0668ZM2.14404 28.7753C2.17672 28.7973 2.2094 28.8193 2.24207 28.8413C2.35462 28.7441 2.48714 28.6633 2.57427 28.5477C2.7322 28.3385 2.8502 28.0999 3.00813 27.8907C3.06622 27.8136 3.18966 27.7879 3.28224 27.7384C3.32218 27.8393 3.40205 27.9439 3.39297 28.0412C3.37664 28.2137 3.32218 28.3844 3.25864 28.5477C3.088 28.9845 2.77032 29.313 2.41816 29.5993C2.00064 29.9388 1.87901 30.3591 1.92802 30.8839C2.03331 31.9796 2.09503 33.077 2.19487 34.1726C2.25841 34.859 2.34917 35.5417 2.44175 36.2244C2.49803 36.6392 2.63055 36.7548 3.04262 36.764C3.25864 36.7695 3.47648 36.7456 3.6925 36.7181C4.24072 36.6502 4.7835 36.5437 5.33353 36.5107C6.57883 36.4355 7.82957 36.4244 9.07487 36.3327C10.5798 36.2226 12.0828 36.0831 13.5823 35.9124C15.5446 35.6885 17.5088 35.5032 19.4856 35.4665C21.7657 35.4224 24.0439 35.4004 26.3221 35.3343C27.5256 35.2995 28.7274 35.1949 29.9291 35.1159C30.372 35.0866 30.5064 34.9655 30.6334 34.536C30.6715 34.4094 30.6788 34.2699 30.7333 34.1543C30.8948 33.8129 31.0292 33.4459 31.2543 33.1523C31.7498 32.5063 32.456 32.1502 33.2003 31.8731C33.2402 31.8584 33.2892 31.8327 33.3255 31.8437C33.4018 31.8676 33.507 31.897 33.5306 31.9539C33.5561 32.0126 33.5216 32.1282 33.4744 32.1833C33.4108 32.2567 33.3055 32.2952 33.222 32.3521C32.8517 32.609 32.4669 32.8476 32.1147 33.1302C31.7172 33.4496 31.4848 33.8955 31.3378 34.38C31.2561 34.6498 31.3868 34.7764 31.6591 34.714C31.7988 34.6828 31.9332 34.6186 32.0693 34.569C32.5195 34.4039 32.957 34.1928 33.4199 34.0809C35.1045 33.6735 36.7056 33.857 38.1669 34.8664C38.2867 34.9489 38.4265 35.0829 38.5463 34.9398C38.6208 34.8517 38.628 34.6645 38.599 34.5378C38.5009 34.1011 38.2813 33.723 38.0017 33.3762C37.8093 33.1376 37.6242 32.8935 37.4444 32.6439C37.3918 32.5705 37.3736 32.4732 37.3355 32.3778C37.7276 32.3191 37.871 32.3576 38.1597 32.6054C38.7115 33.0807 39.0419 33.6863 39.1853 34.4002C39.2198 34.5727 39.2452 34.7471 39.2833 34.9196C39.4286 35.5692 39.6283 35.7454 40.2872 35.8078C41.9918 35.9693 43.6963 36.1363 45.4027 36.2905C46.0526 36.3492 46.7043 36.3969 47.3578 36.4208C48.1656 36.4501 48.3635 36.2923 48.447 35.4628C48.5069 34.8663 48.4887 34.2626 48.4906 33.6606C48.4924 32.5026 48.4833 31.3427 48.4797 30.1847C48.4779 29.1864 48.4996 28.188 48.4706 27.1915C48.4179 25.4315 48.3272 23.6734 48.2636 21.9134C48.2183 20.682 48.1929 19.4505 48.1547 18.2173C48.1511 18.0851 48.1329 17.9548 48.1166 17.8227C48.0712 17.4777 47.9024 17.2391 47.5847 17.0739C46.9693 16.7564 46.5228 16.2573 46.2396 15.6259C46.1397 15.4039 46.0925 15.1525 46.0617 14.9084C46.0381 14.723 46.0472 14.4826 46.265 14.4275C46.4919 14.3707 46.5137 14.6221 46.5881 14.7689C46.7515 15.0956 46.8876 15.4387 47.0728 15.7526C47.258 16.0664 47.5012 16.3362 47.9641 16.4077C47.9351 16.2462 47.9224 16.1215 47.8879 16.0058C47.612 15.0699 47.6864 14.1449 47.9895 13.2365C48.0803 12.963 48.2146 12.6859 48.3943 12.4657C48.7229 12.0675 48.8427 11.6233 48.8409 11.1223C48.8391 10.4194 48.8209 9.71655 48.8554 9.01549C48.9026 8.03365 48.4724 7.37481 47.592 7.02612C47.0528 6.81323 46.4974 6.62788 45.9328 6.50675C44.7093 6.24432 43.5039 5.92682 42.3258 5.50289C41.0533 5.04592 39.7698 4.62566 38.4447 4.34303C37.7458 4.19438 37.154 4.28614 36.6729 4.86056C36.3952 5.18907 36.0376 5.4148 35.6473 5.58731C34.3058 6.18008 32.908 6.33608 31.4703 6.11769C30.9093 6.03327 30.3593 5.87177 29.9291 5.45701C29.8147 5.3469 29.7149 5.21843 29.6314 5.08262C29.6041 5.03858 29.6241 4.92847 29.6622 4.88993C29.6985 4.85322 29.7966 4.85322 29.8547 4.87525C29.9182 4.8991 29.9708 4.9615 30.0235 5.01105C30.3811 5.34139 30.8168 5.51207 31.2833 5.56529C32.4215 5.69742 33.5452 5.61667 34.638 5.24596C34.7106 5.2221 34.7759 5.17255 34.8431 5.13401C34.8358 5.10281 34.8286 5.07161 34.8213 5.04041C34.6906 5.05877 34.5545 5.06427 34.4274 5.09914C33.8465 5.25697 33.2547 5.30469 32.6575 5.26798C31.031 5.16521 29.8002 4.45498 29.1394 2.89138C28.9851 2.52433 28.7274 2.31512 28.3498 2.20501C26.7832 1.74987 25.1784 1.48744 23.5737 1.22684C22.6897 1.08369 21.8328 1.10204 21.0359 1.55717C20.3661 1.9389 19.7017 2.3298 19.0518 2.74823C18.5381 3.07857 18.0643 3.47131 17.5523 3.80715C16.5902 4.43663 15.6082 5.03674 14.6442 5.66622C14.0379 6.0608 13.5405 6.54529 13.2773 7.2647C12.9996 8.02815 12.4913 8.62826 11.7996 9.06137C11.0118 9.55321 10.1713 9.90741 9.24914 10.023C8.67369 10.0946 8.16541 10.3001 7.67891 10.6213C6.06147 11.6931 4.55114 12.9098 3.03899 14.1229C2.53978 14.523 2.08051 14.9744 1.6285 15.4296C1.22913 15.8315 1.05305 16.3362 1.10024 16.9143C1.12384 17.2042 1.10932 17.5034 1.15289 17.7915C1.29993 18.7531 1.30356 19.7203 1.29811 20.6893C1.2963 20.9242 1.309 21.1591 1.309 21.394C1.309 22.0455 1.50687 22.6236 1.87175 23.165C2.12226 23.5376 2.36188 23.9395 2.50166 24.3634C2.94096 25.6958 2.91373 27.0171 2.28564 28.2999C2.21484 28.4468 2.18943 28.6156 2.14404 28.7753Z"
      fill="#EE9D5B"
    />
    <path
      d="M27.346 10.7336C27.5475 10.5024 27.8016 10.4859 28.034 10.5428C28.3971 10.6327 28.7819 10.7189 29.0978 10.9098C29.931 11.4145 30.8078 11.4805 31.7445 11.3576C33.7086 11.1007 35.6292 10.6639 37.5153 10.0583C39.6102 9.38657 41.7595 8.9663 43.9179 8.57907C44.8746 8.4084 45.824 8.19368 46.7788 8.00465C46.9495 7.97162 47.1964 7.83948 47.2599 8.10192C47.3162 8.32948 47.0511 8.34417 46.8986 8.39922C45.7623 8.81582 44.5914 9.09477 43.4024 9.29848C41.598 9.60863 39.8063 9.972 38.0636 10.5501C36.4153 11.0952 34.7125 11.3759 32.9989 11.6109C32.1511 11.7265 31.3088 11.888 30.4738 12.0733C29.8856 12.2036 29.3664 12.1155 28.9362 11.7044C28.5151 11.3025 28.0758 10.9649 27.4949 10.8511C27.444 10.8456 27.4077 10.7868 27.346 10.7336Z"
      fill="#EE9D5B"
    />
    <path
      d="M37.3338 17.1202C37.2231 17.2468 37.1142 17.3734 37.0034 17.5001C36.5042 18.0782 36.1375 18.7113 36.1575 19.5151C36.1793 20.4456 36.7311 21.1742 37.6406 21.3136C38.688 21.4751 39.6302 21.2035 40.3581 20.3722C40.7811 19.8895 40.8664 19.3298 40.6758 18.7278C40.4943 18.1589 40.1911 17.6652 39.7609 17.2505C39.2453 16.755 38.6427 16.6008 37.9528 16.7641C37.8094 16.7972 37.6206 16.9422 37.5335 16.7274C37.4464 16.5146 37.6624 16.4283 37.8022 16.3365C38.1816 16.0906 38.5864 16.0649 39.013 16.1989C40.1802 16.5659 41.3239 18.0433 41.3547 19.2766C41.3711 19.9372 41.1242 20.5245 40.6395 20.9668C39.6828 21.8422 38.5664 22.178 37.2975 21.855C36.3227 21.6073 35.6637 20.7649 35.6057 19.75C35.5675 19.0875 35.6801 18.4636 36.0232 17.891C36.2392 17.5313 36.5206 17.2395 36.9218 17.0945C37.0343 17.0523 37.1614 17.0504 37.283 17.0302C37.2993 17.0596 37.3175 17.089 37.3338 17.1202Z"
      fill="#EE9D5B"
    />
    <path
      d="M24.6993 27.3607C24.8155 27.4598 24.9462 27.5405 25.0406 27.6543C26.1025 28.9408 27.5058 29.3207 29.0923 29.2198C29.784 29.1757 30.4338 28.9922 31.0383 28.6508C31.9696 28.126 32.6122 27.3735 32.85 26.2999C32.8555 26.2706 32.8645 26.243 32.8718 26.2155C32.9535 25.9384 33.066 25.832 33.2367 25.8742C33.4055 25.9164 33.4872 26.065 33.46 26.3403C33.3982 26.9735 33.1241 27.5148 32.7393 28.0085C31.1945 29.9997 28.29 30.6017 26.1007 29.3776C25.4763 29.0289 24.9843 28.5426 24.6739 27.8837C24.6031 27.7332 24.4905 27.5717 24.6993 27.3607Z"
      fill="#EE9D5B"
    />
    <path
      d="M24.4979 16.9844C24.0314 16.9091 23.4232 16.8431 22.8314 16.7109C22.2651 16.5843 21.7876 16.2705 21.4173 15.8135C21.3229 15.696 21.2558 15.5327 21.234 15.3822C21.2104 15.2079 21.3647 15.1235 21.528 15.1969C21.5807 15.2207 21.6279 15.2593 21.6715 15.296C22.2415 15.7951 22.9295 16.0264 23.6574 16.1255C24.7466 16.276 25.8267 16.1842 26.8886 15.8906C27.5349 15.7126 28.0359 15.3437 28.379 14.7564C28.5043 14.5417 28.6495 14.338 28.8092 14.149C28.871 14.0737 28.998 14.0554 29.0942 14.0095C29.1196 14.1141 29.1904 14.2334 29.1614 14.3178C28.8092 15.3418 28.2574 16.1732 27.1664 16.5402C26.3386 16.8174 25.4945 16.9018 24.4979 16.9844Z"
      fill="#EE9D5B"
    />
    <path
      d="M44.7167 24.2317C44.4698 24.4024 44.2719 24.5418 44.0686 24.6758C43.5422 25.0263 43.141 25.4723 43.0067 26.1164C42.9885 26.2027 42.9703 26.289 42.9613 26.3752C42.8269 27.5993 43.6311 28.3371 44.8347 28.0911C45.4265 27.97 45.9002 27.6452 46.2905 27.1882C46.3759 27.0891 46.4412 26.968 46.5356 26.8817C46.601 26.8212 46.7244 26.7514 46.7807 26.7771C46.8497 26.8102 46.9241 26.946 46.9096 27.0212C46.8624 27.2616 46.7988 27.5057 46.6954 27.7241C46.6227 27.8746 46.483 28.0012 46.3523 28.115C45.6007 28.7665 44.0958 28.9262 43.2245 28.4527C42.6981 28.1664 42.4022 27.7094 42.335 27.1221C42.2188 26.1183 42.5002 25.2282 43.2118 24.5125C43.4187 24.3033 43.7037 24.1546 43.9778 24.0371C44.1993 23.9435 44.4553 23.9601 44.7167 24.2317Z"
      fill="#EE9D5B"
    />
    <path
      d="M15.7825 29.4841C15.7807 30.5503 14.933 31.4019 13.8692 31.4074C12.8 31.4129 12.0666 30.6439 12.072 29.5263C12.0775 28.416 12.9053 27.5038 13.9 27.5149C14.9221 27.5259 15.7843 28.427 15.7825 29.4841ZM12.6257 29.4418C12.6257 30.2053 13.1195 30.7632 13.7893 30.7522C14.5989 30.7412 15.1853 30.1961 15.1962 29.4455C15.2089 28.6912 14.5281 27.9994 13.7857 28.014C13.1013 28.0287 12.6239 28.616 12.6257 29.4418Z"
      fill="#EE9D5B"
    />
    <path
      d="M24.1221 26.6009C24.0549 26.4816 23.9714 26.3697 23.9206 26.2449C23.6428 25.5604 23.5739 24.841 23.71 24.1271C24.0676 22.2588 25.1151 20.9044 26.8069 20.0749C27.2952 19.8345 27.8253 19.7354 28.3717 19.7592C28.6839 19.7739 28.9762 19.8547 29.2213 20.0547C29.2939 20.1134 29.3393 20.2034 29.4518 20.352C29.2449 20.3777 29.1123 20.3942 28.978 20.4089C28.5315 20.4566 28.0794 20.4731 27.6401 20.5576C25.8121 20.9099 24.5033 22.624 24.2201 24.3601C24.1239 24.9492 24.1511 25.5273 24.2564 26.1091C24.2818 26.2541 24.26 26.4082 24.26 26.5587C24.2165 26.5734 24.1693 26.5881 24.1221 26.6009Z"
      fill="#EE9D5B"
    />
    <path
      d="M25.2911 11.119C25.2022 11.3136 25.0061 11.2879 24.8482 11.3338C24.2364 11.5118 23.6156 11.6641 23.0111 11.8641C22.432 12.0568 21.9637 12.4221 21.6097 12.9322C21.5262 13.0515 21.4318 13.1635 21.3446 13.2809C20.9253 13.8572 20.368 14.1692 19.6637 14.2591C19.0882 14.3325 18.5218 14.4647 17.95 14.5564C17.7667 14.5858 17.5724 14.5839 17.3891 14.5601C17.3074 14.5491 17.2366 14.45 17.1622 14.3912C17.2221 14.3197 17.2711 14.2297 17.3455 14.182C17.4145 14.138 17.5107 14.1361 17.596 14.116C18.1207 13.9985 18.6417 13.87 19.1681 13.7673C19.8561 13.6351 20.4025 13.2993 20.8309 12.734C21.0324 12.4698 21.2738 12.2294 21.5262 12.0128C22.2414 11.3998 23.1182 11.198 24.0168 11.064C24.3036 11.0218 24.5904 10.9832 24.879 10.9557C25.0914 10.9374 25.0914 10.9465 25.2911 11.119Z"
      fill="#EE9D5B"
    />
    <path
      d="M19.0628 28.6894C19.0174 29.4712 18.9376 30.2291 18.5491 30.91C18.4638 31.0605 18.3567 31.2055 18.2332 31.3229C18.1769 31.3761 18.0117 31.4018 17.9664 31.3596C17.8974 31.2972 17.8484 31.1578 17.8647 31.0642C17.8901 30.9247 17.9791 30.7981 18.0426 30.6659C18.5563 29.5978 18.6489 28.5059 18.2151 27.3882C17.9773 26.7753 17.6051 26.2467 17.0805 25.8595C16.8173 25.6668 16.4942 25.5512 16.1892 25.4245C16.0313 25.3585 15.8425 25.3603 15.6863 25.2906C15.5847 25.2447 15.5175 25.1236 15.434 25.0373C15.5357 24.9676 15.641 24.8373 15.7408 24.8409C16.0113 24.8501 16.2981 24.8685 16.5486 24.9657C17.9355 25.5016 18.7742 26.5055 18.9975 28.0049C19.0319 28.2361 19.0428 28.471 19.0628 28.6894Z"
      fill="#EE9D5B"
    />
    <path
      d="M18.1751 9.43614C17.6923 9.34071 17.2058 9.26547 16.7302 9.14618C16.3726 9.05625 16.1729 8.7773 16.1275 8.41576C16.1148 8.30932 16.2092 8.1882 16.2527 8.07441C16.349 8.12213 16.4815 8.14415 16.5323 8.22307C16.7592 8.56442 17.1023 8.68738 17.4672 8.71307C18.7161 8.80299 19.9342 8.7094 21.0143 7.96614C21.5698 7.58441 21.9237 7.07422 22.0309 6.39519C22.0581 6.22819 22.0454 5.97676 22.2723 5.99511C22.5228 6.0153 22.4811 6.27407 22.4738 6.45575C22.4375 7.27059 22.0781 7.91659 21.4318 8.39558C20.6839 8.94798 19.818 9.18105 18.9212 9.31686C18.678 9.35356 18.4311 9.37191 18.186 9.3976C18.1824 9.41045 18.1788 9.4233 18.1751 9.43614Z"
      fill="#EE9D5B"
    />
    <path
      d="M13.5007 25.6815C13.3555 25.8265 13.2919 25.9146 13.2066 25.9714C11.6328 27.034 11.2207 28.594 11.3732 30.3833C11.4258 31.0018 11.6128 31.589 11.9704 32.1066C11.9958 32.1433 12.0267 32.1818 12.0303 32.2222C12.0376 32.3158 12.0666 32.4498 12.0194 32.4956C11.9668 32.5489 11.8324 32.547 11.7435 32.5268C11.6491 32.5048 11.5493 32.4498 11.4821 32.38C11.3532 32.2442 11.2025 32.1047 11.139 31.9359C10.3294 29.785 10.5236 27.8599 12.1719 26.2816C12.4369 26.0265 12.7982 25.8705 13.1231 25.687C13.1939 25.6484 13.3028 25.6815 13.5007 25.6815Z"
      fill="#EE9D5B"
    />
    <path
      d="M6.14146 16.4485C6.16688 16.2008 6.34659 16.1769 6.49 16.142C7.10902 15.9971 7.72985 15.8502 8.35613 15.7346C9.35274 15.5511 10.3548 15.3896 11.3532 15.2208C11.9523 15.1198 12.5531 15.0189 13.1558 14.9326C13.301 14.9106 13.5134 14.8482 13.5588 15.0629C13.6042 15.2721 13.3936 15.3107 13.252 15.3676C12.2717 15.7493 11.2497 15.9493 10.2132 16.0907C9.1948 16.2301 8.1746 16.3623 7.1544 16.4889C6.91115 16.5183 6.66246 16.5201 6.41739 16.5201C6.32481 16.5201 6.23404 16.4742 6.14146 16.4485Z"
      fill="#EE9D5B"
    />
    <path
      d="M9.32191 17.7386C9.19666 17.8744 9.09318 17.9882 8.98971 18.102C8.30171 18.86 8.08932 19.7207 8.44331 20.7007C8.75554 21.5651 9.44898 22.0386 10.353 21.9908C10.6398 21.9762 10.923 21.8936 11.2062 21.8404C11.3206 21.8183 11.4349 21.7614 11.5438 21.7706C11.6419 21.7798 11.7363 21.8587 11.8307 21.9064C11.7835 22 11.7581 22.1523 11.6854 22.1817C10.805 22.5359 9.90281 22.7708 9.0006 22.2808C8.1456 21.8147 7.77527 21.0274 7.71355 20.0767C7.66817 19.3591 7.88238 18.715 8.32713 18.1552C8.45238 17.9974 8.60668 17.8561 8.76825 17.7368C8.90621 17.6359 9.0714 17.5515 9.32191 17.7386Z"
      fill="#EE9D5B"
    />
    <path
      d="M17.1785 33.0553C17.0987 33.2242 17.0823 33.3233 17.0242 33.3673C16.7719 33.56 16.5323 33.8041 16.2437 33.9069C15.3705 34.2152 14.4647 34.329 13.5425 34.1418C13.3755 34.1088 13.2121 34.0335 13.0578 33.9546C12.9344 33.8922 12.84 33.7637 12.9198 33.6298C12.967 33.5509 13.0959 33.5086 13.1976 33.4829C13.2775 33.4628 13.3719 33.4848 13.4554 33.505C14.5464 33.7509 15.5883 33.5233 16.6194 33.1783C16.7719 33.1287 16.9335 33.1086 17.1785 33.0553Z"
      fill="#EE9D5B"
    />
    <path
      d="M12.9543 21.3632C12.731 21.2366 12.7728 21.0678 12.8036 20.9118C12.8345 20.7539 12.8889 20.6016 12.9343 20.4475C13.1503 19.6969 13.0378 18.9958 12.6167 18.3461C12.4587 18.1021 12.2681 17.88 12.0993 17.6414C12.0394 17.557 11.9994 17.4561 11.9504 17.3625C11.9722 17.3331 11.994 17.3056 12.0158 17.2762C12.1301 17.3074 12.2572 17.3166 12.3571 17.3753C13.6114 18.1039 14.0798 19.8418 13.1921 21.1595C13.134 21.2476 13.0269 21.3027 12.9543 21.3632Z"
      fill="#EE9D5B"
    />
    <path
      d="M22.3648 32.8902C22.0217 32.7434 21.9382 32.6149 21.9582 32.347C21.9963 31.8111 22.4465 31.3541 22.973 31.3174C23.5212 31.2789 24.1075 31.712 24.191 32.2314C24.2037 32.3158 24.1438 32.4112 24.1166 32.5011C24.0313 32.4681 23.9278 32.4553 23.8679 32.3947C23.7771 32.3048 23.7227 32.1781 23.6464 32.0717C23.4849 31.8515 23.2997 31.6735 22.9966 31.7359C22.7043 31.7964 22.4719 32.0533 22.4193 32.3763C22.3921 32.5305 22.3848 32.6883 22.3648 32.8902Z"
      fill="#EE9D5B"
    />
    <path
      d="M3.48572 26.8248C3.43308 26.678 3.38406 26.5807 3.36591 26.478C3.27877 26.0063 3.1989 25.531 3.1154 25.0575C3.09543 24.9419 3.0446 24.8263 3.05368 24.7143C3.06094 24.6281 3.12266 24.5216 3.19346 24.4757C3.23339 24.4501 3.35683 24.5069 3.41311 24.5583C3.83244 24.9346 4.01034 26.1311 3.71989 26.6193C3.68177 26.6872 3.60008 26.7276 3.48572 26.8248Z"
      fill="#EE9D5B"
    />
    <path
      d="M46.9114 26.0412C46.8242 25.9347 46.7262 25.8338 46.65 25.7182C46.4267 25.3786 46.2107 25.0336 45.9928 24.6904C45.9692 24.6537 45.9257 24.6207 45.9202 24.584C45.9075 24.4775 45.8658 24.3344 45.9166 24.272C45.9674 24.2096 46.1344 24.1839 46.2161 24.2206C46.3704 24.2904 46.5211 24.395 46.6354 24.5198C46.9168 24.8299 47.0602 25.2153 47.1238 25.6246C47.1437 25.7494 47.0766 25.887 47.0493 26.0191C47.0021 26.0246 46.9568 26.032 46.9114 26.0412Z"
      fill="#EE9D5B"
    />
    <path
      d="M16.4797 7.11642C16.5705 6.98612 16.6304 6.85949 16.7266 6.7659C17.1768 6.32912 17.7177 6.05567 18.3204 5.90335C18.3767 5.88866 18.4384 5.86481 18.491 5.87765C18.5691 5.89784 18.7016 5.94739 18.7016 5.98226C18.6998 6.06668 18.6472 6.16211 18.5909 6.23001C18.5473 6.2814 18.4638 6.29608 18.4003 6.33095C17.9519 6.57136 17.5017 6.80811 17.057 7.05403C16.8101 7.19167 16.8137 7.19901 16.4797 7.11642Z"
      fill="#EE9D5B"
    />
    <path
      d="M46.5193 13.1157C46.5575 12.6404 47.0476 12.0164 47.4397 11.91C47.5359 11.8843 47.7065 11.899 47.7465 11.9595C47.8046 12.0458 47.8082 12.2055 47.7701 12.3101C47.7301 12.4257 47.623 12.5211 47.5323 12.6147C47.3308 12.8203 47.1275 13.0276 46.9096 13.2148C46.8352 13.2791 46.7063 13.3249 46.6174 13.3066C46.5629 13.2956 46.5339 13.1469 46.5193 13.1157Z"
      fill="#EE9D5B"
    />
    <path
      d="M35.7 31.2734C35.858 31.323 36.0268 31.3578 36.1811 31.4294C36.3245 31.4955 36.4752 31.5964 36.437 31.7909C36.3989 31.9873 36.2247 32.0277 36.0649 32.0167C35.6928 31.991 35.3188 31.9506 34.9503 31.89C34.8596 31.8754 34.7833 31.7597 34.7016 31.69C34.776 31.6111 34.8378 31.4936 34.9267 31.4624C35.17 31.3798 35.4277 31.3358 35.7 31.2734Z"
      fill="#EE9D5B"
    />
    <path
      d="M33.1042 24.2849C33.0043 24.1436 32.9099 24.05 32.8664 23.938C32.7175 23.5563 32.5832 23.1691 32.4525 22.78C32.4253 22.7011 32.4125 22.6001 32.438 22.5249C32.4833 22.3781 32.5959 22.3157 32.7447 22.3909C32.7956 22.4166 32.8446 22.457 32.8773 22.5029C33.2222 22.9911 33.3311 23.5379 33.2476 24.127C33.2403 24.1619 33.1913 24.1894 33.1042 24.2849Z"
      fill="#EE9D5B"
    />
    <path
      d="M23.0202 33.4628C22.953 33.4408 22.786 33.3985 22.6299 33.3306C22.5809 33.3086 22.5337 33.2113 22.5391 33.1545C22.5445 33.0976 22.6117 33.0205 22.6662 33.004C22.9802 32.9067 23.2961 32.8131 23.6174 32.7397C23.8134 32.6956 23.9115 32.8315 23.8534 33.0297C23.7735 33.2976 23.4958 33.4628 23.0202 33.4628Z"
      fill="#EE9D5B"
    />
    <path
      d="M29.1868 4.01673C29.1451 4.24613 29.0107 4.34524 28.8328 4.27733C28.6114 4.19475 28.359 3.70842 28.4153 3.47718C28.4553 3.31568 28.6386 3.22759 28.7403 3.34871C28.9127 3.55242 29.0416 3.79284 29.1868 4.01673Z"
      fill="#EE9D5B"
    />
  </svg>
);

export default {
  aspectRatio: 50 / 38,
  svg: Cheese,
  title,
} as Sticker;
