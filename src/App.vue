<template>
  <div id="app">
    <p> Hello</p>
    <v-main-wrapper />
  </div>
</template>

<script>
import vMainWrapper from './components/v-main-wrapper.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'App',
  components: {
    vMainWrapper
  },
  computed: {
    ...mapGetters([
      'IS_MOBILE',
      'IS_DESKTOP'
    ])
  },

  methods: {
    ...mapActions ([
      'SET_MOBILE',
      'SET_DESKTOP',
    ])
  },
  mounted() {
    let vm= this;
    window.addEventListener('resize', function() {
      if (window.innerWidth > 767) {
        vm.SET_DESKTOP();
      } else {
        vm.SET_MOBILE();
      }
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
