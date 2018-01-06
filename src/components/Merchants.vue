<template>
  <div>
    <v-card-title>商家列表</v-card-title>
    <v-data-table
      v-bind:headers="headers"
      :items="merchants"
      :pagination.sync="pagination"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td>
            {{ props.item.name }}
          </td>
          <td>
            {{ toLevel(props.item.level) }}
          </td>
          <td>
            {{ props.item.phone }}
          </td>
          <td>
            {{ props.item.kind }}
          </td>
          <td>
            {{ new Date(props.item.create_time).toLocaleDateString() }}
          </td>
          <v-dialog v-model="dialog" persistent max-width="400px" v-if="role==='customer'">
            <v-btn slot="activator" outline primary block>新建交易</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">商家：{{props.item.name}}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-layout>
                    <v-flex xs12>
                      <v-text-field label="支付金额" required v-model="amount"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" outline @click="dialog=false;newTrans(props.item.username, amount)" block>确认</v-btn>
                <v-btn flat @click="dialog=false" block>取消</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn color="secondary" outline @click="deleteMerchant(props.item.username)" v-if="role==='administrator'">删除</v-btn>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog2" persistent max-width="400px" v-if="role==='administrator'">
      <v-btn color="primary" outline slot="activator" center>新增商店</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">新增商店</span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-container>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    label="用户名/username"
                    required
                    v-model="newUsername"
                    :rules="usernameRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="密码/password"
                    required
                    v-model="newPassword"
                    :rules="passwordRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="商店名称/name"
                    required
                    v-model="newName"
                    :rules="nameRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="商点种类/kind"
                    required
                    v-model="newKind"
                    :rules="kindRules"
                  ></v-text-field>
                </v-flex>
                <v-select
                  v-bind:items="levelItems"
                  v-model="newLevel"
                  label="商店级别/level"
                  item-text="text"
                  item-value="value"
                  return-object
                  :rules="[v => !!v.text || '请选择商店级别']"
                ></v-select>
                <v-flex xs12>
                  <v-text-field
                    label="客服电话/phone"
                    required
                    v-model="newPhone"
                    :rules="phoneRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" outline @click="newMerchant" block>确认</v-btn>
          <v-btn flat @click="dialog2=false" block>取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import * as messageAction from '../store/message/action-types'
  import * as bizAction from '../store/biz/action-types'
  export default {
    data () {
      return {
        // 表格的头部
        headers: [
          {text: '名称', value: 'name', align: 'left'},
          {text: '级别', value: 'level', align: 'left'},
          {text: '电话号码', value: 'phone', align: 'left'},
          {text: '种类', value: 'kind', align: 'left'},
          {text: '创建时间', value: 'create_time', align: 'left'},
          {text: '操作', sortable: false, align: 'left'}
        ],
        // 表格的底部的页码
        pagination: {
          rowsPerPage: -1,
          sortBy: 'level',
          descending: true
        },
        levelItems: [
          { text: '小商店', value: 0 },
          { text: '普通商店', value: 1 },
          { text: '旗舰商店', value: 2 }
        ],
        dialog: false,
        amount: null,
        dialog2: false,
        newUsername: '',
        newPassword: '',
        newName: '',
        newKind: '',
        newPhone: '',
        newLevel: '',
        valid: false,
        usernameRules: [
          (v) => !!v || '请输入登录用户名',
          (v) => v && v.length <= 20 || '用户名不得超过20位'
        ],
        nameRules: [
          (v) => !!v || '请输入上商店名称',
          (v) => v && v.length <= 20 || '商店名称不得超过20位'
        ],
        passwordRules: [
          (v) => !!v || '请输入登录密码',
          (v) => v && v.length >= 8 || '密码至少8位',
          (v) => v && !v.match(/^[A-Z]*$/g) || '密码不能全为大写字母',
          (v) => v && !v.match(/^[a-z]*$/g) || '密码不能全为小写字母',
          (v) => v && v.match(/[0-9].*[0-9]/g) != null || '密码需至少包含两位数字'
        ],
        kindRules: [
          (v) => !!v || '请输入商店种类',
          (v) => v && v.length <= 10 || '商店种类不得超过10位'
        ],
        phoneRules: [
          (v) => !!v || '请输入客服电话',
          (v) => v && v.match(/^[0-9]*$/g) != null || '电话号码必须为数字'
        ]
      }
    },
    created () {
      this.fetchMerchants()
    },
    computed: {
      // 去/store获取信息
      ...mapGetters({
        merchants: 'getMerchants',
        username: 'getUsername',
        role: 'getRole'
      })
    },
    methods: {
      ...mapActions({
        showSnackBar: messageAction.SHOW_SNACK_BAR,
        fetchMerchants: bizAction.FETCH_MERCHANTS
      }),
      toLevel (level) {
        if (level === 0) {
          return '小商店'
        } else if (level === 1) {
          return '普通商店'
        } else {
          return '旗舰商店'
        }
      },
      newTrans (mUsername, amount) {
        this.axios.post(`/merchant/${mUsername}/customer/${this.username}`, {
          trans_amount: amount
        }).then((res) => {
          if (res.data.err_code === 0) {
            this.showSnackBar({
              text: '交易成功',
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
            text: '交易失败',
            context: 'error',
            show: true
          })
        })
      },
      newMerchant () {
        if (this.$refs.form.validate()) {
          this.dialog2 = false
          console.log('level=' + this.newLevel.value)
          // this.axios.post(`/merchants`, {
          //   username: this.newUsername,
          //   password: this.newPassword,
          //   name: this.newName,
          //   level: this.newLevel.value,
          //   phone: this.newPhone,
          //   kind: this.newKind
          // })
        } else {
          console.log('!validate')
        }
      }
    }
  }
</script>

<style scoped>

</style>
