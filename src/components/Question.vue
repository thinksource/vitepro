<template>
<transition name="fade">
<div v-if="visible">
<h4>{{title}}</h4>
    <ul class="">
      <li v-for="(opt, o_index) in options" :key="o_index" class="mylist">
        <input type="radio" :name="name+o_index" :value="opt" v-model="ref_model" :id="opt.target" v-bind:checked="opt.checked" class="myradio"/><label >{{opt.text}}</label>

      </li>
    </ul>
</div>
</transition>
</template>


<script lang='ts'>

import {watch, ref} from 'vue';

import { dOption } from '../data';


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
  props: ['visible', 'title', 'options', 'name'],
  // {
  //   visible: Boolean,
  //   title: String,
  //   options: [],
  //   name: String,
  //   // model: Number,
  // },
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


ul {
  list-style-type: none;
  padding-left: 0;
}
.mylist {
  text-align: left !important;
  list-style-type: none ;
  padding: .30rem 1rem;
  flex-direction: column;
}

.myradio {
  display: inline-flex;
  margin-right: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>