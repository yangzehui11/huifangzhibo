'use strict'
const fs = require('fs'); // 载入fs模块
const readline = require('readline');//每次读取一行数据
const WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8090})

let wordArr = ['Monkey', 'Dog', 'Bear', 'Flower', 'Girl']
let startTime=0;//开始录课的时间
//let luX;//录课设备的长
//let luY;//录课设备的宽
wss.on('connection', function(ws) {
    console.log('connected.')
    let arr=[];

    let keyWord = ((arr) => {
            let num = Math.floor(Math.random()*arr.length)
            return arr[num]
        })(wordArr)

    ws.on('message', function(message) {
        console.log('======')
        console.log('received: %s', message)
        if (message == keyWord) {
            console.log('correct')
            wss.clients.forEach((client) => {
                client.send('答对了！！')
            })
        } else if(message == 'h'){
            let rl = readline.createInterface({
                input:fs.createReadStream('./9.241.txt')
            });
            /*let times//开始播放的时间
            let t=0;//多少秒后显示*/
            rl.on('line',(line)=>{
                /*let lin=line.split(';')
                let lines=lin[0];
                if(lines[0]=='time'){
                    t=parseInt(lines[1])
                }*/
                wss.clients.forEach((client) => {
                    console.log(line)
                    client.send(line)
                })
            });

        } else {
            //arr.push(message)
            if(message.split(':')[0]=='start'){
                startTime=new Date().getTime()
                //luX=message.split('.')[0]
                //luY=message.split('.')[1]

                fs.writeFile('./9.241.txt', message+'\r\n', { 'flag': 'a' }, function(err) {
                    if (err) {
                        throw err;
                    }
                })
            }

            if (message.split(':')[0]=='write'){
                console.log(message)
                const time = new Date().getTime()
                let xys=message.split(':')[1].split(',')
                xys.forEach(xy=>{
                    let xyArr=xy.split('.')
                    xyArr[0]/luX
                })

                fs.readFile('test1.json','utf8',function (err, data) {
                    if(err) console.log(err);
                    var test1=JSON.parse(data);
                    test1.data.push()
                    var t = JSON.stringify(test1);
                    fs.writeFileSync('test1.json',t)
                });


                fs.writeFile('./9.241.txt', message+';'+(time-startTime)+'\r\n', { 'flag': 'a' }, function(err) {
                    if (err) {
                        throw err;
                    }
                })
            }

            if (message.split(':')[0]=='clear'){
                const time = new Date().getTime()
                fs.writeFile('./9.241.txt', message+':'+(time-startTime)+'\r\n', { 'flag': 'a' }, function(err) {
                    if (err) {
                        throw err;
                    }
                })
            }

            wss.clients.forEach((client) => {
                client.send(message)
            })
        }
    })

    async function sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    wss.clients.forEach((client) => {
        client.send('keyword:' + keyWord)
    })
})
