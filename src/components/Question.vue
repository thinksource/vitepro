<template>
<div v-if="visible">
<h4>{{title}}</h4>
    <ul class="list-group">
      <li v-for="(opt, o_index) in options" :key="o_index" class="list-group-item">
        <input type="radio" :name="name" :value="opt" v-model="ref_model" :id="opt.target"/>{{opt.text}}

      </li>
    </ul>
</div>
</template>


<script lang='ts'>

import {watch, ref} from 'vue';



type Props={
    visible: boolean,
    title: string,
    options: [],
    name: string,
    // model: Number,
}
export default {
  name: 'HelloWorld',
  context: {
    update: (s:string)=>{return s}
  },
  props: {
    visible: Boolean,
    title: String,
    options: [],
    name: String,
    // model: Number,
  },
  // methods:{
  //   update(event: Event){
  //     console.log(event.target)
  //     this.$emit('update', {id: event.target.id})
  //   }
  // },
  setup(props, {emit}){
    let ref_model = ref(props)
    watch(ref_model, (newValue, oldValue)=>{
      // console.log(newValue)
      emit('opUpdate', {newValue, oldValue});
    });
    return {ref_model};
  }
}
</script>

<style>
h4 {
  text-align: left !important;
}
</style>