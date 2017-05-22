var app = new Vue({
  el: '#app',
  data: {
    dorm: '아름관',
    dorms: [
      '아름관',
      '성실관',
      '진리관',
      '희망관'
    ],
    allList: [],
    mode: 'current'
  },
  methods: {
    fetch() {
      var newList = []
      firebase.database().ref("request/").once('value', function(snapshot) {
        var requests = snapshot.val()
        for (key in requests) {
          newList.push({
            key: key,
            val: requests[key]
          })
        }
      })
      this.allList = newList
    },
    numberOfNew: function(dormName) {
      return this.allList.filter(x => x.val.dorm === dormName && x.val.status === 'new').length
    }
  },
  created: function() {
    this.fetch()
  },
  components: {
    current: {
      template: '#current',
      data: function() {
        return {
          content: '',
          location: '',
          currentEditingRequestKey: ''
        }
      },
      props: ['allList', 'dorm'],
      methods: {
        dormList: function(dormName, statusName) {
          return this.allList.filter(
            x => {
              return x.val.dorm === dormName && x.val.status === statusName
            }
          )
        },
        nowFormat: function() {
          return moment().format('YYYY년 MM월 D일')
        },
        makeRequest: function() {
          var reqRef = firebase.database().ref("/").child("request")
          var newReqRef = reqRef.push()
          var newReq = {
            dorm: this.dorm,
            content: this.content,
            location: this.location,
            date: moment().format('YYYY/MM/DD'),
            deliveryDate: moment().format('YYYY/MM/DD'),
            status: 'approved'
          }
          console.log(newReqRef.set(newReq))
          this.$emit('fetch')
          $('#makeNewRequest').modal('hide')
        },
        approve(key) {
          firebase.database().ref('request/' + key + '/status').set('approved')
          this.$emit('fetch')
        },
        deleteRequest(key) {
          firebase.database().ref('request/' + key + '/status').set('deleted')
          this.$emit('fetch')
        },
        completeRequest(key) {
        	firebase.database().ref('request/' + key + '/status').set('completed')
            this.$emit('fetch')
        },
        openEditModal (key) {
          this.currentEditingRequestKey = key
          $('#edit').modal('show')
        }
      },
      components: {
        editModal: {
          template: '#edit-modal',
          data: function () {
            return {
              location: '',
              content: ''
            }
          },
          props: ['allList', 'reqKey'],
          methods: {
            edit () {
              firebase.database().ref('request/' + this.reqKey +'/deliveryDate').set(moment().format('YYYY/MM/DD'));
              firebase.database().ref('request/' + this.reqKey +'/location').set(this.location);
              firebase.database().ref('request/' + this.reqKey +'/content').set(this.content);
              $('#edit').modal('hide')
              this.$emit('fetch')
            }
          },
          watch: {
            reqKey: function (newKey) {
              for (i in this.allList) {
                if (this.allList[i].key === newKey) {
                  var currentRequestVal = this.allList[i].val
                  this.location = currentRequestVal.location
                  this.content = currentRequestVal.content
                }
              }
            }
          }
        }
      }
    },
    history: {
      template: "#history",
      props: ['allList', 'dorm'],
      methods: {
        dormList: function(dormName) {
          return this.allList.filter(
            x => {
              return x.val.dorm === dormName
            }
          )
        },
        recoverRequest(key) {
          firebase.database().ref('request/' + key + '/status').set('new')
          this.$emit('fetch')
        },
        deleteRequest(key) {
          firebase.database().ref('request/' + key + '/status').set('deleted')
          this.$emit('fetch')
        }
      }
    }
  }
})
