const express = require('express');
const router = express.Router();

const problemService = require('../services/problemService');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// for server to call the RESTful API
const nodeRestClient = require('node-rest-client').Client;
const restClient = new nodeRestClient();

// Python Flask server listen on port 5000 by default
const EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';
restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');

router.get('/problems', function(req, res){
    problemService.getProblems()
        .then(problems => res.json(problems));  //todo: 这里为什么不用res而用problems?
});                                // ans: 这个problems或者说任何我们定义的参数就是promise resolve回来的东西,
   //后面post也给了例子如果reject我么就用error来写,我认为是参数位置决定是哪一个的, .then后面第一个就是回来的resolve,
   //如果跟了第二个就表示是个reject, 至于变量名字是error还是err都是我们自己定的

router.get('/problems/:id', function (req, res) {  //这里的problem和上面的problems还没搞明白从哪来的
    var id = req.params.id;
    problemService.getProblem(+id)
        .then(problem =>res.json(problem));
});

router.post('/problems', jsonParser, function(req, res) {
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem);
        }, (error) => {
            res.status(400).send('problem already exist!');
        });
});

router.put('/problems', jsonParser, (req, res)=>{
    problemService.modifyProblem(req.body)
        .then( problem =>{
            res.json(problem);
        }, (error)=>{
            console.log("error is: "+error);
            res.status(404).send('cannot find this problem name')
        });
})
//接收到dataservice发送过来的data以后, 通过12-13行的注册,将node作为client, 向5000端口的python服务器发送一个post
//todo: 这个方程的功能理解了,但是后面这个实际实现buildandrun的方程的写法好诡异
router.post('/build_and_run', jsonParser, (req, res)=>{
    const userCode = req.body.code;
    const lang = req.body.lang;
    console.log('lang:', lang, 'code:', userCode);

    restClient.methods.build_and_run(
        {
            data: {code:userCode, lang:lang},
            headers: {'Content-Type': 'application/json'}
        },
        (data, response)=>{
            // response: raw data, data: parsed response
            //${}的作用是在string里面传入parameter
            const text = `Build output: ${data['build']}, execute output: ${data['run']} `;
            res.json(text);
        }
    )
});



module.exports = router;

