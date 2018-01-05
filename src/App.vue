<template>
  <v-app light>
    <router-view>
    </router-view>
  </v-app>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'App',
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['snackBar'])
    }
  }
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
