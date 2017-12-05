import axios from 'axios';

// Sample JSON Response
const sampleResponse = require('./sample-response');
const API_CONFIG = require('./secrets');

const sampleVideos = [
  { id: 'LfephiFN76E', title: '[MV] REOL - No title', description: 'Music&Lyrics,Vocal : Reol\nTrack&Chorus : Giga\nMovie&Chorus : Okiku', author: { name: 'REOL Official', id: 'UCB6pJFaFByws3dQj4AdLdyA' }, views: 17347735, thumbnails: { medium: { url: 'https://i.ytimg.com/vi/wN5Gi2T22mI/mqdefault.jpg' } } },
  { id: 'G_QsSS4DwoY', title: '☆東方 Piano / Instrumental☆ 東方妖怪小町 [logical emotion]', description: '☆ Title: 東方妖怪小町 ☆ Original song: 東方妖怪小町 / Eastern Youkai Beauty ☆ Piano: marasy ☆ Bass: drm ☆ Drums: tabclear ☆ Circle: logical emotion ☆ Album: Touhou Project pops arranged instruments2 ☆ Event: 例大祭9 / Reitaisai 9 ☆ Illustration link: http://www.pixiv.net/member_illust.ph...', author: { name: 'The Doughnut-Loving Vampire', id: 'UCg9gCVVsXqOh7iQoHI0ZeUA' }, views: 7210, thumbnails: { medium: { url: 'https://i.ytimg.com/vi/wN5Gi2T22mI/mqdefault.jpg' } } },
  { id: 'Kkgp1-fHn6Y', title: 'Tatsh - "IMAGE -MATERIAL- (Version 0)"', description: '老科最近發行一個作曲家Tatsh專輯 裡面的曲子都很好聽 尤其是這首"IMAGE -MATERIAL- (Version 0)" 我非常的愛 曲風非常搖滾,中間緩歇處還可以聽到柔柔的小提琴聲 和搖滾搭配起來還蠻另類的 專輯封面還是敘事詩大師MAYA的手繪稿 MAYA大師最愛慣用畫法"圖地反轉"的畫風~非常的適合收藏 好久沒用Premiere製作編輯影片了.....稍稍修圖後~嘿嘿! 沒事無聊~把文字也跟了音樂節奏對拍~哈 (發現youtube上傳後變成沒對拍....) 一起欣賞這個好作品吧!!', author: { name: 'Trance5368', id: 'UC5V26sPlYa581ZHbQQ-y8rg' }, views: 1009624, thumbnails: { medium: { url: 'https://i.ytimg.com/vi/wN5Gi2T22mI/mqdefault.jpg' } } },
];

// Adapted from Fisher-Yates Shuffle Answer
// Take a random element and placing it at the end
const shuffleArray = (arr) => {
  let count = arr.length;

  while (count > 0) {
    const index = Math.floor(Math.random() * count);
    // Decrease here from [arr.length - 1] to [0].
    count -= 1;

    // Swap last element with the selected element
    const temp = arr[index];
    arr[index] = arr[count];
    arr[count] = temp;
  }

  return arr;
};

const getVideosWithQuery = (query) => {
  const API_ENDPOINT = `${API_CONFIG.SWISHBOX_ENDPOINT}/search`;

  return axios.get(API_ENDPOINT, { params: { mode: 'search', q: query } })
    .then(response => response.data.results);
};

const getVideosInSimulated = () => {
  const SIMULATED_TIME = Math.round(Math.random() * 1000) + 500;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(shuffleArray(sampleResponse.results));
    }, SIMULATED_TIME);
  });
};

const getSearchSuggestions = (query) => {
  const sampleSuggestions = [
    { type: 'text', title: '', subtitle: 'Featured', helptext: 'You and many other users like this', genre: 'General' },
    { type: 'text', title: ' music', subtitle: 'Featured', helptext: 'A general search term for keywords', genre: 'General' },
    { type: 'text', title: ' playlist', helptext: 'Recommended for longer music excursions', genre: 'General' },
    { type: 'text', title: ' remixes', genre: 'General' },
    { type: 'text', title: ' for studying', genre: 'General' },
    { type: 'text', title: ' video', genre: 'General' }
  ];

  return new Promise((resolve) => {
    resolve(sampleSuggestions.map((r) => {
      const res = { ...r };
      res.title = query + r.title;
      return res;
    }));
  });
};

export default {
  getSearchSuggestions,
  getVideosWithQuery,
  getVideosInSimulated,
  sampleVideos
};
