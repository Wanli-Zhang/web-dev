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
          <v-dialog v-model="dialog" persistent max-width="400px">
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
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import * as messageAction from '../store/message/action-types.js'
  export default {
    data () {
      return {
        headers: [
          {text: '名称', value: 'name', align: 'left'},
          {text: '级别', value: 'level', align: 'left'},
          {text: '电话号码', value: 'phone', align: 'left'},
          {text: '种类', value: 'kind', align: 'left'},
          {text: '创建时间', value: 'create_time', align: 'left'},
          {text: '交易', sortable: false, align: 'left'}
        ],
        pagination: {
          rowsPerPage: -1,
          sortBy: 'level',
          descending: true
        },
        dialog: false,
        amount: null
      }
    },
    created () {
      // this.fetchMerchants()
    },
    computed: {
      ...mapGetters({
        merchants: 'getMerchants',
        username: 'getUsername'
      })
    },
    methods: {
      ...mapActions({
        showSnackBar: messageAction.SHOW_SNACK_BAR
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
              show: 'true'
            })
          }
        }, () => {
          this.showSackBar({
            text: '交易失败',
            context: 'error',
            show: 'true'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
