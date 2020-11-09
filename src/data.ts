export class dOption{
    public value: number;
    public text: string;
    public target: string;
    public checked: boolean;
    constructor(text:string, name:string, value: number){
        this.value = value;
        this.text = text;
        this.target =name;
        this.checked = false;
    }
}

export class dQuestion{
    public visible: boolean;
    public title: string;
    public options: [];
    public name: string;
    public score: Number;
    constructor(){
        this.visible=false;
        this.title=''
        this.options=[]
        this.name=''
        this.score=0
    }
}
