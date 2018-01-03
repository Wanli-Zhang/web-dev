<template>
  <v-app light>
    <v-snackbar
      :timeout="1000"
      :top="true"
      :success="snackBar.context === 'success'"
      :error="snackBar.context === 'error'"
      :info="snackBar.context === 'info'"
      :warning="snackBar.context === 'warning'"
      v-model="snackBar.show">
      {{ snackBar.text }}
      <v-btn dark flat @click.native="snackBar.show = false">关闭</v-btn>
    </v-snackbar>
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
