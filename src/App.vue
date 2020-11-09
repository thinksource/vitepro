<template>
  <div class="container">
    <h1>{{title}}</h1>
    <br/>
    <!-- <HelloWorld msg="Hello Vue 3.0 + Vite" /> -->
    <ul>
    <li v-for="(question, q_index) in questions" :key="q_index" v-show="question.visible">
        <Question :title="question.title" :options="question.options" :name="question.title[0]+q_index" :visible="question.visible" @opUpdate="opHandle"/>

      </li> 
    </ul>
  </div>
</template>

<script lang="ts">
import {onMounted, onBeforeMount, ref, reactive, toRefs} from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import Question from './components/Question.vue'
import {dOption, dQuestion} from './data'
import axios from 'axios';


class qData{
  public title:string;
  public score: number;
  public visible: boolean;
  public options: dOption[] = [];
  public answer: number=0;
  public parent: string | undefined;
  constructor(node: ChildNode, visible:boolean, parent: string | undefined = undefined){
    this.title = getText(seletChildbyName(node, 'title'), 0);
    this.score = parseInt(getText(seletChildbyName(node, 'score'),0));
    this.visible = visible; 
    this.parent = parent;
    let answers = seletChildbyName(node, 'answers')[0];
    let ops = seletChildbyName(answers, 'answer');
    for(let op_index in ops){
      let factor:string = getText(seletChildbyName(ops[parseInt(op_index)], 'factor'), 0);
      let op_text:string = getText(seletChildbyName(ops[parseInt(op_index)], 'value'), 0);
      let op : dOption = new dOption(op_text, this.title[0]+op_text[0]+op_index, Number(factor)*this.score);
      this.options.push(op);
    }
  }
}

function seletChildbyName(node: ChildNode, name: string){
  let ret:ChildNode[]=[];
  if(node === undefined) return ret;
  else{
    for(let i in node.childNodes){
      if(node.childNodes[i].nodeName === name){
          ret.push(node.childNodes[i])
      }
    }
    
    return ret
  }
}



function getText(node: ChildNode[] | undefined | null, index: number){
  if (node?.length && node.length > index) {
    let tmp=node[index].textContent
    if(tmp) return tmp
    else return ''
  }
  else return ''
}



export default {
  name: 'App',
  components: {
    HelloWorld,
    Question
  },

  setup(){
    const addSubQuestion = (qnode: ChildNode)=>{
      let q_prx = getText(seletChildbyName(qnode, 'title'), 0);
      let t_ans= seletChildbyName(qnode, 'answers')[0];
      let answers = seletChildbyName(t_ans, 'answer');
      console.log(answers);
      for(let i_an = 0; i_an < answers.length; i_an++){
        let a_prx = getText(seletChildbyName(answers[i_an], 'value'),0);
        let questions = seletChildbyName(answers[i_an], 'sub_questions');
        let qlist = seletChildbyName(questions[0], 'question')
        for(let j=0; j < qlist.length; j++){
          state.questions.push(new qData(qlist[j], false, q_prx[0]+a_prx[0]+i_an))
          addSubQuestion(qlist[j])
        }
      }
    }

    const setSubQuestionVisible = (questions: Array<qData>, parent: string, visible:boolean)=>{
      let ret = new Array<qData>();
      for(let i of questions){
        if (i.parent && i.parent === parent){
          i.visible = visible
        }
      }
    }

    const state = reactive({
      title:"",
      questions: new Array<qData>(),
    });
    let dataReady = ref(false);


    const opHandle = (p: {newValue: dOption, oldValue: dOption})=>{
      if(p.newValue && p.newValue.target){
        setSubQuestionVisible(state.questions, p.newValue.target, true)
      }
      if(p.oldValue && p.oldValue.target){
        setSubQuestionVisible(state.questions, p.oldValue.target, false)
      }
    }

    onBeforeMount(async ()=>{
    const myreq = await axios.get('./data/example.xml', {headers:{"Content-Type": "application/xml; charset=utf-8"}});
    if(myreq.status==200){
    const parser = new DOMParser();
    const oDOM = parser.parseFromString(myreq.data, "application/xml");
    console.log(oDOM.childNodes[0]);
    // console.log(oDOM)
    const root = oDOM.childNodes[0];
    const questions =seletChildbyName(root, 'questions');
    const qlist= seletChildbyName(questions[0], 'question');
    // state.title = seletChildbyName(root, 'name')[0].firstChild.nodeValue!;
    state.title = getText(seletChildbyName(root, 'name'), 0);

    console.log(state.title);
    console.log(questions);
    for(let i of qlist){
      state.questions.push(new qData(i, true))
      addSubQuestion(i)
      
    }
    console.log(state.questions);
    
    }
    });

    return {...toRefs(state), opHandle};
  }
}
</script>

