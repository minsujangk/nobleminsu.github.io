<template lang="html">
  <div class="row">
    <div class="col-md-6">
      <div style="text-align:center; float: right;" >
        <a class="btn btn-success btn-md" role="button" @click="approveAll(dorm)">모두 승인</a>
      </div>
    </div>
    <div class="col-md-6">
      <div style="text-align:center; float: right">
        <a class="btn btn-primary btn-md" role="button" data-toggle="modal" data-target="#makeNewRequest">새로운 요청 추가</a>
      </div>
    </div>
    <div class="col-md-6">
      <div class="title">새로운 요청</div>
      <table id="newRequestTable" class='table'>
        <thead>
          <tr>
            <th width="13%">요청날짜</th>
            <th width="12%">위치</th>
            <th>요청</th>
            <th width="10%">삭제</th>
            <th width="13%">요청승인</th>
          </tr>
        </thead>
        <transition-group name="list" tag="tbody">
          <tr v-for="req in dormList(dorm, 'new')" :key="req['.key']">
            <td>{{req.date}}</td>
            <td>{{req.location}}</td>
            <td>{{req.content}}</td>
            <td><button type="button" @click="showDeleteModal(req['.key'])" class="btn btn-default btn-xs">삭제</button></td>
            <td><button @click="approve(req['.key'])" class="btn btn-success btn-flat">승인</button></td>
          </tr>
        </transition-group>
      </table>
    </div>
    <div class="col-md-6">
      <div class="title">복지팀에 전달된 요청</div>
      <table id="approvedRequestTable" class='table'>
        <thead>
          <tr>
            <th width="13%">요청날짜</th>
            <th width="12%">위치</th>
            <th>요청</th>
            <th width="13%">승인날짜</th>
            <th width="8%">수정</th>
            <th width="13%">수리완료</th>
          </tr>
        </thead>
        <transition-group name="list" tag="tbody">
          <tr v-for="req in dormList(dorm, 'approved')" :key="req['.key']">
            <td>{{req.date}}</td>
            <td>{{req.location}}</td>
            <td>{{req.content}}</td>
            <td>{{req.deliveryDate}}</td>
            <td><button type="button" class="btn btn-default btn-xs" role="button" @click="openEditModal(req['.key'])">수정</button></td>
            <td><button @click="completeRequest(req['.key'])" type="button" class="btn btn-success">완료</button></td>
          </tr>
        </transition-group>
      </table>

    </div>

    <edit-modal :all-list="allList" :reqKey="currentEditingRequestKey"/>

    <div class="modal fade" id="makeNewRequest" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">새로운 요청 추가하기</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label for="date" class="col-sm-2 control-label">날짜</label>
                <div class="col-sm-10">
                  <p class="form-control-static">{{nowFormat()}}</p>
                </div>
              </div>
              <div class="form-group">
                <label for="location" class="col-sm-2 control-label">위치</label>
                <div class="col-sm-10">
                  <input v-model="location" type="text" class="form-control" id="location" placeholder="위치">
                </div>
              </div>
              <div class="form-group">
                <label for="content" class="col-sm-2 control-label">요청</label>
                <div class="col-sm-10">
                  <textarea v-model="content" class="form-control" name="content" id="content" cols="30" rows="10" @keydown.enter="makeRequest"></textarea>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
            <button @click="makeRequest" type="button" class="btn btn-primary">요청하기</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="delete_modal" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <!-- remove modal content -->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">요청 삭제하기</h4>
          </div>
          <!-- remove reason -->
          <div class="modal-body">
            <form class="form-horizontal">
              <!-- Information of Current Deletion Request -->
              <div class="form-group">
                <label class="col-sm-2 control-label">요청 내용 </label>
                <div class="col-sm-10">
                  <p class="form-control-static" v-if='deleteRequest != ""'> {{ deleteRequest.content }}</p>
                  <p class="form-control-static" v-else> 선택되지 않음 </p>
                </div>
              </div>
              <!-- Key of Current Deletion Request - HIDDEN -->
              <input type="hidden" name="delete_key" id = "delete_key">
              <!-- Input Reason for Deletion -->
              <div class="form-group">
                <label for="delete_reason" class="col-sm-2 control-label">삭제 사유</label>
                <div class="col-sm-10">
                  <textarea  class="form-control" name="delete_reason" id="delete_reason"></textarea>
                </div>
              </div>
              <!-- Hidden input for Key -->
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
            <button @click="deleteRequestByModal" type="button" class="btn btn-danger">삭제하기</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import editModal from './edit-modal.vue'
import moment from 'moment'
import { db } from './firebase'

export default {
  data: function () {
    return {
      content: '',
      location: '',
      currentEditingRequestKey: '',
      deleteRequest: ''
    }
  },
  props: ['allList', 'dorm'],
  methods: {
    dormList (dormName, statusName) {
      return this.allList.filter(
        x => x.dorm === dormName && x.status === statusName
      )
    },
    nowFormat () {
      return moment().format('YYYY년 MM월 D일')
    },
    makeRequest () {
      db.ref('request').push({
        dorm: this.dorm,
        content: this.content,
        location: this.location,
        date: moment().format('YYYY/MM/DD'),
        deliveryDate: moment().format('YYYY/MM/DD'),
        status: 'approved'
      })
      this.content = ''
      this.location = ''
      $('#makeNewRequest').modal('hide')
    },
    approve (key) {
      db.ref('request/' + key + '/status').set('approved')
    },
    approveAll () {
      var currentDormList = this.dormList(this.dorm, 'new')
      for (var i in currentDormList) {
        db.ref('request/' + currentDormList[i]['.key'] + '/status').set('approved')
      }
    },
    completeRequest (key) {
      db.ref('request/' + key + '/status').set('completed')
    },
    openEditModal (key) {
      this.currentEditingRequestKey = key
      $('#edit').modal('show')
    },
    selectRequestByKey (key) {
      return this.allList.filter(x => x['.key'] === key)
    },
    showDeleteModal (key) {
      this.deleteRequest = this.selectRequestByKey(key)[0]
      $('#delete_modal').modal('show')
    },
    deleteRequestByModal () {
      db.ref('request/' + this.deleteRequest['.key'] + '/status').set('deleted')
      this.deleteRequest = ''
      $('#delete_modal').modal('hide')
    }
  },
  components: {
    editModal
  }
}
</script>

<style lang="css">
</style>
