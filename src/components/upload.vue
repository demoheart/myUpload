<template>
    <div>
        <div class="camera">
            <camera @confirm="confirm"></camera>
        </div>
        <div class="upload">
            <div>
                <ul class="view-list"
                    v-if="fileList.length">
                    <li v-for="(item, index) in fileList"
                        @click="previewImg()"
                        :key="index">
                        <!-- v-if="item.url" -->
                        <img :src="item.url"
                             alt="">
                    </li>
                </ul>
                <!-- 加载中。。。 -->
                <!-- <progress-circle :percent="Number(percent)"
                             :radius="radius">
                <div class="percent-text">
                    {{((this.percent)*100).toFixed(0)}}%
                </div>
            </progress-circle> -->
            </div>
            <div class="upload-box">
                <span class="add">+</span>
                <input type="file"
                       ref="file"
                       class="file"
                       @click="test"
                       @change="onChange">
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'upload',
    data() {
        return {
            fileList: [],
            percent: 0,
            radius: 50
        }
    },
    methods: {
        onChange(cameraFile) {
            const _this = this
            let file = this.$refs.file
            let formData = new FormData()
            if (cameraFile.name) {
                let cameraFile1 = new File([cameraFile], new Date().getTime() + '.png', { type: 'image/png' })
                formData.append('file', cameraFile1)
            } else {
                console.log(file.files[0])
                formData.append('file', file.files[0])
            }
            this.$axios({
                // url: `/api/upload/file?prefix=db`,
                url: '/api/task/import-customer',
                method: 'POST',
                onUploadProgress: function(ev) { // 原生获取上传进度的事件
                    _this.percent = ev.loaded / ev.total
                },
                data: formData
            }).then((res) => {
                this.$refs.file.value = ''
                let dv = document.getElementsByClassName('preview-box')[0]
                //  这是重新上传的逻辑
                if (dv) {
                    let src = document.getElementsByClassName('img-cl')[0].getAttribute('src')
                    let findIndex = _this.fileList.findIndex(ele => (ele.url === src))
                    console.log(_this.fileList[findIndex].url)
                    _this.fileList[findIndex].url = res.data.data.url
                    document.getElementsByClassName('img-cl')[0].setAttribute('src', _this.fileList[findIndex].url)
                    // 这是上传逻辑
                } else {
                    _this.fileList.push(res.data.data)
                }
            })
        },
        test() {
            return true
        },
        // 图片预览
        previewImg() {
            let bodyHtml = document.getElementsByTagName('body')[0]
            let dv = document.createElement('div')
            dv.classList.add('preview-box')
            let html = `<span class="close">×</span>
            <div class="img-wrapper">
                <div class="img-box">
                    <img class="img-cl" src="${event.target.currentSrc}"
                        alt="">
                </div>
                <div class="arrow">
                    <i class="el-icon-arrow-left prev"></i>
                    <i class="el-icon-arrow-right next"></i>
                </div>
                <div class="btns">
                    <button class="del">删除</button>
                    <button class="update">重新上传</button>
                </div>
            </div>`
            dv.innerHTML = html
            bodyHtml.appendChild(dv)
            // 关闭预览框
            this.close()
            // 删除当前预览的图片
            this.del()
            // 重新上传
            this.updateFile()
            // 下一张
            this.next()
            // 上一张
            this.prev()
        },
        // 关闭预览框
        close() {
            let close = document.getElementsByClassName('close')[0]
            close.addEventListener('click', () => {
                let bodyHtml = document.getElementsByTagName('body')[0]
                let dv = document.getElementsByClassName('preview-box')[0]
                bodyHtml.removeChild(dv)
            })
        },
        // 删除当前预览的图片
        del() {
            let del = document.getElementsByClassName('del')[0]
            const _this = this
            del.addEventListener('click', () => {
                let src = document.getElementsByClassName('img-cl')[0].getAttribute('src')
                let findIndex = _this.fileList.findIndex(ele => (ele.url === src))
                _this.fileList.splice(findIndex, 1)
                if (findIndex < _this.fileList.length) {
                    document.getElementsByClassName('img-cl')[0].setAttribute('src', _this.fileList[findIndex].url)
                } else {
                    if (_this.fileList.length) {
                        document.getElementsByClassName('img-cl')[0].setAttribute('src', _this.fileList[_this.fileList.length - 1].url)
                    } else {
                        let bodyHtml = document.getElementsByTagName('body')[0]
                        let dv = document.getElementsByClassName('preview-box')[0]
                        bodyHtml.removeChild(dv)
                    }
                }
            })
        },
        // 重新上传
        updateFile() {
            let update = document.getElementsByClassName('update')[0]
            update.addEventListener('click', () => {
                // IE
                if (document.all) {
                    document.getElementsByClassName('file')[0].click()
                } else {
                    var e = document.createEvent('MouseEvents')
                    e.initEvent('click', true, true)
                    document.getElementsByClassName('file')[0].dispatchEvent(e)
                }
            })
        },
        // 下一张
        next() {
            const _this = this
            let next = document.getElementsByClassName('next')[0]
            next.addEventListener('click', () => {
                let src = document.getElementsByClassName('img-cl')[0].getAttribute('src')
                let findIndex = _this.fileList.findIndex(ele => (ele.url === src))
                if (findIndex === _this.fileList.length - 1) {
                    findIndex = -1
                }
                document.getElementsByClassName('img-cl')[0].setAttribute('src', _this.fileList[findIndex + 1].url)
            })
        },
        // 上一张
        prev() {
            const _this = this
            let prev = document.getElementsByClassName('prev')[0]
            prev.addEventListener('click', () => {
                let src = document.getElementsByClassName('img-cl')[0].getAttribute('src')
                let findIndex = _this.fileList.findIndex(ele => (ele.url === src))
                if (findIndex === 0) {
                    findIndex = _this.fileList.length
                }
                document.getElementsByClassName('img-cl')[0].setAttribute('src', _this.fileList[findIndex - 1].url)
            })
        },
        // 点击确认上传
        confirm(msg) {
            this.onChange(msg)
        }
    }

}
</script>

<style scoped lang="scss">
ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
}
.view-list li {
    width: 100px;
    height: 100px;
    overflow: hidden;
    margin-right: 20px;
    border: 2px solid red;
    border-radius: 5px;
}
.view-list li img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.upload {
    display: flex;
}
.upload-box {
    position: relative;
    width: 100px;
    height: 100px;
    border: 2px dashed #000000;
    border-radius: 5px;
}
.add {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    line-height: 100px;
    text-align: center;
    font-size: 42px;
}
.file {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    opacity: 0;
}
.percent-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.camera {
    text-align: left;
    margin-bottom: 15px;
}
</style>

<style lang="scss">
* {
    margin: 0;
    padding: 0;
}
html,
body {
    width: 100%;
    height: 100%;
}
.preview-box {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}
.close {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 32px;
    width: 60px;
    height: 60px;
    line-height: 45px;
    padding-left: 15px;
    box-sizing: border-box;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 0 0 0 60px;
    cursor: pointer;
}
.img-box {
    max-width: 70vw;
    max-height: 70vh;
    img {
        max-width: 70vw;
        max-height: 70vh;
    }
}
.btns {
    position: absolute;
    bottom: 10vh;
    right: 10vw;
    button {
        padding: 10px 20px;
        border: 1px solid #b3d8ff;
        border-radius: 4px;
        font-size: 24px;
        margin-left: 20px;
        outline: none;
        cursor: pointer;
        &.del {
            color: #409eff;
            background: #ecf5ff;
        }
        &.update {
            color: #fff;
            background-color: #409eff;
            border-color: #409eff;
        }
    }
}
.arrow i {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(0, 0, 0, 0.6);
    font-size: 62px;
    cursor: pointer;

    &.prev {
        left: 5vw;
    }
    &.next {
        right: 5vw;
    }
}
</style>
