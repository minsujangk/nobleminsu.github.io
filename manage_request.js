
var appRequest = new Vue({
  el: '#app-request',
  data: {
    requests: []
  },
  created: function(){

    var date = new Date();
    var time = date.getTime();
    firebase.database().ref("request/" + time).set({
      dorm: "hi",
      status: 0,
      date: 20170518,
      location: "318호",
      content: "몰라",
      deliveryDate: 20170520
    })
    var requests = this.requests;
    firebase.database().ref("request/").once('value', function(snapshot){
      //console.log(requests);
      snapshot.forEach(function(childSnapshot){
        //console.log(childSnapshot.val())
        requests.push(childSnapshot.val());
      });
    });
  }
})
