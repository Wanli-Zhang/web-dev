<template>
  <div>
    <div class="text-xs-left" v-if="role==='customer' || role ==='merchant'">
      <v-edit-dialog
        @open="nameTemp=name"
        @save="editName(nameTemp)"
        large lazy>
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
          single-line autofocus>
        </v-text-field>
      </v-edit-dialog>
      <span class="mr-5"> {{name}} </span>
      <br/>

      <v-tooltip top>
        <v-btn icon slot="activator">
          <v-icon class="grey--text">grade</v-icon>
        </v-btn>
        <span> 等级 </span>
      </v-tooltip>
      <span class="mr-5"> {{toLevel()}} </span>
      <br/>

      <v-edit-dialog
        @open="phoneTemp=phone"
        @save="editPhone(phoneTemp)"
        large lazy>
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
          single-line autofocus>
        </v-text-field>
      </v-edit-dialog>
      <span> {{phone}} </span>
      <br/>

      <div v-if="role==='customer'">
        <v-edit-dialog
          @open="addressTemp=address"
          @save="editAddress(addressTemp)"
          large lazy>
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
            single-line autofocux>
          </v-text-field>
        </v-edit-dialog>
        <span> {{address}} </span>
        <br/>
      </div>

      <div v-if="role==='merchant'">
        <v-tooltip top >
          <v-btn icon slot="activator">
            <v-icon class="grey--text">class</v-icon>
          </v-btn>
          <span> 商店种类 </span>
        </v-tooltip>
        <span> {{kind}} </span>
        <br/>
      </div>

      <v-tooltip top>
        <v-btn icon slot="activator">
          <v-icon class="grey--text">today</v-icon>
        </v-btn>
        <span> 创建时间 </span>
      </v-tooltip>
      <span> {{new Date(create_time).toLocaleString()}} </span>
      <br/>
    </div>

    <div v-if="role==='administrator'">
      <v-card-title>管理员列表</v-card-title>
      <v-data-table :headers="headers"
                    :items="admins"
                    :paginations.sync="pagination"
                    class="elevation-1">
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{props.item}}</td>
            <td>
              <v-btn flat block
                     @click="delAdmin(props.item)">
                <v-icon>delete</v-icon>
                删除
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
      <v-dialog v-model="newDialog" max-width="400px">
        <v-btn color="primary" outline slot="activator">
          <v-icon>add</v-icon>
          新增管理员
        </v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">新增管理员</span>
          </v-card-title>
          <v-card-text>
            <v-form v-model="newValid" ref="newForm" lazy-validation>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="用户名/username" required
                                  v-model="newUsername"
                                  :rules="usernameRules"></v-text-field>
                    <br/>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="密码/password" required
                                  v-model="newPassword1"
                                  :rules="passwordNewRules"></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="再次输入/password" required
                                  v-model="newPassword2"
                                  :rules="passwordNewRules"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn flat @click="newDialog=false" block>取消</v-btn>
            <v-btn flag color="primary" outline @click="newAdmin" block>确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-dialog v-model="editDialog" max-width="400px">
      <v-btn slot="activator" outline color="primary" block>
        <v-icon>edit</v-icon>修改密码
      </v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">修改密码</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="editValid" ref="editForm" lazy-validation>
            <v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="新密码" required
                                :rules="passwordEditRules"
                                v-model="editPassword1"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="再次输入" required
                                :rules="passwordEditRules"
                                v-model="editPassword2"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="editDialog=false" block>取消</v-btn>
          <v-btn color="primary" outline @click="submit" block>确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import * as messageAction from '../store/message/action-types.js'
  export default {
    data () {
      return {
        headers: [
          {text: '用户名', align: 'left', value: 'username'}
        ],
        pagination: {
          rowsPerPage: -1,
          sortBy: 'username'
        },
        admins: [],
        name: '',
        level: '',
        phone: '',
        address: '',
        create_time: '',
        kind: '',
        nameTemp: '',
        phoneTemp: '',
        addressTemp: '',
        kindTemp: '',
        editDialog: false,
        editPassword1: '',
        editPassword2: '',
        editValid: false,
        newDialog: false,
        newValid: false,
        newUsername: '',
        newPassword1: '',
        newPassword2: '',
        usernameRules: [
          (v) => !!v || '请输入登录用户名',
          (v) => v && v.length <= 20 || '用户名不得超过20位'
        ],
        passwordEditRules: [
          (v) => !!v || '请输入密码',
          (v) => v && v.length >= 8 || '密码至少8位',
          (v) => v && !v.match(/^[A-Z]*$/g) || '密码不能全为大写字母',
          (v) => v && !v.match(/^[a-z]*$/g) || '密码不能全为小写字母',
          (v) => v && v.match(/[0-9].*[0-9]/g) != null || '密码需至少包含两位数字',
          (v) => v && v === this.editPassword1 || '两次输入不一致'
        ],
        passwordNewRules: [
          (v) => !!v || '请输入密码',
          (v) => v && v.length >= 8 || '密码至少8位',
          (v) => v && !v.match(/^[A-Z]*$/g) || '密码不能全为大写字母',
          (v) => v && !v.match(/^[a-z]*$/g) || '密码不能全为小写字母',
          (v) => v && v.match(/[0-9].*[0-9]/g) != null || '密码需至少包含两位数字',
          (v) => v && v === this.newPassword1 || '两次输入不一致'
        ]
      }
    },
    created () {
      if (this.role === 'administrator') {
        this.axios.get('/administrators').then(res => {
          if (res.data.err_code === 0) {
            this.admins = res.data.data
          } else {
            this.showSnackBar({
              text: res.data.err_msg,
              context: 'error',
              show: true
            })
          }
        })
        return
      }
      this.name = this.profile.name
      this.level = this.profile.level
      this.phone = this.profile.phone
      this.create_time = this.profile.create_time
      if (this.role === 'customer') {
        this.address = this.profile.address
      }
      if (this.role === 'merchant') {
        this.kind = this.profile.kind
      }
    },
    computed: {
      ...mapGetters({
        profile: 'getProfile',
        username: 'getUsername',
        role: 'getRole',
        password: 'getPassword'
      })
    },
    methods: {
      ...mapActions({
        showSnackBar: messageAction.SHOW_SNACK_BAR
      }),
      submit () {
        if (this.$refs.editForm.validate()) {
          if (this.editPassword1 === this.password) {
            this.showSnackBar({
              text: '新密码不得与原密码相同',
              context: 'error',
              show: true
            })
          } else {
            this.axios.put(`/${this.role}/${this.username}`, {
              password: this.editPassword1
            }).then((res) => {
              if (res.data.err_code === 0) {
                this.editDialog = false
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
            })
          }
        }
      },
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
      },
      delAdmin (aUsername) {
        let self = this
        this.axios.delete(`/administrator/${aUsername}`).then(res => {
          if (res.data.err_code === 0) {
            let index = self.admins.findIndex(admin => admin === aUsername)
            self.admins.splice(index, 1)
            this.showSnackBar({
              text: '删除成功',
              context: 'success',
              show: true
            })
          }
        })
      },
      newAdmin () {
        let dupUsername = false
        let self = this
        if (this.$refs.newForm.validate()) {
          this.admins.forEach(function (item) {
            if (item === self.newUsername) {
              self.showSnackBar({
                text: '用户名已存在',
                context: 'error',
                show: true
              })
              dupUsername = true
              return
            }
          })
          if (dupUsername) return
          let newAdmin
          newAdmin.username = this.newUsername
          newAdmin.password = this.newPassword1
          this.axios.post('/administrators', newAdmin).then(res => {
            if (res.data.err_code === 0) {
              this.admins.push(self.newUsername)
              this.newDialog = false
              this.showSnackBar({
                text: '添加成功',
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
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
