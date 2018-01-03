<template>
  <v-container fluid>
    <v-layout row justify-center>
      <v-flex xs12 sm3>
        <v-layout hidden-xs-only style="height: 800px;" column justify-center>
          <v-card style="padding: 20px">
            <v-layout column>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field name="username" label="用户名" v-model="user.username" :rules="nameRules" :counter="10" required></v-text-field>
                <v-text-field type="password" name="password" ref="password-pc" label="密码" v-model="user.password" required
                              :rules="passwordRules"
                              :append-icon="eyeOn ? 'visibility_off' : 'visibility'"
                              :append-icon-cb="()=>(eyeOn = !eyeOn)"
                              :type="eyeOn ? 'text' : 'password'"></v-text-field>
                <v-select
                  label="用户类型"
                  v-model="select"
                  :items="items"
                  :rules="[v => !!v || '请输入用户类型']"
                  required
                ></v-select>
                <input type="hidden" name="_csrf" v-model="csrf"/>

                <v-layout column>
                  <v-btn @click="submit" class="primary" :disabled="!valid">登录</v-btn>
                </v-layout>

              </v-form>

            </v-layout>
          </v-card>
        </v-layout>

        <v-layout hidden-sm-and-up  column justify-center>
          <v-layout column>
            <v-form action="uaa/login" method="post">
              <v-text-field name="username" label="账号" v-model="user.username"/>
              <v-text-field type="password" name="password" ref="password-mobile" label="密码" v-model="user.password"
                            :rules="[() => !loginError || ('登录失败，请尝试\'忘记密码\'')]"
                            :error="loginError"
                            :append-icon="eyeOn ? 'visibility_off' : 'visibility'"
                            :append-icon-cb="()=>(eyeOn = !eyeOn)"
                            :type="eyeOn ? 'text' : 'password'"
              />
              <input type="hidden" name="_csrf" v-model="csrf"/>

              <v-layout column>
                <v-btn type="submit" class="primary">登录</v-btn>
                <v-layout row justify-space-around>
                  <router-link to="/register" class="primary--text">注册</router-link>
                  <router-link to="/forget">忘记密码</router-link>
                </v-layout>
              </v-layout>

            </v-form>

          </v-layout>
        </v-layout>

      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import { mapActions } from 'vuex'
  import * as messageAction from '../store/message/action-types'
  export default {
    data () {
      return {
        valid: true,
        user: {
          username: '',
          password: ''
        },
        nameRules: [
          (v) => !!v || '请输入用户名',
          (v) => v && v.length <= 10 || '用户名不得超过10位'
        ],
        passwordRules: [
          (v) => !!v || '请输入密码',
          (v) => v && v.length >= 1 || '密码需要至少1位'
        ],
        select: null,
        items: [
          'customer',
          'merchant',
          'administrator'
        ],
        eyeOn: false,
        csrf: ''
      }
    },
    methods: {
      ...mapActions({
        showSnackBar: messageAction.SHOW_SNACK_BAR,
        login: 'login'
      }),
      submit () {
        if (this.$refs.form.validate()) {
          this.login({
            username: this.user.username,
            password: this.user.password,
            role: this.select
          }).then((res) => {
            this.$router.push({name: 'main'})
          }, (err) => {
            this.showSnackBar({
              text: err,
              context: 'error',
              show: true
            })
          })
        }
      }
    }
  }
</script>
