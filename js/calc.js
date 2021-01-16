function GradeToScore(str){
    switch (str){
        case "A+":
            return 4.3;
        case "A":
            return 4.0;
        case "A-":
            return 3.7;
        case "B+":
            return 3.3;
        case "B":
            return 3.0;
        case "B-":
            return 2.7;
        case "C+":
            return 2.3;
        case "C":
            return 2.0;
        case "D":
            return 1.0;
        case "D-":
            return 0.7;
        case "F":
            return 0;
    }
}

function ScoreToGrade(str){
    switch (str){
        case 4.3:
            return "A+";
        case 4.0:
            return "A";
        case 3.7:
            return "A-";
        case 3.3:
            return "B+";
        case 3.0:
            return "B";
        case 2.7:
            return "B-";
        case 2.3:
            return "C+";
        case 2.0:
            return "C";
        case 1.0:
            return "D";
        case 0.7:
            return "D-";
        case 0:
            return "F";
    }
}

function FacultyGenreToJapanies(str){
    switch (str){
        case "humanities":
            return "文系学部";
        case "science":
            return "医学部を除く理系学部";
        case "medicine":
            return "医学部医学科";
        case "health3":
            return "医学部保健学科(放・検・理)";
        case "health2":
            return "医学部保健学科(看・作)";
    }
}

function LectureGenreToJapanies(str){
    switch (str){
        case "0":
            return "フレセミ";
        case "1":
            return "総合科目";
        case "2":
            return "主題別科目";
        case "3":
            return "外国語科目";
        case "4":
            return "外国語演習";
        case "5":
            return "共通科目";
        case "6":
            return "基礎科目";
    }
}

function getPointNumber(num,point) {
	if (num.indexOf(".") < 0) num += "."; 
	var s = num.split("."); 
	s[1] = s[1] + repeatText("0",point); 
	return s[0] + "." + s[1].substr(0,point);
}

function repeatText(s,num) {
	var t,n;
	t = "";
	for (n=0;n<num;n++) {
		t += s;
	}
	return t;
}

class CalcMoveScore{

    constructor(datas){
        this.datas = datas;
        this.sumscore = 0;
        this.unit = 0;
        this.history = [];
        this.needLecture = [];
    }

    // category str, maxunit int ,datas list
    CalcIndependence({maxunit = null, category = null, datas = null, delete_data = null, 
        needLectureInfo = {}, }){
        let unit = 0;
        let usedLecture = [];

        if (datas == null){
            datas = this.datas[category];
        }

        // deep copy
        datas = JSON.parse(JSON.stringify(datas));

        if (delete_data != null){
            datas = datas.filter(n => delete_data.indexOf(n.lecturename) == -1)
        }
        
        datas.sort(function (a, b) {
            return a.grade - b.grade;
        });
        
        datas.reverse().forEach(el => {
            if (unit==maxunit){
                return;
            }
            console.log(el.lecturename,el.grade)
            if (el.unit==2){
                if (unit+2<=maxunit){
                    unit+=2;
                    this.sumscore+=el.grade*2;
                    usedLecture.push(el);
                    datas = datas.filter(n => n !== el);
                }else{
                    unit++;
                    this.sumscore+=el.grade;
                    datas = datas.filter(n => n !== el);
                    el.unit = 1;
                    usedLecture.push(JSON.parse(JSON.stringify(el)));
                    datas.push(JSON.parse(JSON.stringify(el)));
                }
            }else{
                unit++;
                this.sumscore+=el.grade;
                usedLecture.push(el);
                datas = datas.filter(n => n !== el);
            }
        });
        
        usedLecture.forEach(item => {
            // item.grade = ScoreToGrade(item.grade) + "/" + item.grade.toString();
            item.grade = ScoreToGrade(item.grade);
        });

        this.history = this.history.concat(usedLecture);
        this.unit += unit;
        if (category!=null ){
            this.needLecture.push({"genre":LectureGenreToJapanies(category),"needunit":maxunit-unit});
        }else if(datas!=null){
            this.needLecture.push({"genre":needLectureInfo["name"],"needunit":maxunit-unit});
        }
        return {
            "others":datas,
        }
    }

    // category_list list , detail_list [{{"maxunit":int,"lecture":[]}},...] , maxunit : int
    CalcDependence({category_list=null, detail_list=[], maxunit=null, delete_data = null}){
        let datas = [];
        let others = [];
        let categoryNames = [];

        category_list.forEach(category => {
            datas = datas.concat(this.datas[category]);
            categoryNames.push(LectureGenreToJapanies(category));
        });

        // deep copy
        datas = JSON.parse(JSON.stringify(datas));

        if (delete_data != null){
            datas = datas.filter(n => delete_data.indexOf(n.lecturename) == -1);
        }

        detail_list.forEach(detail => {
            let passLecture = [];
            let maxunitsub = detail["maxunit"];
            let needLectureNames = detail["lecture"];
            maxunit -= maxunitsub;
            datas.forEach(data => {
                if (detail["lecture"].indexOf(data.lecturename) !== -1){
                    passLecture = passLecture.concat(datas.filter(n => n == data));
                    datas = datas.filter(n => n !== data);
                }
            });
            let byproduct = this.CalcIndependence({maxunit : maxunitsub, datas : passLecture,
                needLectureInfo : {"name":needLectureNames.join(" / ")}});
            others = others.concat(byproduct["others"]);
        });
        

        others = others.concat(datas);
        this.CalcIndependence({maxunit : maxunit, datas : others, 
            needLectureInfo : {"name":categoryNames.join("/") + " (自由)"}});
    }

    calc_ms_minunit(){
        if (this.unit==0){
            return {
                "ms" : "0.0000",
                "unit" : 0,
            }
        }
        return {
            "ms" : getPointNumber((this.sumscore/this.unit).toString(),4),
            "unit" : this.unit,
        }
    }

    calc_ms_maxunit(maxunit){
        return {
            "ms" : getPointNumber((this.sumscore/maxunit).toString(),4),
            "unit" : maxunit,
        }
    }
}