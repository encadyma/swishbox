<template>
  <div id="app-home">
    <main>
      <img src="../assets/logo.png" height="300"/>
      <h2>Welcome to Swishbox</h2>
      <i>version {{version}}</i><br>
      <button class="swish-button-border" style="margin: 10px 0;" @click="openFeedback()">Send Feedback</button>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'home-page',
    data() {
      return {
        version: process.env.SWISHBOX_VERSION,
      };
    },
    methods: {
      openFeedback() {
        this.$electron.shell.openExternal('https://github.com/encadyma/swishbox/issues');
      }
    }
  };
</script>

<style>
#app-home {
  padding: 20vh 20vw;
  text-align: center;
  line-height: 1.5;
}
</style>
