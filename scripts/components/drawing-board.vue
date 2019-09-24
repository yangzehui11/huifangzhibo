<template>
    <canvas id="canvas" width=500 height=300 style="border: 1px solid #999;"></canvas>
    <div id="keyword-box">
        <span>Keyword: </span>
        <span id="keyword"></span>
    </div>
    <button id="btn">清空画布</button>
    <div id="answer-box">
        <span>请输入分辨率（500.300）: </span>
        <input id="answer" type="text">
        <button id="submit">开始录制</button>
    </div>
</template>

<script>
'use strict'

class Draw {
    constructor(el) {
        this.el = el
        this.canvas = document.getElementById(this.el)
        this.cxt = this.canvas.getContext('2d')
        this.stage_info = canvas.getBoundingClientRect()
        this.path = {
            beginX: 0,
            beginY: 0,
            endX: 0,
            endY: 0
        }
    }

    init(ws, btn) {
        let arr=[]
        this.canvas.onmousedown = () => {
            this.drawBegin(event, arr)
        }
        this.canvas.onmouseup = () => {
            this.drawEnd()
            let arr1=arr
            arr=[]
            ws.send("write:"+arr1)
        }
        this.clearCanvas(ws, btn)
    }
    drawBegin(e, arr) {
        window.getSelection() ? window.getSelection().removeAllRanges() : document.selection.empty()
        this.cxt.strokeStyle = "#000"

        this.cxt.beginPath()
        this.cxt.moveTo(
            e.clientX - this.stage_info.left,
            e.clientY - this.stage_info.top
        )

        this.path.beginX = e.clientX - this.stage_info.left
        this.path.beginY = e.clientY - this.stage_info.top

        document.onmousemove = () => {
            this.drawing(event, arr)
        }
        // document.onmouseup = this.drawEnd
    }
    drawing(e,arr) {
        this.cxt.lineTo(
            e.clientX - this.stage_info.left,
            e.clientY - this.stage_info.top
        )

        this.path.endX = e.clientX - this.stage_info.left
        this.path.endY = e.clientY - this.stage_info.top
        arr.push(this.path.endX + '.' + this.path.endY)

        //ws.send(this.path.beginX + '.' + this.path.beginY + '.' + this.path.endX + '.' + this.path.endY)

        this.cxt.stroke()
    }
    drawEnd() {
        document.onmousemove = document.onmouseup = null
    }
    clearCanvas(ws, btn) {
        btn.onclick = () => {
            this.cxt.clearRect(0, 0, 500, 500)
            ws.send('clear:all')
        }
    }
}

export default {
    ready() {
        const ws = new WebSocket('ws://localhost:8090')
        let draw = new Draw('canvas')
        let btn = document.getElementById('btn')
        ws.onopen = () => {
            draw.init(ws, btn)

            let submitBtn = document.getElementById('submit')
            submitBtn.onclick = () => {
                let keyword = document.getElementById('answer').value
                ws.send('start:'+500+'.'+300)
            }
        }
        ws.onmessage = (msg) => {
            msg.data.split(':')[0] == 'keyword' ?
                document.getElementById('keyword').innerHTML = msg.data.split(':')[1] :
                false
        }
    }


}
</script>

<style lang="less">
    #canvas {
        background: pink;
        cursor: default;
    }
    #keyword-box {
        margin: 10px 0;
    }
</style>
