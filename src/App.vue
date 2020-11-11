<template>
  <div class="container">
    <h1>{{title}}</h1>
    <br/>
    <!-- <HelloWorld msg="Hello Vue 3.0 + Vite" /> -->
    <ul>
      <li v-for="(question, q_index) in questions" :key="q_index" v-show="question.visible" :style="{ paddingLeft: `${question.level*2}rem` }">
        <Question :title="question.title" :options="question.options" :name="question.id" :visible="question.visible" @opUpdate="opHandle"/>
      </li>  
    </ul>
    <h4>
    Score: {{sum_score}}
    </h4>
  </div>
</template>

<script lang="ts">
import {onMounted, onBeforeMount, ref, reactive, toRefs, computed} from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import Question from './components/Question.vue'
import {dOption, dQuestion} from './data'
import axios from 'axios';


function makeid(length:number) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

var qData_index = 0;
var DEFAULT_SCORE = 50;

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
    class qData{
      public title:string;
      public score: number;
      public visible: boolean;
      public options: dOption[] = [];
      public answer: number=0;
      public id:string;
      public parent: string | undefined;
      public level: number;
      constructor(node: ChildNode, level:number = 0, parent: string | undefined = undefined){
        this.title = getText(seletChildbyName(node, 'title'), 0);
        this.score = parseInt(getText(seletChildbyName(node, 'score'),0));
        if(!this.score){
          let l = parent? parent.length-2: 100;
          for(let i=0; i<state.questions.length;i++){
            if(state.questions[i].id === parent?.substr(0, l))
              this.score=state.questions[i].score
          }
          if(!this.score){
            this.score = DEFAULT_SCORE
          }
        }
        this.parent = parent;
        if(parent === undefined) {
          this.id = makeid(4)+qData_index;
          this.level = 0;
          this.visible = true;
        }else{
          this.id = parent;
          this.level = level;
          this.visible = false;
        }
        let answers = seletChildbyName(node, 'answers')[0];
        let ops = seletChildbyName(answers, 'answer');
        qData_index+=1;
        for(let op_index in ops){
          let factor:string = getText(seletChildbyName(ops[parseInt(op_index)], 'factor'), 0);
          let op_text:string = getText(seletChildbyName(ops[parseInt(op_index)], 'value'), 0);
          let op : dOption = new dOption(op_text, this.id+op_index, Number(factor)*this.score);
          this.options.push(op);
        }
      }
    }
    const addSubQuestion = (qnode: ChildNode, parent:string, level: number)=>{
      let q_prx = getText(seletChildbyName(qnode, 'title'), 0);
      let t_ans= seletChildbyName(qnode, 'answers')[0];
      let answers = seletChildbyName(t_ans, 'answer');
      for(let i_an = 0; i_an < answers.length; i_an++){
        // let a_prx = getText(seletChildbyName(answers[i_an], 'value'),0);
        let questions = seletChildbyName(answers[i_an], 'sub_questions');
        let qlist = seletChildbyName(questions[0], 'question')
        for(let j=0; j < qlist.length; j++){
          let tmp = new qData(qlist[j], level+1, parent+i_an+j)
          state.questions.push(tmp)
          addSubQuestion(qlist[j], tmp.id, level+1)
        }
      }
    }

    const setOptions=(questions: Array<qData>, id: string, checked: boolean)=>{
      for(let q in questions){
        if(questions[q].id === id.substr(0, questions[q].id.length)){
          for(let op in questions[q].options){
            if (id === questions[q].options[op].target){
              questions[q].options[op].checked = checked   
            }
          }
        }
      }
    }
    const setSubQuestionVisible = (questions: Array<qData>, parent: string)=>{
      let ret = new Array<qData>();
      let l = parent.length;
      console.log(questions);
      for(let i of questions){
        if (i.parent && i.parent.substring(0, l) === parent && i.parent.length - 1 == l){
          i.visible = true
        }
      }
    }

    const setSubQuestionNotVisible = (questions: Array<qData>, parent: string)=>{
      let ret = new Array<qData>();
      let l = parent.length;
      for(let i of questions){
        if (i.parent && i.parent.substr(0, l) === parent){
          i.visible = false
          for(let op of i.options){
            op.checked = false
          }
        }
      }
    }


    const sumScore=()=>{
      let ret = 0;
      for (let q in state.questions){
        for (let op in state.questions[q].options){
          if(state.questions[q].options[op].checked){
            ret+=state.questions[q].options[op].value;
          }
        }
      }
      return ret
    }

    const state = reactive({
      title:"",
      questions: new Array<qData>(),
      sum_score: computed(sumScore)
    });
    let dataReady = ref(false);


    const opHandle = (p: {newValue: dOption, oldValue: dOption})=>{
      console.log(p);
      if(p.newValue && p.newValue.target){
        setOptions(state.questions, p.newValue.target, true)
        setSubQuestionVisible(state.questions, p.newValue.target)
      }
      if(p.oldValue && p.oldValue.target){
        setOptions(state.questions, p.oldValue.target, false)
        setSubQuestionNotVisible(state.questions, p.oldValue.target)
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

    for(let i of qlist){
      let tmp = new qData(i)
      state.questions.push(tmp)
      addSubQuestion(i, tmp.id, 0)
    }
    console.log(state.questions);
    
    }
    });

    return {...toRefs(state), opHandle};
  }
}
</script>
