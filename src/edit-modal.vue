<template lang="html">
  <div class="modal fade" id="edit" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">요청 수정하기</h4>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="form-group">
              <label for="location" class="col-sm-2 control-label">위치</label>
              <div class="col-sm-10">
                <input v-model="location" type="text" class="form-control" id="location">
              </div>
            </div>
            <div class="form-group">
              <label for="content" class="col-sm-2 control-label">요청</label>
              <div class="col-sm-10">
                <textarea v-model="content" class="form-control" name="content" id="content" cols="30" rows="10">
                </textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">닫기</button>
          <button @click="edit" type="button" class="btn btn-default" >수정하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from './firebase'

export default {
  data: function () {
    return {
      location: '',
      content: ''
    }
  },
  props: ['allList', 'reqKey'],
  methods: {
    edit () {
      db.ref('request/' + this.reqKey +'/deliveryDate').set(moment().format('YYYY/MM/DD'))
      db.ref('request/' + this.reqKey +'/location').set(this.location)
      db.ref('request/' + this.reqKey +'/content').set(this.content)
      $('#edit').modal('hide')
    }
  },
  watch: {
    reqKey: function (newKey) {
      for (var i in this.allList) {
        if (this.allList[i]['.key'] === newKey) {
          var currentRequestVal = this.allList[i]
          this.location = currentRequestVal.location
          this.content = currentRequestVal.content
        }
      }
    }
  }
}
</script>

<style lang="css">
</style>
