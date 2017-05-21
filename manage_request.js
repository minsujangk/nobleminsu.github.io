var app = new Vue({
  el: '#app',
  data: {
    dorm: '아름관',
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
          location: ''
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
          return moment().format('YYYY년 mm월 D일')
        },
        makeRequest: function() {
          var reqRef = firebase.database().ref("/").child("request")
          var newReqRef = reqRef.push()
          var newReq = {
            dorm: this.dorm,
            content: this.content,
            location: this.location,
            date: moment().format('YYYYMMDD'),
            deliveryDate: moment().format('YYYYMMDD'),
            status: 'approved'
          }
          console.log(newReqRef.set(newReq))
          this.$emit('fetch')
          $('#myModal').modal('hide')
        },
        approve(key) {
          firebase.database().ref('request/' + key + '/status').set('approved')
          this.$emit('fetch')
        },
        deleteRequest(key) {
          firebase.database().ref('request/' + key + '/status').set('deleted')
          this.$emit('fetch')
        }
      }
    },
    history: {
      template: "#history",
      props: ['allList', 'dorm'],
      methods: {
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
