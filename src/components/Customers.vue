<template>
  <div>
    <v-card-title>客户列表</v-card-title>
    <v-data-table
      v-bind:headers="headers"
      :items="customers"
      :pagination.sync="pagination"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.username }}</td>
          <td>
            <v-edit-dialog v-if="role==='administrator'"
                           @open="nameTmp = props.item.name"
                           @save="editName(props.item.username)"
                           large lazy>
              <div>{{ props.item.name }}</div>
              <div slot="input" class="mt-3 title">客户名称</div>
              <v-text-field slot="input"
                            label="客户名称"
                            v-model="nameTmp"
                            single-line autofocus>
              </v-text-field>
            </v-edit-dialog>
            <div v-if="role==='customer'">{{ props.item.name }}</div>
          </td>
          <td v-if="role==='administrator'"
              @click="levelTmp=props.item.level;levelDialog=true;mUsername=props.item.username"
              style="cursor:pointer">
            {{ toLevel(props.item.level) }}
            <v-dialog v-model="levelDialog"
                      max-width="300px">
              <v-card>
                <v-card-title class="mt-3 title">客户级别</v-card-title>
                <v-card-text>
                  <v-select v-bind:items="levelItems"
                            v-model="levelTmp"
                            item-text="text"
                            item-value="value">
                  </v-select>
                </v-card-text>
                <v-card-actions>
                  <v-btn flat block
                         @click="levelDialog=false">
                    CANCEL
                  </v-btn>
                  <v-btn flat color="primary" block
                         @click.stop="levelDialog=false;editLevel()">
                    SAVE
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </td>
          <td v-if="role==='customer'">
            {{ toLevel(props.item.level) }}
          </td>
          <td>
            <v-edit-dialog v-if="role==='administrator'"
                           @open="phoneTmp = props.item.phone"
                           @save="editPhone(props.item.username)"
                           large lazy>
              <div>{{ props.item.phone }}</div>
              <div slot="input" class="mt-3 title">电话</div>
              <v-text-field slot="input"
                            label="电话"
                            v-model="phoneTmp"
                            single-line autofocus>
              </v-text-field>
            </v-edit-dialog>
            <div v-if="role==='customer'">{{ props.item.phone }}</div>
          </td>
          <td>
            <v-edit-dialog v-if="role==='administrator'"
                           @open="phoneTmp = props.item.phone"
                           @save="editAddress(props.item.username)"
                           large lazy>
              <div>{{ props.item.phone }}</div>
              <div slot="input" class="mt-3 title">地址</div>
              <v-text-field slot="input"
                            label="地址"
                            v-model="phoneTmp"
                            single-line autofocus>
              </v-text-field>
            </v-edit-dialog>
            <div v-if="role==='customer'">{{ props.item.phone }}</div>
          </td>
          <td>
            {{ new Date(props.item.create_time).toLocaleDateString() }}
          </td>
          <td>
            {{ props.item.total_amount }}
          </td>
          <td>
            {{ props.item.total_count }}
          </td>
          <v-dialog v-model="dialog" persistent max-width="400px" v-if="role==='customer'">
            <v-btn slot="activator" outline @click="dialog=false;checkDetails(props.item.username)" primary block>详细信息</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">与客户{{props.item.name}}的交易记录</span>
              </v-card-title>
              <v-data-table
                v-bind:headers="transHeaders"
                :items="transHistory"
                :pagination.sync="pagination"
                class="elevation-1">
                <template slot="items" slot-scope="props">
                  <tr>
                    <td>
                      {{ props.item.trans_id }}
                    </td>
                    <td>
                      {{ props.item.trans_time }}
                    </td>
                    <td>
                      {{ props.item.trans_amount }}
                    </td>
                  </tr>
                </template>
              </v-data-table>
              <v-card-actions>
                <v-btn flat @click="dialog=false" block>确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn flat block
                 @click="delCustomer(props.item.username)"
                 v-if="role==='administrator'">
            <v-icon>delete</v-icon>
            删除
          </v-btn>
        </tr>
      </template>
      <template slot="footer"
                v-if="role==='administrator'">
        <td colspan="100%">
          <span style="color:cornflowerblue">
            注：点击表格文字可修改客户信息
          </span>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog2" persistent max-width="400px"
              v-if="role==='administrator'">
      <v-btn color="primary" outline slot="activator" block>
        <v-icon>add</v-icon>
        新增客户
        </v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">新增客户</span>
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
                    label="昵称/name"
                    required
                    v-model="newName"
                    :rules="nameRules"
                  ></v-text-field>
                </v-flex>
                <v-select
                  v-bind:items="levelItems"
                  v-model="newLevel"
                  label="客户级别/level"
                  item-text="text"
                  item-value="value"
                  return-object
                  :rules="[v => !!v.text || '请选择客户级别']"
                ></v-select>
                <v-flex xs12>
                  <v-text-field
                    label="电话/phone"
                    required
                    v-model="newPhone"
                    :rules="phoneRules"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    label="地址/address"
                    required
                    v-model="newAddress"
                    :rules="[v => !!v.text || '请输入地址']"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" outline @click="newCustomer()" block>确认</v-btn>
          <v-btn flat @click="dialog2=false" block>取消</v-btn>
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
        // 表格的头部
        headers: [
          {text: '名称', value: 'name', align: 'left'},
          {text: '级别', value: 'level', align: 'left'},
          {text: '电话号码', value: 'phone', align: 'left'},
          {text: '地址', value: 'address', align: 'left'},
          {text: '创建时间', value: 'create_time', align: 'left'},
          {text: '消费总额', value: 'total_amount', align: 'left'},
          {text: '消费次数', value: 'total_count', align: 'left'},
          {text: '交易', sortable: false, align: 'left'}
        ],
        levelItems: [
          { text: '普通客户', value: 0 },
          { text: '大客户', value: 1 },
          { text: '钻石级客户', value: 2 }
        ],
        transHistory: [
          {
            trans_id: 1,
            trans_time: 0,
            trans_amount: 120.3
          }
        ],
        transHeaders: [
          {text: '交易ID', value: 'trans_id', align: 'left'},
          {text: '交易时间', value: 'trans_time', align: 'left'},
          {text: '交易金额', value: 'trans_amount', align: 'left'}
        ],
        // 表格的底部的页码
        pagination: {
          rowsPerPage: -1,
          sortBy: 'level',
          descending: true
        },
        nameRules: [
          (v) => !!v || '请输入上商店名称',
          (v) => v && v.length <= 20 || '商店名称不得超过20位'
        ],
        usernameRules: [
          (v) => !!v || '请输入登录用户名',
          (v) => v && v.length <= 20 || '用户名不得超过20位'
        ],
        passwordRules: [
          (v) => !!v || '请输入登录密码',
          (v) => v && v.length >= 8 || '密码至少8位',
          (v) => v && !v.match(/^[A-Z]*$/g) || '密码不能全为大写字母',
          (v) => v && !v.match(/^[a-z]*$/g) || '密码不能全为小写字母',
          (v) => v && v.match(/[0-9].*[0-9]/g) != null || '密码需至少包含两位数字'
        ],
        phoneRules: [
          (v) => !!v || '请输入客服电话',
          (v) => v && v.match(/^[0-9]*$/g) != null || '电话号码必须为数字'
        ]
        dialog: false,
        amount: null
      }
    },
    created () {
      // this.fetchMerchants()
    },
    computed: {
      // 去/store获取信息
      ...mapGetters({
        customers: 'getCustomers',
        username: 'getUsername'
      })
    },
    methods: {
      ...mapActions({
        showSnackBar: messageAction.SHOW_SNACK_BAR,
        fetchCustomers: bizAction.FETCH_CUSTOMERS,
        addCustomer: bizAction.ADD_CUSTOMER,
        deleteCustomer: bizAction.DELETE_CUSTOMER,
        updateCustomer: bizAction.UPDATE_CUSTOMER
      }),
      toLevel (level) {
        if (level === 0) {
          return '普通客户'
        } else if (level === 1) {
          return '大客户'
        } else {
          return '钻石级客户'
        }
      },
      checkDetails (pCstmorId) {
        this.axios.get(`/merchant/${this.username}/customer/${pCstmorId}`, {

        }).then((res) => {
          if (res.data.err_code === 0) {
            this.transHistory = res.data.data
            this.showSnackBar({
              text: '查询成功',
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
            text: '查询失败',
            context: 'error',
            show: true
          })
        })
      },
      editName (mUsername) {
        this.updateMerchant({
          username: mUsername,
          name: this.nameTmp
        }).then(() => {
          this.showSnackBar({
            text: '修改成功',
            context: 'success',
            show: true
          })
        }, (errMsg) => {
          this.showSnackBar({
            text: errMsg,
            context: 'error',
            show: true
          })
        })
      },
      editLevel () {
        this.updateMerchant({
          username: this.mUsername,
          level: this.levelTmp
        }).then(() => {
          this.showSnackBar({
            text: '修改成功',
            context: 'success',
            show: true
          })
        }, (errMsg) => {
          this.showSnackBar({
            text: errMsg,
            context: 'error',
            show: true
          })
        })
      },
      editPhone (mUsername) {
        this.updateMerchant({
          username: mUsername,
          phone: this.phoneTmp
        }).then(() => {
          this.showSnackBar({
            text: '修改成功',
            context: 'success',
            show: true
          })
        }, (errMsg) => {
          this.showSnackBar({
            text: errMsg,
            context: 'error',
            show: true
          })
        })
      },
      editAddress (mUsername) {
        this.updateMerchant({
          username: mUsername,
          address: this.addressTmp
        }).then(() => {
          this.showSnackBar({
            text: '修改成功',
            context: 'success',
            show: true
          })
        }, (errMsg) => {
          this.showSnackBar({
            text: errMsg,
            context: 'error',
            show: true
          })
        })
      },
      newCustomer () {
        let self = this
        let dupUsername = false
        if (this.$refs.form.validate()) {
          this.merchants.forEach(function (item) {
            if (item.username === self.newUsername) {
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
          this.dialog2 = false
          this.addMerchant({
            username: this.newUsername,
            password: this.newPassword,
            name: this.newName,
            level: this.newLevel,
            phone: this.newPhone,
            address: this.newAddress
          }).then(() => {
            this.showSnackBar({
              text: '添加成功',
              context: 'success',
              show: true
            })
          }, (errMsg) => {
            this.showSnackBar({
              text: errMsg,
              context: 'error',
              show: true
            })
          })
        }
      },
      delCustomer (mUsername) {
        this.deleteCustomer (mUsername).then(() => {
          this.showSnackBar({
            text: '删除成功',
            context: 'success',
            show: true
          })
        }, (errMsg) => {
          this.showSnackBar({
            text: errMsg,
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
