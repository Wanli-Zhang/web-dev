<template>
  <div>
    <v-card-title class="title">交易记录：{{customer(cUsername).name}}</v-card-title>
    <v-data-table :headers="headers"
                  :items="transHistory"
                  :pagination.sync="pagination"
                  class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{props.item.trans_id}}</td>
          <td>{{new Date(props.item.trans_time).toLocaleTimeString()}}</td>
          <td>{{props.item.amount}}</td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data () {
      return {
        cUsername: this.$route.params.cUsername,
        headers: [
          {text: '交易ID', align: 'left', value: 'trans_id'},
          {text: '交易时间', align: 'left', value: 'trans_time'},
          {text: '交易金额', align: 'left', value: 'trans_amount'}
        ],
        pagination: {
          rowsPerPage: -1,
          sortBy: 'trans_time',
          descending: true
        },
        transHistory: []
      }
    },
    created () {
      this.axios.get(`/webapi/v1/merchant/${this.username}/customer/${this.cUsername}`).then(res => {
        if (res.data.err_code === 0) {
          this.transHistory = res.data.data
        }
      })
    },
    computed: {
      ...mapGetters({
        username: 'getUsername',
        customer: 'getCustomer'
      })
    }
  }
</script>
