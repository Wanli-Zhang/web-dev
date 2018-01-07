<template>
  <div>
    <v-card-title>客户列表</v-card-title>
    <v-data-table v-bind:headers="merchantHeaders"
                  :items="customers"
                  :paginations.sync="pagination"
                  v-if="role==='merchant'"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.username }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ toLevel(props.item.level) }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.address }}</td>
          <td>{{ new Date(props.item.create_time).toLocaleDateString() }}</td>
          <td>{{ props.item.trans_amount }}</td>
          <td>{{ props.item.trans_count }}</td>
          <td>
            <v-btn outline primary
                   @click="goTransHistory(props.item.username)">
              查看交易记录
            </v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-data-table v-bind:headers="adminHeaders"
                  :items="customers"
                  :paginations.sync="pagination"
                  v-if="role==='administrator'"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.username }}</td>
          <td>{{ props.item.name }}</td>
          <td>{{ toLevel(props.item.level) }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.address }}</td>
          <td>{{ new Date(props.item.create_time).toLocaleDateString() }}</td>
          <v-btn primary icon outline
                 @click.stop="openEditDialog(props.item)">
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn icon outline
                 @click="delCustomer(props.item.username)">
            <v-icon>delete</v-icon>
          </v-btn>
          <v-dialog v-model="editDialog" max-width="400px">
            <v-card>
              <v-card-title>
                <span class="headline">修改客户信息：{{cUsername}}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-layout wrap>
                    <v-flex xs12>
                      <v-text-field label="名称/name"
                                    v-model="nameTemp"></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field label="地址/address"
                                    v-model="addressTemp"></v-text-field>
                    </v-flex>
                    <v-flex xs12>
                      <v-select :items="levelItems"
                                v-model="levelTemp"
                                label="级别/level"
                                item-text="text"
                                item-value="value"></v-select>
                    </v-flex>
                    <v-flex xs12>
                      <v-text-field label="电话号码/phone"
                                    v-model="phoneTemp"></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn flat @click.stop="editDialog=false" block>取消</v-btn>
                <v-btn color="primary" outline block
                       @click.stop="editCustomer(cUsername);editDialog=false">确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </tr>
      </template>
    </v-data-table>
    <v-dialog v-model="addDialog" max-width="400px"
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
                  <v-text-field label="用户名/username" required
                                v-model="newUsername"
                                :rules="usernameRules"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="密码/password" required
                    v-model="newPassword"
                    :rules="passwordRules"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="昵称/name" required
                    v-model="newName"
                    :rules="nameRules"></v-text-field>
                </v-flex>
                <v-select v-bind:items="levelItems"
                          v-model="newLevel"
                          label="客户级别/level"
                          item-text="text"
                          item-value="value"
                          return-object
                          :rules="[v => !!v.text || '请选择客户级别']"
                ></v-select>
                <v-flex xs12>
                  <v-text-field label="电话/phone" required
                    v-model="newPhone"
                    :rules="phoneRules"></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="地址/address" required
                    v-model="newAddress"
                    :rules="[v => !!v || '请输入地址']"></v-text-field>
                </v-flex>
                <v-flex xs12>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" outline @click.stop="newCustomer()" block>确认</v-btn>
          <v-btn flat @click.stop="addDialog=false" block>取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import * as messageAction from '../store/message/action-types.js'
  import * as bizAction from '../store/biz/action-types'
  export default {
    data () {
      return {
        // 表格的头部
        merchantHeaders: [
          {text: '用户名', value: 'username', align: 'left'},
          {text: '名称', value: 'name', align: 'left'},
          {text: '级别', value: 'level', align: 'left'},
          {text: '电话号码', value: 'phone', align: 'left'},
          {text: '地址', value: 'address', align: 'left'},
          {text: '创建时间', value: 'create_time', align: 'left'},
          {text: '消费总额', value: 'total_amount', align: 'left'},
          {text: '消费次数', value: 'total_count', align: 'left'}
        ],
        adminHeaders: [
          {text: '用户名', value: 'username', align: 'left'},
          {text: '名称', value: 'name', align: 'left'},
          {text: '级别', value: 'level', align: 'left'},
          {text: '电话号码', value: 'phone', align: 'left'},
          {text: '地址', value: 'address', align: 'left'},
          {text: '创建时间', value: 'create_time', align: 'left'}
        ],
        levelItems: [
          { text: '普通客户', value: 0 },
          { text: '大客户', value: 1 },
          { text: '钻石级客户', value: 2 }
        ],
        // 表格的底部的页码
        pagination: {
          rowsPerPage: -1,
          sortBy: 'username',
          descending: false
        },
        nameRules: [
          (v) => !!v || '请输入客户名称',
          (v) => v && v.length <= 20 || '客户名称不得超过20位'
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
        ],
        addDialog: false,
        newUsername: '',
        newPassword: '',
        newName: '',
        newPhone: '',
        newLevel: '',
        newAddress: '',
        amount: null,
        editDialog: false,
        cUsername: '',
        nameTemp: '',
        levelTemp: '',
        phoneTemp: '',
        addressTemp: '',
        valid: false
      }
    },
    created () {
      if (this.role === 'merchant') {
        this.fetchCustomersOfMerchant(this.username).then(() => {}, (err) => {
          this.showSnackBar({
            text: err,
            context: 'error',
            show: true
          })
        })
      }
      if (this.role === 'administrator') {
        this.fetchCustomers().then(() => {}, (err) => {
          this.showSnackBar({
            text: err,
            context: 'error',
            show: true
          })
        })
      }
    },
    computed: {
      // 去/store获取信息
      ...mapGetters({
        customers: 'getCustomers',
        getCustomer: 'getCustomer',
        username: 'getUsername',
        role: 'getRole'
      })
    },
    methods: {
      ...mapActions({
        showSnackBar: messageAction.SHOW_SNACK_BAR,
        fetchCustomers: bizAction.FETCH_CUSTOMERS,
        fetchCustomersOfMerchant: bizAction.FETCH_CUSTOMERS_OF_MERCHANT,
        addCustomer: bizAction.ADD_CUSTOMER,
        deleteCustomer: bizAction.DELETE_CUSTOMER,
        updateCustomer: bizAction.UPDATE_CUSTOMER
      }),
      openEditDialog (customer) {
        this.cUsername = customer.username
        this.nameTemp = customer.name
        this.levelTemp = customer.level
        this.phoneTemp = customer.phone
        this.addressTemp = customer.address
        this.editDialog = true
      },
      toLevel (level) {
        if (level === 0) {
          return '普通客户'
        } else if (level === 1) {
          return '大客户'
        } else {
          return '钻石级客户'
        }
      },
      newCustomer () {
        let self = this
        let dupUsername = false
        if (this.$refs.form.validate()) {
          this.customers.forEach(function (item) {
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
          this.addCustomer({
            username: this.newUsername,
            password: this.newPassword,
            name: this.newName,
            level: this.newLevel,
            phone: this.newPhone,
            address: this.newAddress
          }).then(() => {
            this.addDialog = false
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
      delCustomer (cUsername) {
        this.deleteCustomer(cUsername).then(() => {
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
      },
      editCustomer (cUsername) {
        this.updateCustomer({
          username: cUsername,
          name: this.nameTemp,
          address: this.addressTemp,
          level: this.levelTemp,
          phone: this.phoneTemp
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
      goTransHistory (cUsername) {
        this.$router.push({name: 'TransHistory', params: {cUsername: cUsername}})
      }
    }
  }
</script>
