<template lang="html">
  <div class="row">
    <div class="col-md-12">
      <div class="row" style="margin-bottom:1em">
        <div class="col-md-4 col-md-offset-4">
          <input class="form-control" type="text" v-model="query" placeholder="여기에서 검색하세요">
        </div>
      </div>
      <div class="title">모든 수리 요청 기록</div>
      <table class="table">
        <thead>
          <tr>
            <th width="15%">날짜</th>
            <th width="10%">위치</th>
            <th width="40%">요청</th>
            <th width="10%">마지막 수정</th>
            <th width="25%" colspan="3">현재 상태</th>
          </tr>
        </thead>
        <transition-group name="list" tag="tbody">
          <tr v-for="req in searchedList.reverse()"
            :key="req['.key']"
            :class="{success: req.status == 'approved',
              active: req.status == 'deleted',
              warning: req.status == 'new'}">
            <td>{{req.date}}</td>
            <td>{{req.location}}</td>
            <td>{{req.content}}</td>
            <td>{{req.sagam}}</td>
            <td>
              <span v-if="req.status == 'approved'">승인됨 - {{req.deliveryDate}}</span>
              <span v-else-if="req.status == 'deleted'">삭제됨</span>
              <span v-else-if="req.status == 'new'">신규</span>
              <span v-else-if="req.status == 'completed'">수리완료</span>
            </td>
            <td>
<!--          <button v-if="req.status == 'approved'" type="button" @click="openEditModal(req.key)" class="btn btn-default btn-xs">수정</button> -->
              <button v-if="req.status == 'deleted'" type="button" @click="recoverRequest(req['.key'])" class="btn btn-default btn-xs">복원</button>
<!--          <button v-else-if="req.status == 'new'" type="button" @click='deleteRequest(req.key)' class="btn btn-default btn-xs">삭제</button>  -->
            </td>
<!--        <td>
              <button v-if="req.status == 'approved'" class="btn btn-primary">완료</button>
              <button v-else-if="req.status == 'new'" @click='approve(req.key)' class="btn btn-success">승인</button>
            </td> -->
          </tr>
        </transition-group>
      </table>
    </div>
  </div>
</template>

<script>
import { db } from './firebase'

export default {
  data () {
    return {
      query: ''
    }
  },
  props: ['allList', 'dorm'],
  computed: {
    searchedList () {
      var vm = this
      return this.allList.filter(
        item => (
          item.content.indexOf(vm.query) !== -1 || 
          item.location.indexOf(vm.query) !== -1 ) &&
          vm.dorm === item.dorm
      )
    }
  },
  methods: {
    dormList: function(dormName) {
      return this.allList.filter(x => x.dorm === dormName)
    },
    recoverRequest(key) {
      db.ref('request/' + key + '/status').set('new')
    },
    deleteRequest(key) {
      db.ref('request/' + key + '/status').set('deleted')
    }
  }
}
</script>

<style lang="css">
</style>
