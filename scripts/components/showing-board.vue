<template>
    <canvas id="showing" width="1000" height="600" style="border: 1px solid #999;"></canvas>
    <div id="answer-box">
        <span>: </span>
        <input id="answer" type="text">
        <button id="submit">回放</button>
        <button id="zhibo">观看直播</button>
    </div>
</template>

<script>
    'use strict'
    export default {
        ready() {
            const ws = new WebSocket('ws://localhost:8090');
            const canvas = document.getElementById('showing')
            const cxt = canvas.getContext('2d')
            let luX;//录制时的屏幕长
            let luY;//录制时屏幕的宽
            let boX=1000;//播放时的屏幕长
            let boY=600;//播放时屏幕的宽
            let biliX;
            let biliY;
            let moveToSwitch = 1
            ws.onmessage = (msg) => {

                let m = msg.data.split(':')

                if(m[0]=='start'){
                    const fenbianlv = m[1].split('.')
                    luX=fenbianlv[0]
                    luY=fenbianlv[1]
                    biliX=boX/luX;
                    biliY=boY/luY;
                }
                console.log(m[1])
                const zuobiaoAndTime = m[1].split(';')
                if(zuobiaoAndTime[1]){
                    console.log('延时了'+zuobiaoAndTime[1])
                    //延时执行
                    setTimeout(hua,zuobiaoAndTime[1])
                }else{
                    hua()
                }


                function hua () {
                    let yibi = zuobiaoAndTime[0].split(',')
                    for (let i = 0; i <yibi.length ; i++) {
                        let pathObj = yibi[i].split('.')
                        cxt.strokeStyle = "#000"

                        if (yibi.length == i) {//停止
                            cxt.beginPath()
                            cxt.moveTo(Math.ceil(biliX*pathObj[0]), Math.ceil(biliY*pathObj[1]))
                        } else if (moveToSwitch && yibi[i] == 'clear') {
                            cxt.clearRect(0, 0, 500, 500)
                        }

                        if(i==0&&pathObj.length==2){
                            cxt.beginPath()//开始一条新线
                            cxt.moveTo(Math.ceil(biliX*pathObj[0]), Math.ceil(biliY*pathObj[1]))
                            console.log("开始了一条新线")
                        }else if(i>0&&pathObj.length==2) {
                            console.log('原来的线')
                            cxt.lineTo(Math.ceil(biliX*pathObj[0]), Math.ceil(biliY*pathObj[1]))
                        }
                    }
                    cxt.stroke()//连线
                }


            }

            ws.onopen = () => {
                let submitBtn = document.getElementById('submit')
                submitBtn.onclick = () => {
                    let keyword = document.getElementById('answer').value
                    ws.send('h')
                }
                document.getElementById('zhibo').onclick= () => {
                    ws.send('zb')
                }
            }
        }

    }
</script>

<style lang="less">
    #showing {
        background: lightblue;
    }
    #answer-box {
        margin: 10px 0;
    }
</style>
