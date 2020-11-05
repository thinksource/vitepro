<template>
  <div class="container">
    <h1>{{title}}</h1>
    <br/>
    <!-- <HelloWorld msg="Hello Vue 3.0 + Vite" /> -->
    <ul>
    <li v-for="(question, q_index) in questions" :key="q_index">
        <Question :title="question.title" :options="question.options" :name="question.title[0]+q_index" :visible="question.visible" :model="question.answer"/>

      </li> 
    </ul>
  </div>
</template>

<script lang="ts">
import {onMounted, onBeforeMount, ref, reactive, toRefs} from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import Question from './components/Question.vue'
import {dOption} from './data.ts'
import axios from 'axios';


function seletChildbyName(node: ChildNode, name: string){
  let ret:ChildNode[]=[];
  for(let i in node.childNodes){
    if(node.childNodes[i].nodeName === name){
        ret.push(node.childNodes[i])
    }
  }
  
  if(ret.length >= 1)
    return ret;
  else{
    return undefined;
  }
}


class qData{
  public title:string;
  public score: number;
  public visible: boolean;
  public options: dOption[] = [];
  public answer: number;
  constructor(node: ChildNode, visible:boolean){
    this.title = seletChildbyName(node, 'title')[0].textContent;
    this.score = parseInt(seletChildbyName(node, 'score')[0].textContent);
    this.visible = visible; 
    let answers = seletChildbyName(node, 'answers')[0];
    let ops = seletChildbyName(answers, 'answer');
    for(let op_index in ops){
      let factor:string = seletChildbyName(ops[op_index], 'factor')[0].textContent;
      let op_text:string = seletChildbyName(ops[op_index], 'value')[0].textContent;
      let op : dOption = new dOption(op_text, this.title[0]+op_text[0]+op_index, Number(factor)*this.score);
      this.options.push(op);
    }
  }
}

export default {
  name: 'App',
  components: {
    HelloWorld,
    Question
  },
  setup(){
    const state=reactive({
      title:"",
      questions: [],
    });
    let dataReady = ref(false);
    onBeforeMount(async ()=>{
    const myreq = await axios.get('./data/example.xml', {headers:{"Content-Type": "application/xml; charset=utf-8"}});
    if(myreq.status==200){
    const parser = new DOMParser();
    const oDOM = parser.parseFromString(myreq.data, "application/xml");
    console.log(oDOM.childNodes[0]);
    // console.log(oDOM)
    const root=oDOM.childNodes[0];
    const questions = seletChildbyName(root, 'questions')[0];
    const qlist= seletChildbyName(questions, 'question');
    state.title = seletChildbyName(root, 'name')[0].firstChild.nodeValue;

    console.log(state.title);
    console.log(questions);
    for(let i of qlist){
      state.questions.push(new qData(i, true))
      
    }
    console.log(state.questions);
    
    }
    });

    return {...toRefs(state)};
  }
}
</script>

