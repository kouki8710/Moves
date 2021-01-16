Vue.component("lecture-list-fixed",{
    props : {
        "lecturename":String,
        "unit":String,
        "category" : String,
    },
    data : function () {
        return {
            "grade" : "-",
        }
    },
    template : `
    <div class="lecture-list-fixed">
        <div class="lecture-list-name">
            <p>{{lecturename}}</p>
        </div>
        <div class="lecture-list-flex">
            <p>単位</p>
            <div class="lecture-list-unit">
                <p>{{unit}}</p>
            </div>
            <p>成績</p>
            <div class="lecture-list-grade">
                <select name="grade" v-model="grade">
                    <option value="-">-</option>
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="D-">D-</option>
                    <option value="F">F</option>
                </select>
            </div>
        </div>
    </div>
    `,
});

Vue.component("show-history",{
    props : ["lecturename","unit","grade"],
    template : `
    <div class="lecture-list-fixed">
        <div class="lecture-list-name">
            <p>{{lecturename}}</p>
        </div>
        <div class="lecture-list-flex">
            <p>単位</p>
            <div class="lecture-list-unit">
                <p>{{unit}}</p>
            </div>
            <p>成績</p>
            <div class="lecture-list-grade lecture-list-showhistory">
                <p>{{grade}}</p>
            </div>
        </div>
    </div>
    `,
});

Vue.component("show-needlecture",{
    props : ["genre","needunit"],
    template : `
    <div class="lecture-list-fixed needlecture-fixed">
        <div class="lecture-list-name needlecture-name">
            <p>{{genre}}</p>
        </div>
        <div class="lecture-list-flex needlecture-flex">
            <p>必要単位</p>
            <div class="lecture-list-unit needlecture-unit">
                <p>{{needunit}}</p>
            </div>
        </div>
    </div>
    `,
})

Vue.component("btn-add",{
    props : {
        addlecturedata : Object,
    },
    template : `<button class="puls" v-on:click="clickEvent">追加</button>`,
    methods : {
        clickEvent : function(){
            this.$emit('from-btnadd',this.addlecturedata);
        },
    }
})

//main
let main = new Vue({
    el : ".main",
    data : {
        seen : true,
        isActive : "2",
        showpop : false,
        genreselected : "",
        genreselected_japanese : "選択されていません",
        history : [],
        needLecture : [],
        addData : {
            "category" : "",
            "addLectureList" : [],
        }, 
        addLecture : {"lecturename":"","unit":"1"},
        humanities : {ms : 0, unit : 0},
        science : {ms : 0, unit : 0},
        medician : {ms : 0, unit : 0},
        health3 : {ms : 0, unit : 0},
        health2 : {ms : 0, unit : 0},
        msInfo : {},
        hure : [{"lecturename":"フレセミ","unit":"2"}],
        sougou : [{"lecturename":"総合科目","unit":"2"},],
        syudai : [
            {"lecturename":"主題別科目","unit":"2"},
            {"lecturename":"主題別科目","unit":"2"},
            {"lecturename":"主題別科目","unit":"2"},
            {"lecturename":"主題別科目","unit":"2"},
        ],
        gaikamo : [
            {"lecturename":"英語Ⅰ","unit":"1"},
            {"lecturename":"英語Ⅱ","unit":"1"},
            {"lecturename":"第２外国語Ⅰ","unit":"2"},
            {"lecturename":"第２外国語Ⅱ","unit":"2"},
        ],
        gaien : [
            {"lecturename":"英語技能別演習","unit":"2"},
            {"lecturename":"外国語演習(技能別を除く)","unit":"2"},
            {"lecturename":"外国語演習(技能別を除く)","unit":"2"},
        ],
        kyoutuu : [
            {"lecturename":"体育学Ａ","unit":"1"},
            {"lecturename":"体育学Ｂ","unit":"2"},
            {"lecturename":"情報学Ⅰ","unit":"2"},
            {"lecturename":"情報学Ⅱ","unit":"2"},
            {"lecturename":"情報学Ⅱ(Python)","unit":"2"},
            {"lecturename":"統計学","unit":"2"},
        ],
        kiso : [
            {"lecturename":"人文・社会科学の基礎","unit":"2"},
            {"lecturename":"人文・社会科学の基礎","unit":"2"},
            {"lecturename":"入門線形代数学","unit":"2"},
            {"lecturename":"入門微分積分学","unit":"2"},
            {"lecturename":"線形代数学Ⅰ","unit":"2"},
            {"lecturename":"線形代数学Ⅱ","unit":"2"},
            {"lecturename":"微分積分学Ⅰ","unit":"2"},
            {"lecturename":"微分積分学Ⅱ","unit":"2"},
            {"lecturename":"物理学Ⅰ","unit":"2"},
            {"lecturename":"物理学Ⅱ","unit":"2"},
            {"lecturename":"化学Ⅰ","unit":"2"},
            {"lecturename":"化学Ⅱ","unit":"2"},
            {"lecturename":"生物学Ⅰ","unit":"2"},
            {"lecturename":"生物学Ⅱ","unit":"2"},
            {"lecturename":"地球惑星科学Ⅰ","unit":"2"},
            {"lecturename":"地球惑星科学Ⅱ","unit":"2"},
            {"lecturename":"心理学実験","unit":"2"},
            {"lecturename":"自然科学実験","unit":"2"},
        ],
    },
    methods : {
        seenchange : function(){
            this.seen = !this.seen;
            this.genreselected = "";
            this.history = [];
            this.needLecture = [];
            this.isActive = "2";
            this.genreselected_japanese = "選択されていません";
            scrollTo(0,0);
        },
        tabchange : function(num){
            if (this.isActive == num){
                return;
            }
            this.genreselected = "";
            this.history = [];
            this.needLecture = [];
            this.isActive = num;
            this.genreselected_japanese = "選択されていません";
            if (num=="1"){
                CalcPartMS(this.msInfo);
            }else if(num=="2"){
                CalcAllMS(this.msInfo);
            }
        },
        calcmoves : function(){
                    `
            0 フレセミ
            1 総合科目
            2 主題別
            3 外国語科目
            4 外国語演習
            5 共通科目
            6 基礎科目
            `

            let datas = {
                "0" : [],
                "1" : [],
                "2" : [],
                "3" : [],
                "4" : [],
                "5" : [],
                "6" : [],
            };
            main.$children.forEach(child => {
                if (!child.grade || child.grade=="-"){
                    return;
                }
                if (child.category == undefined){
                    return;
                }
                let data = {
                    "lecturename" : child.lecturename,
                    "unit" : child.unit,
                    "grade" : GradeToScore(child.grade) ,
                }
                datas[child.category].push(data);
            });
            this.msInfo["humanities"] = CalcHumanities(datas);
            this.msInfo["science"] = CalcScience(datas);
            this.msInfo["medicine"] = CalcMedician(datas);
            this.msInfo["health3"] = CalcHealth3(datas);
            this.msInfo["health2"] = CalcHealth2(datas);
            CalcAllMS(this.msInfo);
            main.seen = false;
            scrollTo(0,0);
        },
        showhistory : function(genre){
            if (genre==this.genreselected){
                this.genreselected = "";
                this.genreselected_japanese = "選択されていません";
                this.history = [];
                this.needLecture = [];
                return;
            }
            this.genreselected = genre;
            this.genreselected_japanese = FacultyGenreToJapanies(genre);
            this.history = this.msInfo[genre].history;
            this.needLecture = this.msInfo[genre].needLecture.filter(n => n.needunit!=0);
        },
        showModal : function(eventargs,index){
            this.addData.addLectureList = [];
            this.addData.addLectureList = this.addData.addLectureList.concat(eventargs.lecture);
            if (this.addData.addLectureList){
                this.addLecture.lecturename = this.addData.addLectureList[0];
            }
            this.addData.category = eventargs.category;
            this.showpop= !this.showpop;
        },
        closeModal : function(){
            this.showpop = !this.showpop;
            this.addLecture.unit = "1";
        },
        addNewLecture : function(){
            if (!this.addLecture.lecturename || !this.addLecture.unit){
                return;
            }
            //deepcopy
            addLecture_copy = JSON.parse(JSON.stringify(this.addLecture));
            this[this.addData.category].push(addLecture_copy);
            this.showpop = !this.showpop;
            this.addLecture.lecturename = "";
            this.addLecture.unit = "1";
        }
    }
});


function CalcHumanities(datas){
    let ms = new CalcMoveScore(datas);
    //フレセミ・総合
    ms.CalcDependence({category_list : ["0","1"], maxunit : 4});
    //主題別
    ms.CalcIndependence({maxunit : 8,category : "2"});
    //外国語
    let foreign_info = [{
        "maxunit":6,
        "lecture":["英語Ⅰ","英語Ⅱ","第２外国語Ⅰ","第２外国語Ⅱ","英語技能別演習"],
    }]
    ms.CalcDependence({category_list : ["3","4"], detail_list : foreign_info, maxunit : 12});
    //共通科目・基礎科目
    let same_fund_info = [{
        "maxunit" : 4,
        "lecture" : ["人文・社会科学の基礎"],
    }] 
    ms.CalcDependence({category_list : ["5","6"], detail_list : same_fund_info, maxunit : 8});
    return ms;
}

function CalcScience(datas){
    let ms = new CalcMoveScore(datas);
    //フレセミ・総合
    ms.CalcDependence({category_list : ["0","1"], maxunit : 2});
    //主題別
    ms.CalcIndependence({maxunit : 4,category : "2"});
    //外国語
    let foreign_info = [{
        "maxunit":6,
        "lecture":["英語Ⅰ","英語Ⅱ","第２外国語Ⅰ","第２外国語Ⅱ","英語技能別演習"],
    }]
    ms.CalcDependence({category_list : ["3","4"], detail_list : foreign_info, maxunit : 8});
    //共通科目
    ms.CalcIndependence({maxunit:4,category : "5"});
    //基礎科目
    let fundamental_info = [
        {
            "maxunit":4,
            "lecture":["線形代数学Ⅰ","線形代数学Ⅱ","微分積分学Ⅱ","微分積分学Ⅰ"],
        },
        {
            "maxunit":4,
            "lecture":["物理学Ⅰ","物理学Ⅱ"],
        },
        {
            "maxunit":4,
            "lecture":["化学Ⅰ","化学Ⅱ"],
        },
        {
            "maxunit":2,
            "lecture":["生物学Ⅰ","生物学Ⅱ"],
        },
        {
            "maxunit":2,
            "lecture":["自然科学実験"],
        }
    ]
    delete_data = ["入門線形代数学","入門微分積分学"]; 
    ms.CalcDependence({category_list:["6"],detail_list:fundamental_info,maxunit:20,delete_data:delete_data});
    return ms;
}

function CalcMedician(datas){
    let ms = new CalcMoveScore(datas);
    //フレセミ
    ms.CalcIndependence({maxunit : 2,category : "0"});
    //主題別
    ms.CalcIndependence({maxunit : 4,category : "2"});
    //外国語
    let foreign_info = [{
        "maxunit":6,
        "lecture":["英語Ⅰ","英語Ⅱ","第２外国語Ⅰ","第２外国語Ⅱ","英語技能別演習"],
    }]
    ms.CalcDependence({category_list : ["3","4"], detail_list : foreign_info, maxunit : 8});
    //共通科目
    ms.CalcIndependence({maxunit:4,category : "5"});
    //基礎科目
    let fundamental_info = [
        {
            "maxunit":4,
            "lecture":["物理学Ⅰ","物理学Ⅱ"],
        },
        {
            "maxunit":4,
            "lecture":["化学Ⅰ","化学Ⅱ"],
        },
        {
            "maxunit":4,
            "lecture":["生物学Ⅰ","生物学Ⅱ"],
        },
        {
            "maxunit":2,
            "lecture":["自然科学実験"],
        }
    ]
    delete_data = ["入門線形代数学","入門微分積分学"]; 
    ms.CalcDependence({category_list:["6"],detail_list:fundamental_info,maxunit:20,delete_data:delete_data});
    return ms;
}

function CalcHealth3(datas){
    let ms = new CalcMoveScore(datas);
    //フレセミ・総合科目
    ms.CalcDependence({category_list : ["0","1"], maxunit : 2});
    //主題別
    ms.CalcIndependence({maxunit : 4,category : "2"});
    //外国語
    let foreign_info = [{
        "maxunit":6,
        "lecture":["英語Ⅰ","英語Ⅱ","第２外国語Ⅰ","第２外国語Ⅱ","英語技能別演習"],
    }]
    ms.CalcDependence({category_list : ["3","4"], detail_list : foreign_info, maxunit : 8});
    //共通科目
    ms.CalcIndependence({maxunit:4,category : "5"});
    //基礎科目
    let fundamental_info = [
        {
            "maxunit":2,
            "lecture":["自然科学実験"],
        }
    ]
    delete_data = ["入門線形代数学","入門微分積分学"]; 
    ms.CalcDependence({category_list:["6"],detail_list:fundamental_info,maxunit:14,delete_data:delete_data});
    return ms;
}

function CalcHealth2(datas){
    let ms = new CalcMoveScore(datas);
    //フレセミ・総合科目
    ms.CalcDependence({category_list : ["0","1"], maxunit : 2});
    //主題別
    ms.CalcIndependence({maxunit : 4,category : "2"});
    //外国語
    let foreign_info = [{
        "maxunit":6,
        "lecture":["英語Ⅰ","英語Ⅱ","第２外国語Ⅰ","第２外国語Ⅱ","英語技能別演習"],
    }]
    ms.CalcDependence({category_list : ["3","4"], detail_list : foreign_info, maxunit : 8});
    //共通科目
    ms.CalcIndependence({maxunit:4,category : "5"});
    //基礎科目
    let fundamental_info = [
        {
            "maxunit":2,
            "lecture":["自然科学実験"],
        }
    ]
    ms.CalcDependence({category_list:["6"],detail_list:fundamental_info,maxunit:14});
    return ms;
}

function CalcPartMS(msInfo){

    main.humanities.ms = msInfo["humanities"].calc_ms_minunit()["ms"];
    main.science.ms = msInfo["science"].calc_ms_minunit()["ms"];
    main.medician.ms = msInfo["medicine"].calc_ms_minunit()["ms"];
    main.health3.ms = msInfo["health3"].calc_ms_minunit()["ms"];
    main.health2.ms = msInfo["health2"].calc_ms_minunit()["ms"];

    main.humanities.unit = msInfo["humanities"].calc_ms_minunit()["unit"];
    main.science.unit = msInfo["science"].calc_ms_minunit()["unit"];
    main.medician.unit = msInfo["medicine"].calc_ms_minunit()["unit"];
    main.health3.unit = msInfo["health3"].calc_ms_minunit()["unit"];
    main.health2.unit = msInfo["health2"].calc_ms_minunit()["unit"];
}

function CalcAllMS(msInfo){
    
    let humanities_maxunit = 32;
    let science_maxunit = 38;
    let medician_maxunit = 38;
    let health_maxunit = 32;

    console.log(msInfo["humanities"]);
    main.humanities.ms = msInfo["humanities"].calc_ms_maxunit(humanities_maxunit)["ms"];
    main.science.ms = msInfo["science"].calc_ms_maxunit(science_maxunit)["ms"];
    main.medician.ms = msInfo["medicine"].calc_ms_maxunit(medician_maxunit)["ms"];
    main.health3.ms = msInfo["health3"].calc_ms_maxunit(health_maxunit)["ms"];
    main.health2.ms = msInfo["health2"].calc_ms_maxunit(health_maxunit)["ms"];
    console.log(main.humanities.ms);

    main.humanities.unit = msInfo["humanities"].calc_ms_maxunit(humanities_maxunit)["unit"];
    main.science.unit = msInfo["science"].calc_ms_maxunit(science_maxunit)["unit"];
    main.medician.unit = msInfo["medicine"].calc_ms_maxunit(medician_maxunit)["unit"];
    main.health3.unit = msInfo["health3"].calc_ms_maxunit(health_maxunit)["unit"];
    main.health2.unit = msInfo["health2"].calc_ms_maxunit(health_maxunit)["unit"];
}


