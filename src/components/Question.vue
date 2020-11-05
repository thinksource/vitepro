<template>
<div v-if="visible">
<h4>{{title}}</h4>
    <ul class="list-group">
      <li v-for="(opt, o_index) in options" :key="o_index" class="list-group-item">
        <input type="radio" :name="name" :value="opt.value" v-model="ref_model" :id="opt.target"/>{{opt.text}}

      </li>
    <ul>
<div>
</template>

<script lang='ts'>
import {watch, ref} from 'vue';
type Option={
    msg: string,
    scroe: number
}
export default {
  name: 'HelloWorld',
  props: {
    visible: Boolean,
    title: String,
    options: [],
    name: String,
    model: Number,
  },
  setup(props){
    console.log(props);
    let ref_model = ref(props.model)
    watch(ref_model, (newValue, oldValue)=>{
    console.log(newValue);
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