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
	  deleteRequest : ''
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
	  content = ''
	  location = ''
          $('#makeNewRequest').modal('hide')
        },
        approve(key) {
          firebase.database().ref('request/' + key + '/status').set('approved')
          this.$emit('fetch')
        },
	approveAll() {
	  var currentDormList = this.dormList(this.dorm, 'new')
	  for (var i in currentDormList) {
	    firebase.database().ref('request/' + currentDormList[i].key + '/status').set('approved')
	  }
	  this.$emit('fetch')
	},
        completeRequest(key) {
        	firebase.database().ref('request/' + key + '/status').set('completed')
            this.$emit('fetch')
        },
        edit(key) {
          firebase.database().ref('request/' + key +'/deliveryDate').set(moment().format('YYYY/MM/DD'));
          firebase.database().ref('request/' + key +'/location').set(this.location);
          firebase.database().ref('request/' + key +'/content').set(this.content);
          $('#edit').modal('hide')
        },
	selectRequestByKey : function(key) {
	  return this.allList.filter(
	    x => {
	      return x.key === key
	    }
	  )
	},
	showDeleteModal : function(key) {
	  this.deleteRequest = this.selectRequestByKey(key)[0]
	  $('#delete_modal').modal('show')
        },
	deleteRequestByModal : function() {
	  firebase.database().ref('request/' + this.deleteRequest.key + '/status').set('deleted')
	  this.deleteRequest = ''
	  $('#delete_modal').modal('hide')
	  this.$emit('fetch')
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
