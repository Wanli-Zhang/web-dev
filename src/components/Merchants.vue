<template>
  <div>
    <v-card-title>商家列表</v-card-title>
    <v-data-table v-bind:headers="headers"
                  :items="merchants"
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
              <div slot="input" class="mt-3 title">商家名称</div>
              <v-text-field slot="input"
                            label="商家名称"
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
                <v-card-title class="mt-3 title">商家级别</v-card-title>
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
              <div slot="input" class="mt-3 title">客服电话</div>
              <v-text-field slot="input"
                            label="客服电话"
                            v-model="phoneTmp"
                            single-line autofocus>
              </v-text-field>
            </v-edit-dialog>
            <div v-if="role==='customer'">{{ props.item.phone }}</div>
          </td>

          <td>
            <v-edit-dialog v-if="role==='administrator'"
                           @open="kindTmp = props.item.kind"
                           @save="editKind(props.item.username)"
                           large lazy>
              <div>{{ props.item.kind }}</div>
              <div slot="input" class="mt-3 title">商家种类</div>
              <v-text-field slot="input"
                            label="商家种类"
                            v-model="kindTmp"
                            single-line autofocus>
              </v-text-field>
            </v-edit-dialog>
            <div v-if="role==='customer'">{{ props.item.kind }}</div>
          </td>

          <td>
            {{ new Date(props.item.create_time * 1000).toLocaleDateString() }}
          </td>
          <v-dialog v-model="transDialog"
                    max-width="400px"
                    v-if="role==='customer'">
            <v-btn slot="activator" outline primary block>付款</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">商家：{{props.item.name}}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-layout>
                    <v-flex xs12>
                      <v-text-field label="支付金额" required
                                    v-model="amount">
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn flat @click="transDialog=false" block>取消</v-btn>
                <v-btn color="primary" outline block
                       @click="newTrans(props.item.username, amount)">确认</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn flat icon
                 @click="delMerchant(props.item.username)"
                 v-if="role==='administrator'">
            <v-icon>delete</v-icon>
          </v-btn>
        </tr>
      </template>
      <template slot="footer"
                v-if="role==='administrator'">
        <td colspan="100%">
          <span style="color:cornflowerblue">
            注：点击表格文字可修改商家信息
          </span>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="newDialog" persistent max-width="400px"
              v-if="role==='administrator'">
      <v-btn color="primary" outline slot="activator" block>
        <v-icon>add</v-icon>
        新增商店
      </v-btn>
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
          <v-btn flat @click="newDialog=false" block>取消</v-btn>
          <v-btn color="primary" outline @click="newMerchant()" block>确认</v-btn>
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
          {text: '用户名', value: 'username', align: 'left'},
          {text: '名称', value: 'name', align: 'left'},
          {text: '级别', value: 'level', align: 'left'},
          {text: '电话号码', value: 'phone', align: 'left'},
          {text: '种类', value: 'kind', align: 'left'},
          {text: '创建时间', value: 'create_time', align: 'left'}
        ],
        // 表格的底部的页码
        pagination: {
          rowsPerPage: -1,
          sortBy: 'username',
          descending: false
        },
        levelItems: [
          { text: '小商店', value: 0 },
          { text: '普通商店', value: 1 },
          { text: '旗舰商店', value: 2 }
        ],
        transDialog: false,
        levelDialog: false,
        amount: null,
        nameTmp: '',
        kindTmp: '',
        phoneTmp: '',
        levelTmp: '',
        newDialog: false,
        newUsername: '',
        newPassword: '',
        newName: '',
        newKind: '',
        newPhone: '',
        newLevel: '',
        valid: false,
        mUsername: '',
        usernameRules: [
          (v) => !!v || '请输入登录用户名',
          (v) => v && v.length <= 20 || '用户名不得超过20位'
        ],
        nameRules: [
          (v) => !!v || '请输入商店名称',
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
      this.fetchMerchants().then(() => {
        console.log(this.merchants)
      }, (err) => {
        this.showSnackBar({
          text: err,
          context: 'error',
          show: true
        })
      })
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
        fetchMerchants: bizAction.FETCH_MERCHANTS,
        addMerchant: bizAction.ADD_MERCHANT,
        deleteMerchant: bizAction.DELETE_MERCHANT,
        updateMerchant: bizAction.UPDATE_MERCHANT,
        login: 'login'
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
        this.axios.post(`/webapi/v1/merchant/${mUsername}/customer/${this.username}`, {
          trans_amount: amount
        }, {withCredentials: false}).then((res) => {
          if (res.data.err_code === 0) {
            this.transDialog = false
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
      editKind (mUsername) {
        this.updateMerchant({
          username: mUsername,
          kind: this.kindTmp
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
      newMerchant () {
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
          this.addMerchant({
            username: this.newUsername,
            password: this.newPassword,
            name: this.newName,
            level: this.newLevel,
            phone: this.newPhone,
            kind: this.newKind
          }).then(() => {
            this.newDialog = false
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
      delMerchant (mUsername) {
        this.deleteMerchant(mUsername).then(() => {
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
