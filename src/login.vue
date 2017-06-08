<template>
  <div>
    <h1> 로그인 </h1>
    <div class="radios">
      
      <div class="radio" v-for="aSagam in sagamList" :class="{'checked': aSagam === sagam}" @click="sagam=aSagam">
        <label>
          <input type="radio" name="dorm">
          {{aSagam}} 선생님
        </label>
      </div>
    </div>
    <button class="btn btn-primary" @click="$emit('login', sagam)"> 로그인 </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sagam: '',
      sagamList: [
        '아름관 모모',
        '아름관 디디',
        '성실관 두두',
        '진리관 가가',
        '희망관 나나'
      ]
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
