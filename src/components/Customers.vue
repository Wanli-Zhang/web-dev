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
            {{ props.item.address }}
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
          <v-dialog v-model="dialog" persistent max-width="400px">
            <v-btn slot="activator" outline @click="dialog=false;checkDetails(props.item.username)" primary block>详细信息</v-btn>
            <div>
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
            </div>
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
        showSnackBar: messageAction.SHOW_SNACK_BAR
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
      }
    }
  }
</script>

<style scoped>

</style>
