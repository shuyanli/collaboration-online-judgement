var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECONDS = 3600;


module.exports = function (io) {
    var collaborations = {}; //(sessionId->('participants' -> socket.id))
    var socketIdToSessionId = {};
    var sessionPath = '/editorSocket';

    io.on("connection", (socket)=>{ //当一个"人"连进来的时候, 这个是个通用方法
        //io.to(socket.id).emit('message', 'this is server, and hello from server'); //todo这里socketid怎么拿到的还是没明白
        //老师说socket.id是自带的
        let sessionId = socket.handshake.query['sessionId'];  //get current session(the problem I'm working on)
        socketIdToSessionId[socket.id] = sessionId;



        if (sessionId in collaborations) {
            console.log('there are other coders coding this problem!');

            console.log('finishing loading coders')
            collaborations[sessionId].participants.push(socket.id);
            let participants = collaborations[sessionId].participants;
            for (var i = 0; i < participants.length; i++) {
                console.log('counting!!!!');
                io.to(participants[i]).emit("coderChange", participants);
            }
        }else{  //first people in this session
            console.log('new session id: ' + sessionId);
            redisClient.get(sessionPath+'/'+sessionId, (data)=>{
                if (data) {
                    //data exist, load data from redis
                    console.log("session terminated previously, get back from redis");
                    collaborations[sessionId] = {
                        'participants' : [],
                        'cachedInstructions': JSON.parse(data)//TODO看看存的时候存什么数据类型
                    }
                } else{
                    //a brand new session
                    console.log('creating new session');
                    collaborations[sessionId] = {
                        'participants' : [],
                        'cachedInstructions' : []
                    }
                }
                collaborations[sessionId]['participants'].push(socket.id);//这句话两个condition都要加,后面refactor一下
                io.to(socket.id).emit("coderChange", socket.id);
            })

        }


        socket.on('change', delta =>{
            console.log( 'change happend to :' + socketIdToSessionId[socket.id] + ' :'+ delta);

            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];//等用于collaborations[sessionId].participants
                for (let i = 0; i < participants.length; i++) {
                    if (participants[i] != socket.id) {
                        io.to(participants[i]).emit("change", delta);//customized event "change"
                    }
                }
                collaborations[sessionId].cachedInstructions.push(["change", delta, Date.now()]);//TODO: important注意这里push的是一个object
            } else{
                console.log('warning: why there is no session found??? should not see this');
            }
        });

        socket.on('restoreBuffer', ()=>{
            console.log('restoring data from buffer');
            let sessionId = socketIdToSessionId[socket.id];
            console.log('restore buffer for session: ' + sessionId, 'socket id:' + socket.id);
            if (sessionId in collaborations) {
                //let instructions = collaborations[sessionId].cachedInstructions;
                console.log('this is a session before, restoring');
                let instructions = collaborations[sessionId]['cachedInstructions'];

                for (let i = 0; i < instructions.length; i++) {
                    console.log(instructions[i]);
                    socket.emit(instructions[i][0], instructions[i][1]);//发送给当前的"自己"
                    // instructions[i][0]: change
                    // instructions[i][1]: change value (delta)
                }
            }else{
                console.log('there is no data in this session');
            }

        });

        socket.on('disconnect', () => {  //disconnect event is a default event in socket.io server side
            let sessionId = socketIdToSessionId[socket.id];
            console.log('disconnect session' + sessionId, 'socket id:' + socket.id);
            var foundAndDelete = false;

            if (sessionId in collaborations) {
                let participants = collaborations[sessionId].participants;
                let index = participants.indexOf(socket.id);
                if (index >= 0) { //found the quiting people
                    participants.splice(index, 1);
                    foundAndDelete = true;
                    if (participants.length == 0) {
                        console.log('last participant iin collaboration, committing to redis and remove from memory');
                        let key = sessionPath + '/' + sessionId;
                        let value = JSON.stringify(collaborations[sessionId].cachedInstructions);
                        redisClient.set(key, value, redisClient.redisPrint);
                        redisClient.expire(key, TIMEOUT_IN_SECONDS);
                        delete collaborations[sessionId];
                    }
                }

                for (var i = 0; i < participants.length; i++) {
                    io.to(participants[i]).emit("coderChange", participants);
                }

            }
            if (!foundAndDelete) {
                console.log('Warning: could not find the socket.id in collaborations');
            }

        });
    });
};


//对于object, obj.a 等用于obj["a"]