<template>
  <v-app light>
    <v-navigation-drawer :mini-variant="mini"
                         absolute
                         persistent
                         clipped
                         app
                         v-model="drawer"
                         enable-resize-watcher>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar tag="div">
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>flip</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list dense>
        <template v-for="(item, i) in items"
                  v-if="item.visible">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="i"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group v-else-if="item.children" v-model="item.model" no-action>
            <v-list-tile slot="item" @click="">
              <v-list-tile-action>
                <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              @click=""
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :href="item.href">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>

    </v-navigation-drawer>

    <v-toolbar class="indigo darken-4"
               dark
               app
               clipped-left
               fixed>
      <v-toolbar-title style="width: 240px; cursor:pointer" class="ml-0 pl-3" @click="goIndex">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        web development
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-toolbar-title style="cursor:pointer" @click="LogOut">退出登录</v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-snackbar
          :timeout="1000"
          :top="true"
          :success="snackBar.context === 'success'"
          :error="snackBar.context === 'error'"
          v-model="snackBar.show">
          {{ snackBar.text }}
          <v-btn dark flat @click.native="snackBar.show = false">关闭</v-btn>
        </v-snackbar>
        <router-view></router-view>
      </v-container>
    </v-content>

  </v-app>
</template>


<script>
  import { mapGetters, mapActions } from 'vuex'
  import * as messageAction from '../store/message/action-types.js'
  export default {
    data () {
      return {
        drawer: true,
        items: [
          {text: '我的信息', icon: 'person', href: '#/myInfo', visible: true},
          {text: '商家列表', icon: 'shopping_cart', href: '#/merchants', visible: true},
          {text: '客户列表', icon: 'people', href: '#/customers', visible: true}
        ],
        mini: true
      }
    },
    created () {
      // if (!this.isAuthenticated) {
      //   this.$router.push({name: 'login'})
      // }
    },
    computed: {
      ...mapGetters({
        profile: 'getProfile',
        isAuthenticated: 'getAuthenticated',
        snackBar: 'snackBar'
      })
    },
    methods: {
      ...mapActions({
        showSnackBar: messageAction.SHOW_SNACK_BAR,
        logout: 'logout'
      }),
      goIndex () {
        this.$router.push({name: 'Main'})
      },
      LogOut () {
        this.logout()
        this.$router.push({name: 'login'})
      }
    }
  }
</script>

