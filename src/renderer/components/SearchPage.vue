<template>
  <div id="app-search-results">
    <div id="app-search-results-head">
      <h1 class="swish-head-betitle" style="display: inline-block;">{{$route.query.q}}</h1>
      <span class="swish-text-subtitle">{{results.length}} results</span>
    </div>
    <div id="app-search-results-body">
      <div v-for="result of results" :key="result.id" style="margin: 5px 0;" @click="addSongToPlaylist(result)">
        <search-result :result="result"></search-result>
      </div>
    </div>
  </div>
</template>

<script>
  import SearchResult from './Search/SearchResult';

  export default {
    components: { SearchResult },
    data: function () {
      return {
        results: [
          { id: 'LfephiFN76E', title: '[MV] REOL - No title', description: 'Music&Lyrics,Vocal : Reol\nTrack&Chorus : Giga\nMovie&Chorus : Okiku', author: { name: 'REOL Official', id: 'UCB6pJFaFByws3dQj4AdLdyA' }, views: 17347735 },
          { id: 'G_QsSS4DwoY', title: '☆東方 Piano / Instrumental☆ 東方妖怪小町 [logical emotion]', description: '☆ Title: 東方妖怪小町 ☆ Original song: 東方妖怪小町 / Eastern Youkai Beauty ☆ Piano: marasy ☆ Bass: drm ☆ Drums: tabclear ☆ Circle: logical emotion ☆ Album: Touhou Project pops arranged instruments2 ☆ Event: 例大祭9 / Reitaisai 9 ☆ Illustration link: http://www.pixiv.net/member_illust.ph...', author: { name: 'The Doughnut-Loving Vampire', id: 'UCg9gCVVsXqOh7iQoHI0ZeUA' }, views: 7210 },
          { id: 'Kkgp1-fHn6Y', title: 'Tatsh - "IMAGE -MATERIAL- (Version 0)"', description: '老科最近發行一個作曲家Tatsh專輯 裡面的曲子都很好聽 尤其是這首"IMAGE -MATERIAL- (Version 0)" 我非常的愛 曲風非常搖滾,中間緩歇處還可以聽到柔柔的小提琴聲 和搖滾搭配起來還蠻另類的 專輯封面還是敘事詩大師MAYA的手繪稿 MAYA大師最愛慣用畫法"圖地反轉"的畫風~非常的適合收藏 好久沒用Premiere製作編輯影片了.....稍稍修圖後~嘿嘿! 沒事無聊~把文字也跟了音樂節奏對拍~哈 (發現youtube上傳後變成沒對拍....) 一起欣賞這個好作品吧!!', author: { name: 'Trance5368', id: 'UC5V26sPlYa581ZHbQQ-y8rg' }, views: 1009624 }
        ]
      };
    },
    methods: {
      addSongToPlaylist: function (song) {
        this.$store.dispatch('PLAYLIST_ADD_SONG', song);
        this.$notify({
          group: 'player',
          title: `${song.title}`,
          text: 'has been added to the playlist.'
        });
      }
    }
  };
</script>

<style lang="scss">
  #app-search-results-head {
    padding: 10px 40px;
    margin-top: 10px;

    & > * { display: inline-block; }
    .swish-text-subtitle { font-size: 1em; margin-left: 10px; }
  }

  #app-search-results-body {
    padding: 10px 40px;
    min-height: 100vh;
  }
</style>
