<template>
  <div>
    <h1> 로그인 </h1>
    <div class="radios">
      <div class="radio" v-for="aDorm in dorms" :class="{'checked': aDorm === dorm}" @click="dorm=aDorm">
        <label>
          <input type="radio" name="dorm">
          {{aDorm}} 선생님
        </label>
      </div>
    </div>
    <button class="btn btn-primary" @click="$emit('login', dorm)"> 로그인 </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dorm: ''
    }
  },
  props: ['dorms']
}
</script>

<style scoped>
  .radios {
    padding: .3em 0 1em;
  }

  .radio {
    padding: 1em .4em;
    background-color: #e0e0e0;
    cursor: pointer;
  }

  .checked {
    background-color: #265a88;
    color: whitesmoke;
  }

  input[type=radio] {
    visibility: hidden;
  }

</style>
