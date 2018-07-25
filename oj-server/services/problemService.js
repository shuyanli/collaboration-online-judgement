

const ProblemModel = require('../models/problemModel');// problemModel连上了mondoDB的collaction

const getProblems = function () {
    return new Promise((resolve, reject) => {
        ProblemModel.find({}, function (err, problems) {
            if (err) {
                reject(err);
            } else{
                resolve(problems);
            }
        });
    });
};

const getProblem = function (id) {    //这里的problem和上面的problems是mongoDB传回来的数据
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({id:id}, function (err, problem) {
            if (err) {
                reject(err);
            } else{
                resolve(problem);
            }
        });
    });

};

const addProblem = function (newProblem) {
    return new Promise((resolve, reject) => {
        ProblemModel.findOne({name: newProblem.name}, (err, data) => {
            if (data)  {
                reject('problem exists!!!');
            } else{
                ProblemModel.count({}, (err, count) => {
                    newProblem.id = count+1;
                    const mongoProblem = new ProblemModel(newProblem);
                    mongoProblem.save();
                    resolve(mongoProblem);
                    //this.getProblems();  //todo 这么写为什么不都返回来
                    console.log('new problem added');
                });
            }
        })
    });
};

// 这种方法写找不到名字也不会报错,很神奇
// const modifyProblem = function(modifiedProblem) {
//     return new Promise( (resolve, reject)=>{
//         ProblemModel.update({name: modifiedProblem.name}, modifiedProblem,(err, data)=>{
//             if (!data) {
//                 reject('cannot find this problem!')
//             }else{
//                 resolve(data);
//             }
//         } )
//     })
//}
 const modifyProblem = function(modifiedProblem) {
     return new Promise( (resolve, reject)=>{
         ProblemModel.findOne({name: modifiedProblem.name}, (err, data)=>{
             if (!data) {
                 reject('this problem does not exit, cannot modify')
             }else{
                 ProblemModel.update({name: modifiedProblem.name}, modifiedProblem,(err, data)=>{
                     if (err) {
                         reject('modification fail!')
                     }else{
                         resolve(data);
                     }
                 })
             }

         })
     })
 }

module.exports = {
    getProblems,
    getProblem,
    addProblem,
    modifyProblem
}