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
import { _x } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';

const title = _x('Dot Rectangle', 'sticker name', 'web-stories');

function DotRectangle({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.05544 29.1443L0.911133 29L1.05467 28.8565L1.19779 28.9996L1.19737 29L1.19856 29.0012L1.05544 29.1443ZM1.62877 28.2824L1.34172 28.5694L1.48484 28.7125L1.77189 28.4255L1.62877 28.2824ZM1.91582 27.9953L2.05894 28.1384L2.34599 27.8514L2.20287 27.7083L1.91582 27.9953ZM2.48993 27.4212L2.63305 27.5643L2.9201 27.2773L2.77698 27.1342L2.48993 27.4212ZM3.06403 26.8471L3.20715 26.9902L3.4942 26.7032L3.35108 26.5601L3.06403 26.8471ZM3.63813 26.273L3.78125 26.4161L4.0683 26.1291L3.92519 25.9859L3.63813 26.273ZM4.21224 25.6989L4.35536 25.842L4.64241 25.555L4.49929 25.4118L4.21224 25.6989ZM4.78634 25.1248L4.92946 25.2679L5.21651 24.9809L5.07339 24.8377L4.78634 25.1248ZM5.36044 24.5507L5.50356 24.6938L5.79062 24.4068L5.6475 24.2636L5.36044 24.5507ZM5.93455 23.9766L6.07767 24.1197L6.36472 23.8327L6.2216 23.6895L5.93455 23.9766ZM6.50865 23.4025L6.65177 23.5456L6.93882 23.2585L6.7957 23.1154L6.50865 23.4025ZM7.08276 22.8284L7.22588 22.9715L7.51293 22.6844L7.36981 22.5413L7.08276 22.8284ZM7.65686 22.2543L7.79998 22.3974L8.08703 22.1103L7.94391 21.9672L7.65686 22.2543ZM8.23096 21.6802L8.37408 21.8233L8.66113 21.5362L8.51802 21.3931L8.23096 21.6802ZM8.80507 21.1061L8.94819 21.2492L9.23524 20.9621L9.09212 20.819L8.80507 21.1061ZM9.37917 20.532L9.52229 20.6751L9.80934 20.388L9.66622 20.2449L9.37917 20.532ZM9.95327 19.9579L10.0964 20.101L10.3834 19.8139L10.2403 19.6708L9.95327 19.9579ZM10.5274 19.3838L10.6705 19.5269L10.9575 19.2398L10.8144 19.0967L10.5274 19.3838ZM11.1015 18.8097L11.2446 18.9528L11.5317 18.6657L11.3885 18.5226L11.1015 18.8097ZM11.6756 18.2355L11.8187 18.3787L12.1058 18.0916L11.9626 17.9485L11.6756 18.2355ZM12.2497 17.6614L12.3928 17.8046L12.6799 17.5175L12.5367 17.3744L12.2497 17.6614ZM12.8238 17.0873L12.9669 17.2305L13.254 16.9434L13.1108 16.8003L12.8238 17.0873ZM13.3979 16.5132L13.541 16.6564L13.8281 16.3693L13.6849 16.2262L13.3979 16.5132ZM13.972 15.9391L14.1151 16.0823L14.4022 15.7952L14.2591 15.6521L13.972 15.9391ZM14.5461 15.365L14.6892 15.5081L14.9763 15.2211L14.8332 15.078L14.5461 15.365ZM15.1202 14.7909L15.2633 14.934L15.5504 14.647L15.4073 14.5039L15.1202 14.7909ZM15.6943 14.2168L15.8374 14.3599L16.1245 14.0729L15.9814 13.9298L15.6943 14.2168ZM16.2684 13.6427L16.4115 13.7858L16.6986 13.4988L16.5555 13.3557L16.2684 13.6427ZM16.8425 13.0686L16.9856 13.2117L17.2727 12.9247L17.1296 12.7816L16.8425 13.0686ZM17.4166 12.4945L17.5597 12.6376L17.8468 12.3506L17.7037 12.2075L17.4166 12.4945ZM17.9907 11.9204L18.1338 12.0635L18.4209 11.7765L18.2778 11.6334L17.9907 11.9204ZM18.5648 11.3463L18.7079 11.4894L18.995 11.2024L18.8519 11.0593L18.5648 11.3463ZM19.1389 10.7722L19.2821 10.9153L19.5691 10.6283L19.426 10.4851L19.1389 10.7722ZM19.713 10.1981L19.8562 10.3412L20.1432 10.0542L20.0001 9.91104L19.713 10.1981ZM20.2871 9.62399L20.4303 9.76711L20.7173 9.48006L20.5742 9.33694L20.2871 9.62399ZM20.8612 9.04989L21.0044 9.19301L21.2914 8.90596L21.1483 8.76284L20.8612 9.04989ZM21.4353 8.47578L21.5785 8.6189L21.8655 8.33185L21.7224 8.18873L21.4353 8.47578ZM22.0095 7.90168L22.1526 8.0448L22.4396 7.75775L22.2965 7.61463L22.0095 7.90168ZM22.5836 7.32758L22.7267 7.4707L23.0137 7.18365L22.8706 7.04053L22.5836 7.32758ZM23.1577 6.75347L23.3008 6.89659L23.5878 6.60954L23.4447 6.46642L23.1577 6.75347ZM23.7318 6.17937L23.8749 6.32249L24.1619 6.03544L24.0188 5.89232L23.7318 6.17937ZM24.3059 5.60527L24.449 5.74839L24.736 5.46134L24.5929 5.31822L24.3059 5.60527ZM24.88 5.03116L25.0231 5.17428L25.3101 4.88723L25.167 4.74411L24.88 5.03116ZM25.4541 4.45706L25.5972 4.60018L25.8842 4.31313L25.7411 4.17001L25.4541 4.45706ZM26.0282 3.88295L26.1713 4.02607L26.4583 3.73902L26.3152 3.5959L26.0282 3.88295ZM26.6023 3.30885L26.7454 3.45197L27.0325 3.16492L26.8893 3.0218L26.6023 3.30885ZM27.1764 2.73475L27.3195 2.87787L27.6066 2.59082L27.4634 2.4477L27.1764 2.73475ZM27.7505 2.16064L27.8936 2.30376L28.1807 2.01671L28.0375 1.87359L27.7505 2.16064ZM28.3246 1.58654L28.4677 1.72966L28.7548 1.44261L28.6116 1.29949L28.3246 1.58654ZM28.8987 1.01244L29.0418 1.15556L29.0422 1.15515L29.0434 1.15632L29.1865 1.0132L29.0422 0.868912L28.8987 1.01244ZM29.4751 1.30181L29.332 1.44493L29.6206 1.73355L29.7637 1.59043L29.4751 1.30181ZM30.0524 1.87904L29.9092 2.02216L30.1978 2.31078L30.341 2.16766L30.0524 1.87904ZM30.6296 2.45627L30.4865 2.59939L30.7751 2.88801L30.9182 2.74489L30.6296 2.45627ZM31.2068 3.0335L31.0637 3.17662L31.3523 3.46524L31.4954 3.32212L31.2068 3.0335ZM31.784 3.61074L31.6409 3.75385L31.9295 4.04247L32.0727 3.89935L31.784 3.61074ZM32.3613 4.18797L32.2182 4.33109L32.5068 4.6197L32.6499 4.47658L32.3613 4.18797ZM32.9385 4.7652L32.7954 4.90832L33.084 5.19693L33.2271 5.05381L32.9385 4.7652ZM33.5157 5.34243L33.3726 5.48555L33.6612 5.77416L33.8044 5.63104L33.5157 5.34243ZM34.093 5.91966L33.9499 6.06278L34.2385 6.35139L34.3816 6.20827L34.093 5.91966ZM34.6702 6.49689L34.5271 6.64001L34.8157 6.92863L34.9588 6.78551L34.6702 6.49689ZM35.2474 7.07412L35.1043 7.21724L35.3929 7.50585L35.536 7.36274L35.2474 7.07412ZM35.8247 7.65135L35.6815 7.79447L35.9702 8.08309L36.1133 7.93997L35.8247 7.65135ZM36.4019 8.22858L36.2588 8.3717L36.5474 8.66032L36.6905 8.5172L36.4019 8.22858ZM36.9791 8.80581L36.836 8.94893L37.1246 9.23755L37.2677 9.09443L36.9791 8.80581ZM37.5564 9.38304L37.4132 9.52616L37.7019 9.81478L37.845 9.67166L37.5564 9.38304ZM38.1336 9.96027L37.9905 10.1034L38.2791 10.392L38.4222 10.2489L38.1336 9.96027ZM38.7108 10.5375L38.5677 10.6806L38.8563 10.9692L38.9994 10.8261L38.7108 10.5375ZM39.288 11.1147L39.1449 11.2579L39.4335 11.5465L39.5767 11.4034L39.288 11.1147ZM39.8653 11.692L39.7222 11.8351L40.0108 12.1237L40.1539 11.9806L39.8653 11.692ZM40.4425 12.2692L40.2994 12.4123L40.588 12.7009L40.7311 12.5578L40.4425 12.2692ZM41.0197 12.8464L40.8766 12.9895L41.1652 13.2782L41.3084 13.135L41.0197 12.8464ZM41.597 13.4237L41.4538 13.5668L41.7425 13.8554L41.8856 13.7123L41.597 13.4237ZM42.1742 14.0009L42.0311 14.144L42.3197 14.4326L42.4628 14.2895L42.1742 14.0009ZM42.7514 14.5781L42.6083 14.7212L42.8969 15.0099L43.04 14.8667L42.7514 14.5781ZM43.3287 15.1554L43.1855 15.2985L43.4742 15.5871L43.6173 15.444L43.3287 15.1554ZM43.9059 15.7326L43.7628 15.8757L44.0514 16.1643L44.1945 16.0212L43.9059 15.7326ZM44.4831 16.3098L44.34 16.4529L44.6286 16.7415L44.7717 16.5984L44.4831 16.3098ZM45.0604 16.887L44.9172 17.0302L45.2059 17.3188L45.349 17.1757L45.0604 16.887ZM45.6376 17.4643L45.4945 17.6074L45.7831 17.896L45.9262 17.7529L45.6376 17.4643ZM46.2148 18.0415L46.0717 18.1846L46.3603 18.4732L46.5034 18.3301L46.2148 18.0415ZM46.792 18.6187L46.6489 18.7619L46.9375 19.0505L47.0807 18.9074L46.792 18.6187ZM47.3693 19.196L47.2262 19.3391L47.5148 19.6277L47.6579 19.4846L47.3693 19.196ZM47.9465 19.7732L47.8034 19.9163L48.092 20.2049L48.2351 20.0618L47.9465 19.7732ZM48.5237 20.3504L48.3806 20.4935L48.6692 20.7822L48.8124 20.639L48.5237 20.3504ZM49.101 20.9277L48.9578 21.0708L49.2465 21.3594L49.3896 21.2163L49.101 20.9277ZM49.6782 21.5049L49.5351 21.648L49.8237 21.9366L49.9668 21.7935L49.6782 21.5049ZM50.2554 22.0821L50.1123 22.2252L50.4009 22.5138L50.544 22.3707L50.2554 22.0821ZM50.8327 22.6593L50.6895 22.8025L50.9782 23.0911L51.1213 22.948L50.8327 22.6593ZM51.4099 23.2366L51.2668 23.3797L51.5554 23.6683L51.6985 23.5252L51.4099 23.2366ZM51.9871 23.8138L51.844 23.9569L52.1326 24.2455L52.2757 24.1024L51.9871 23.8138ZM52.5643 24.391L52.4212 24.5342L52.7098 24.8228L52.853 24.6797L52.5643 24.391ZM53.1416 24.9683L52.9985 25.1114L53.2871 25.4L53.4302 25.2569L53.1416 24.9683ZM53.7188 25.5455L53.5757 25.6886L53.8643 25.9772L54.0074 25.8341L53.7188 25.5455ZM54.296 26.1227L54.1529 26.2658L54.4415 26.5545L54.5846 26.4113L54.296 26.1227ZM54.8733 26.7L54.7301 26.8431L55.0188 27.1317L55.1619 26.9886L54.8733 26.7ZM55.4505 27.2772L55.3074 27.4203L55.596 27.7089L55.7391 27.5658L55.4505 27.2772ZM56.0277 27.8544L55.8846 27.9975L56.1732 28.2861L56.3163 28.143L56.0277 27.8544ZM56.605 28.4316L56.4618 28.5748L56.7504 28.8634L56.8936 28.7203L56.605 28.4316ZM57.1822 29.0089L57.0391 29.152L57.0403 29.1532L57.0398 29.1536L57.183 29.2967L57.3265 29.1532L57.1822 29.0089ZM56.8959 29.5838L56.7528 29.4406L56.4657 29.7277L56.6089 29.8708L56.8959 29.5838ZM56.3218 30.1579L56.1787 30.0148L55.8916 30.3018L56.0348 30.4449L56.3218 30.1579ZM55.7477 30.732L55.6046 30.5889L55.3175 30.8759L55.4606 31.019L55.7477 30.732ZM55.1736 31.3061L55.0305 31.163L54.7434 31.45L54.8865 31.5931L55.1736 31.3061ZM54.5995 31.8802L54.4564 31.7371L54.1693 32.0241L54.3124 32.1672L54.5995 31.8802ZM54.0254 32.4543L53.8823 32.3112L53.5952 32.5982L53.7383 32.7413L54.0254 32.4543ZM53.4513 33.0284L53.3082 32.8853L53.0211 33.1723L53.1642 33.3154L53.4513 33.0284ZM52.8772 33.6025L52.7341 33.4594L52.447 33.7464L52.5901 33.8895L52.8772 33.6025ZM52.3031 34.1766L52.16 34.0335L51.8729 34.3205L52.016 34.4637L52.3031 34.1766ZM51.729 34.7507L51.5859 34.6076L51.2988 34.8946L51.4419 35.0378L51.729 34.7507ZM51.1549 35.3248L51.0117 35.1817L50.7247 35.4687L50.8678 35.6119L51.1549 35.3248ZM50.5808 35.8989L50.4376 35.7558L50.1506 36.0428L50.2937 36.186L50.5808 35.8989ZM50.0067 36.473L49.8635 36.3299L49.5765 36.6169L49.7196 36.7601L50.0067 36.473ZM49.4326 37.0471L49.2894 36.904L49.0024 37.191L49.1455 37.3342L49.4326 37.0471ZM48.8585 37.6212L48.7153 37.4781L48.4283 37.7651L48.5714 37.9083L48.8585 37.6212ZM48.2844 38.1953L48.1412 38.0522L47.8542 38.3393L47.9973 38.4824L48.2844 38.1953ZM47.7102 38.7694L47.5671 38.6263L47.2801 38.9134L47.4232 39.0565L47.7102 38.7694ZM47.1361 39.3435L46.993 39.2004L46.706 39.4875L46.8491 39.6306L47.1361 39.3435ZM46.562 39.9176L46.4189 39.7745L46.1319 40.0616L46.275 40.2047L46.562 39.9176ZM45.9879 40.4917L45.8448 40.3486L45.5578 40.6357L45.7009 40.7788L45.9879 40.4917ZM45.4138 41.0658L45.2707 40.9227L44.9837 41.2098L45.1268 41.3529L45.4138 41.0658ZM44.8397 41.6399L44.6966 41.4968L44.4096 41.7839L44.5527 41.927L44.8397 41.6399ZM44.2656 42.2141L44.1225 42.0709L43.8355 42.358L43.9786 42.5011L44.2656 42.2141ZM43.6915 42.7882L43.5484 42.645L43.2613 42.9321L43.4045 43.0752L43.6915 42.7882ZM43.1174 43.3623L42.9743 43.2191L42.6872 43.5062L42.8304 43.6493L43.1174 43.3623ZM42.5433 43.9364L42.4002 43.7932L42.1131 44.0803L42.2563 44.2234L42.5433 43.9364ZM41.9692 44.5105L41.8261 44.3673L41.539 44.6544L41.6822 44.7975L41.9692 44.5105ZM41.3951 45.0846L41.252 44.9414L40.9649 45.2285L41.1081 45.3716L41.3951 45.0846ZM40.821 45.6587L40.6779 45.5155L40.3908 45.8026L40.534 45.9457L40.821 45.6587ZM40.2469 46.2328L40.1038 46.0897L39.8167 46.3767L39.9598 46.5198L40.2469 46.2328ZM39.6728 46.8069L39.5297 46.6638L39.2426 46.9508L39.3857 47.0939L39.6728 46.8069ZM39.0987 47.381L38.9556 47.2379L38.6685 47.5249L38.8116 47.668L39.0987 47.381ZM38.5246 47.9551L38.3815 47.812L38.0944 48.099L38.2375 48.2421L38.5246 47.9551ZM37.9505 48.5292L37.8074 48.3861L37.5203 48.6731L37.6634 48.8162L37.9505 48.5292ZM37.3764 49.1033L37.2333 48.9602L36.9462 49.2472L37.0893 49.3903L37.3764 49.1033ZM36.8023 49.6774L36.6592 49.5343L36.3721 49.8213L36.5152 49.9644L36.8023 49.6774ZM36.2282 50.2515L36.0851 50.1084L35.798 50.3954L35.9411 50.5386L36.2282 50.2515ZM35.6541 50.8256L35.5109 50.6825L35.2239 50.9695L35.367 51.1127L35.6541 50.8256ZM35.08 51.3997L34.9368 51.2566L34.6498 51.5436L34.7929 51.6868L35.08 51.3997ZM34.5059 51.9738L34.3627 51.8307L34.0757 52.1177L34.2188 52.2609L34.5059 51.9738ZM33.9318 52.5479L33.7886 52.4048L33.5016 52.6918L33.6447 52.835L33.9318 52.5479ZM33.3577 53.122L33.2145 52.9789L32.9275 53.2659L33.0706 53.4091L33.3577 53.122ZM32.7836 53.6961L32.6404 53.553L32.3534 53.8401L32.4965 53.9832L32.7836 53.6961ZM32.2094 54.2702L32.0663 54.1271L31.7793 54.4142L31.9224 54.5573L32.2094 54.2702ZM31.6353 54.8443L31.4922 54.7012L31.2052 54.9883L31.3483 55.1314L31.6353 54.8443ZM31.0612 55.4184L30.9181 55.2753L30.6311 55.5624L30.7742 55.7055L31.0612 55.4184ZM30.4871 55.9925L30.344 55.8494L30.057 56.1365L30.2001 56.2796L30.4871 55.9925ZM29.913 56.5666L29.7699 56.4235L29.4829 56.7106L29.626 56.8537L29.913 56.5666ZM29.3389 57.1407L29.1958 56.9976L29.1954 56.998L29.1942 56.9969L29.0511 57.14L29.1954 57.2843L29.3389 57.1407ZM28.7625 56.8514L28.9056 56.7082L28.617 56.4196L28.4739 56.5628L28.7625 56.8514ZM28.1853 56.2741L28.3284 56.131L28.0398 55.8424L27.8967 55.9855L28.1853 56.2741ZM27.608 55.6969L27.7512 55.5538L27.4625 55.2652L27.3194 55.4083L27.608 55.6969ZM27.0308 55.1197L27.1739 54.9766L26.8853 54.6879L26.7422 54.8311L27.0308 55.1197ZM26.4536 54.5424L26.5967 54.3993L26.3081 54.1107L26.165 54.2538L26.4536 54.5424ZM25.8763 53.9652L26.0195 53.8221L25.7309 53.5335L25.5877 53.6766L25.8763 53.9652ZM25.2991 53.388L25.4422 53.2449L25.1536 52.9562L25.0105 53.0994L25.2991 53.388ZM24.7219 52.8108L24.865 52.6676L24.5764 52.379L24.4333 52.5221L24.7219 52.8108ZM24.1447 52.2335L24.2878 52.0904L23.9992 51.8018L23.856 51.9449L24.1447 52.2335ZM23.5674 51.6563L23.7105 51.5132L23.4219 51.2246L23.2788 51.3677L23.5674 51.6563ZM22.9902 51.0791L23.1333 50.9359L22.8447 50.6473L22.7016 50.7904L22.9902 51.0791ZM22.413 50.5018L22.5561 50.3587L22.2675 50.0701L22.1243 50.2132L22.413 50.5018ZM21.8357 49.9246L21.9789 49.7815L21.6902 49.4929L21.5471 49.636L21.8357 49.9246ZM21.2585 49.3474L21.4016 49.2042L21.113 48.9156L20.9699 49.0588L21.2585 49.3474ZM20.6813 48.7701L20.8244 48.627L20.5358 48.3384L20.3927 48.4815L20.6813 48.7701ZM20.104 48.1929L20.2472 48.0498L19.9585 47.7612L19.8154 47.9043L20.104 48.1929ZM19.5268 47.6157L19.6699 47.4726L19.3813 47.1839L19.2382 47.3271L19.5268 47.6157ZM18.9496 47.0384L19.0927 46.8953L18.8041 46.6067L18.661 46.7498L18.9496 47.0384ZM18.3723 46.4612L18.5155 46.3181L18.2269 46.0295L18.0837 46.1726L18.3723 46.4612ZM17.7951 45.884L17.9382 45.7409L17.6496 45.4523L17.5065 45.5954L17.7951 45.884ZM17.2179 45.3068L17.361 45.1636L17.0724 44.875L16.9293 45.0181L17.2179 45.3068ZM16.6407 44.7295L16.7838 44.5864L16.4952 44.2978L16.352 44.4409L16.6407 44.7295ZM16.0634 44.1523L16.2065 44.0092L15.9179 43.7206L15.7748 43.8637L16.0634 44.1523ZM15.4862 43.5751L15.6293 43.4319L15.3407 43.1433L15.1976 43.2864L15.4862 43.5751ZM14.909 42.9978L15.0521 42.8547L14.7635 42.5661L14.6203 42.7092L14.909 42.9978ZM14.3317 42.4206L14.4749 42.2775L14.1862 41.9889L14.0431 42.132L14.3317 42.4206ZM13.7545 41.8434L13.8976 41.7002L13.609 41.4116L13.4659 41.5548L13.7545 41.8434ZM13.1773 41.2661L13.3204 41.123L13.0318 40.8344L12.8887 40.9775L13.1773 41.2661ZM12.6 40.6889L12.7432 40.5458L12.4545 40.2572L12.3114 40.4003L12.6 40.6889ZM12.0228 40.1117L12.1659 39.9686L11.8773 39.6799L11.7342 39.8231L12.0228 40.1117ZM11.4456 39.5344L11.5887 39.3913L11.3001 39.1027L11.157 39.2458L11.4456 39.5344ZM10.8683 38.9572L11.0115 38.8141L10.7229 38.5255L10.5797 38.6686L10.8683 38.9572ZM10.2911 38.38L10.4342 38.2369L10.1456 37.9482L10.0025 38.0914L10.2911 38.38ZM9.71389 37.8028L9.85701 37.6596L9.56839 37.371L9.42527 37.5141L9.71389 37.8028ZM9.13666 37.2255L9.27978 37.0824L8.99116 36.7938L8.84804 36.9369L9.13666 37.2255ZM8.55943 36.6483L8.70255 36.5052L8.41393 36.2166L8.27081 36.3597L8.55943 36.6483ZM7.9822 36.0711L8.12532 35.9279L7.8367 35.6393L7.69358 35.7825L7.9822 36.0711ZM7.40497 35.4938L7.54809 35.3507L7.25947 35.0621L7.11635 35.2052L7.40497 35.4938ZM6.82774 34.9166L6.97086 34.7735L6.68224 34.4849L6.53912 34.628L6.82774 34.9166ZM6.25051 34.3394L6.39363 34.1963L6.10501 33.9076L5.96189 34.0508L6.25051 34.3394ZM5.67328 33.7621L5.8164 33.619L5.52778 33.3304L5.38466 33.4735L5.67328 33.7621ZM5.09605 33.1849L5.23917 33.0418L4.95055 32.7532L4.80743 32.8963L5.09605 33.1849ZM4.51882 32.6077L4.66194 32.4646L4.37332 32.176L4.23021 32.3191L4.51882 32.6077ZM3.94159 32.0305L4.08471 31.8873L3.79609 31.5987L3.65298 31.7418L3.94159 32.0305ZM3.36436 31.4532L3.50748 31.3101L3.21886 31.0215L3.07575 31.1646L3.36436 31.4532ZM2.78713 30.876L2.93025 30.7329L2.64163 30.4443L2.49852 30.5874L2.78713 30.876ZM2.2099 30.2988L2.35302 30.1556L2.0644 29.867L1.92129 30.0102L2.2099 30.2988ZM1.63267 29.7215L1.77579 29.5784L1.48718 29.2898L1.34406 29.4329L1.63267 29.7215Z"
        fill="#E5E5E5"
      />
    </svg>
  );
}

DotRectangle.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 58 / 58,
  svg: DotRectangle,
  title,
};
