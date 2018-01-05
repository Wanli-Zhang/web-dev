<template>
  <div>
    <div class="text-xs-center">
      <v-edit-dialog
        @open="nameTemp=name"
        @save="editName(nameTemp)"
        large
        lazy>
        <v-tooltip top>
          <v-btn icon slot="activator">
            <v-icon class="grey--text">person</v-icon>
          </v-btn>
          <span> 名称 </span>
        </v-tooltip>
        <div slot="input" class="mt-4 title">名称</div>
        <v-text-field
          slot="input"
          label="name"
          v-model="nameTemp"
          single-line
          autofocus>
        </v-text-field>
      </v-edit-dialog>
      <span class="mr-5"> {{name}} </span>

      <v-tooltip top>
        <v-btn icon slot="activator">
          <v-icon class="grey--text">grade</v-icon>
        </v-btn>
        <span> 等级 </span>
      </v-tooltip>
      <span class="mr-5"> {{toLevel()}} </span>

      <v-edit-dialog
        @open="phoneTemp=phone"
        @save="editPhone(phoneTemp)"
        large
        lazy>
        <v-tooltip top>
          <v-btn icon slot="activator">
            <v-icon class="grey--text">phone</v-icon>
          </v-btn>
          <span> 电话号码 </span>
        </v-tooltip>
        <div slot="input" class="mt-4 title">电话号码</div>
        <v-text-field
          slot="input"
          label="phone"
          v-model="phoneTemp"
          single-line
          autofocus>
        </v-text-field>
      </v-edit-dialog>
      <span> {{phone}} </span>
      <br/>

      <v-edit-dialog
        v-if="role==='customer'"
        @open="addressTemp=address"
        @save="editAddress(addressTemp)"
        large
        lazy>
        <v-tooltip top v-if="address">
          <v-btn icon slot="activator">
            <v-icon class="grey--text">location_on</v-icon>
          </v-btn>
          <span> 地址 </span>
        </v-tooltip>
        <div slot="input" class="mt-4 title">地址</div>
        <v-text-field
          slot="input"
          label="address"
          v-model="addressTemp"
          single-line
          autofocux>
        </v-text-field>
      </v-edit-dialog>
      <span class="mr-5" v-if="role==='customer'"> {{address}} </span>

      <v-edit-dialog
        v-if="role==='merchant'"
        @open="kindTemp=kind"
        @save="editKind(kindTemp)"
        large
        lazy>
        <v-tooltip top v-if="kind">
          <v-btn icon slot="activator">
            <v-icon class="grey--text">class</v-icon>
          </v-btn>
          <span> 商店种类 </span>
        </v-tooltip>
        <div slot="input" class="mt-4 title">商店种类</div>
        <v-text-field
          slot="input"
          label="kind"
          v-model="kindTemp"
          single-line
          autofocux>
        </v-text-field>
      </v-edit-dialog>
      <span class="mr-5" v-if="role==='merchant'"> {{kind}} </span>

      <v-tooltip top>
        <v-btn icon slot="activator">
          <v-icon class="grey--text">today</v-icon>
        </v-btn>
        <span> 创建时间 </span>
      </v-tooltip>
      <span> {{new Date(create_time).toLocaleString()}} </span>
      <br/>

      <v-btn class="primary">修改密码</v-btn>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import * as messageAction from '../store/message/action-types.js'
  export default {
    data () {
      return {
        name: 'zwl',
        level: 1,
        phone: 12345678901,
        address: 'fffffuck',
        create_time: new Date().getTime(),
        kind: 'fffff',
        role: 'merchant',
        nameTemp: '',
        phoneTemp: '',
        addressTemp: '',
        kindTemp: ''
      }
    },
    created () {
      if (this.role === 'administrator') {
        return
      }
      // this.name = this.profile.name
      // this.level = this.profile.level
      // this.phone = this.profile.phone
      // this.create_time = this.profile.create_time * 1000
      // if (this.role === 'customer') {
      //   this.address = this.profile.address
      // }
      // if (this.role === 'merchant') {
      //   this.kind = this.profile.kind
      // }
    },
    computed: {
      ...mapGetters({
        profile: 'getProfile',
        username: 'getUsername'
        // role: 'getRole'
      })
    },
    methods: {
      ...mapActions({
        showSnackBar: messageAction.SHOW_SNACK_BAR
      }),
      toLevel () {
        if (this.role === 'customer') {
          if (this.level === 0) {
            return '普通客户'
          } else if (this.level === 1) {
            return '大客户'
          } else {
            return '钻石客户'
          }
        }
        if (this.role === 'merchant') {
          if (this.level === 0) {
            return '小商店'
          } else if (this.level === 1) {
            return '普通商店'
          } else {
            return '旗舰商店'
          }
        }
      },
      editName (name) {
        this.axios.put(`/${this.role}/${this.username}`, {
          name: name
        }).then((res) => {
          if (res.data.err_code === 0) {
            this.name = name
            this.showSnackBar({
              text: '修改成功',
              context: 'success',
              show: true
            })
          } else {
            this.showSnackBar({
              text: res.data.err_msg,
              context: 'error',
              show: true
            })
          }
        }, () => {
          this.showSnackBar({
            text: '修改失败，请重试',
            context: 'error',
            show: true
          })
        })
      },
      editPhone (phone) {
        this.axios.put(`/${this.role}/${this.username}`, {
          phone: phone
        }).then((res) => {
          if (res.data.err_code === 0) {
            this.phone = phone
            this.showSnackBar({
              text: '修改成功',
              context: 'success',
              show: true
            })
          } else {
            this.showSnackBar({
              text: res.data.err_msg,
              context: 'error',
              show: true
            })
          }
        }, () => {
          this.showSnackBar({
            text: '修改失败，请重试',
            context: 'error',
            show: true
          })
        })
      },
      editAddress (address) {
        this.axios.put(`/${this.role}/${this.username}`, {
          address: address
        }).then((res) => {
          if (res.data.err_code === 0) {
            this.address = address
            this.showSnackBar({
              text: '修改成功',
              context: 'success',
              show: true
            })
          } else {
            this.showSnackBar({
              text: res.data.err_msg,
              context: 'error',
              show: true
            })
          }
        }, () => {
          this.showSnackBar({
            text: '修改失败，请重试',
            context: 'error',
            show: true
          })
        })
      },
      editKind (kind) {
        this.axios.put(`/${this.role}/${this.username}`, {
          kind: kind
        }).then((res) => {
          if (res.data.err_code === 0) {
            this.kind = kind
            this.showSnackBar({
              text: '修改成功',
              context: 'success',
              show: true
            })
          } else {
            this.showSnackBar({
              text: res.data.err_msg,
              context: 'error',
              show: true
            })
          }
        }, () => {
          this.showSnackBar({
            text: '修改失败，请重试',
            context: 'error',
            show: true
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
