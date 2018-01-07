<template>
  <v-container fluid>
    <v-layout row justify-center>
      <v-flex xs12 sm3>
        <v-layout style="height: 800px;" column justify-center>
          <v-card style="padding: 20px">
            <v-layout column>
              <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field name="username" label="用户名"
                              v-model="user.username"
                              :rules="nameRules"
                              :counter="20" required></v-text-field>
                <v-text-field type="password" name="password"
                              ref="password-pc" label="密码"
                              v-model="user.password" required
                              :rules="passwordRules"
                              :append-icon="eyeOn ? 'visibility_off' : 'visibility'"
                              :append-icon-cb="()=>(eyeOn = !eyeOn)"
                              :type="eyeOn ? 'text' : 'password'"></v-text-field>
                <v-select
                  label="用户类型"
                  v-model="select"
                  :items="items"
                  item-text="text"
                  item-value="value"
                  :rules="[v => !!v || '请输入用户类型']"
                  required
                ></v-select>
                <input type="hidden" name="_csrf" v-model="csrf"/>
                <v-layout column>
                  <v-btn @click="submit" class="primary">登录</v-btn>
                </v-layout>
              </v-form>
            </v-layout>
          </v-card>
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
          (v) => v && v.length <= 20 || '用户名不得超过20位'
        ],
        passwordRules: [
          (v) => !!v || '请输入密码',
          (v) => v && v.length >= 8 || '密码不得少于8位'
        ],
        select: null,
        items: [
          { text: '客户', value: 'customer' },
          { text: '商家', value: 'merchant' },
          { text: '管理员', value: 'administrator' }
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
          }).then(() => {
            this.$router.push({name: 'Main'})
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
