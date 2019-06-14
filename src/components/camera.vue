<template>
    <div class="camera">
        <!-- 是否拍照 -->
        <!-- <el-button class="open"
                   icon="el-icon-view"
                   type="primary"
                   @click="getMedia();"
                   plain
                   circle></el-button> -->
        <el-button class="open"
                   type="primary"
                   @click="getMedia();"
                   plain>开启摄像头</el-button>
        <video class="bg"
               v-show="isOpen"
               ref="video"></video>
        <!-- 拍照 -->
        <el-button class="photograph"
                   type="primary"
                   @click="getPhoto();"
                   v-if="isOpen"
                   plain
                   circle>拍</el-button>

        <canvas v-show="isCanvas"
                ref="canvas1"></canvas>

        <div v-if="isCanvas">
            <!-- 取消上传 -->
            <el-button class="cancel"
                       type="danger"
                       icon="el-icon-close"
                       @click="cancel"
                       circle></el-button>
            <!-- 确认上传 -->
            <el-button class="confirm"
                       type="success"
                       icon="el-icon-check"
                       @click="confirm"
                       circle></el-button>
        </div>
        <!-- <input type="button"
               value="保存为图片"
               @click="saveImg();" />
        <img src=""
             alt=""
             ref="im"> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            isOpen: false,
            isCanvas: false,
            file: ''
        }
    },
    created() {
        this.mediaStreamTrack = ''
    },
    methods: {
        // 开启相机
        getMedia() {
            // 一堆兼容代码
            window.URL = (window.URL || window.webkitURL || window.mozURL || window.msURL)
            if (navigator.mediaDevices === undefined) {
                navigator.mediaDevices = {}
            }
            if (navigator.mediaDevices.getUserMedia === undefined) {
                navigator.mediaDevices.getUserMedia = function(constraints) {
                    let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
                    if (!getUserMedia) {
                        return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
                    }
                    return new Promise(function(resolve, reject) {
                        getUserMedia.call(navigator, constraints, resolve, reject)
                    })
                }
            }
            // 存储设备源ID
            let exArray = []
            if (typeof MediaStreamTrack.getSources !== 'undefined') {
                MediaStreamTrack.getSources(function(sourceInfos) {
                    for (let i = 0; i !== sourceInfos.length; ++i) {
                        let sourceInfo = sourceInfos[i]
                        // 这里会遍历audio,video，所以要加以区分
                        if (sourceInfo.kind === 'video') {
                            exArray.push(sourceInfo.id)
                        }
                    }
                })
            }
            // 配置设置
            const mediaOpts = {
                audio: false,
                video: {
                    'optional': [{
                        'sourceId': exArray[1] // 0为前置摄像头，1为后置
                    }]
                }
            }

            // 正式启动摄像头
            navigator.mediaDevices.getUserMedia(mediaOpts).then(this.successFunc).catch(this.errorFunc)
        },
        // 成功回调
        successFunc(stream) {
            this.isOpen = true
            let video = this.$refs.video
            this.mediaStreamTrack = stream
            if ('srcObject' in video) {
                video.srcObject = stream
            } else {
                // eslint-disable-next-line no-mixed-operators
                video.src = window.URL && window.URL.createObjectURL(stream) || stream
            }
            video.play()
        },
        // 错误回调
        errorFunc(err) {
            alert(err.name)
        },

        // 拍照
        getPhoto() {
            this.isCanvas = true
            let canvas1 = this.$refs.canvas1
            let ctx = canvas1.getContext('2d')
            let video = this.$refs.video
            canvas1.height = video.offsetHeight
            canvas1.width = video.offsetWidth
            console.log(video.offsetHeight)
            console.log(video.offsetWidth)
            ctx.drawImage(video, 0, 0, video.offsetWidth, video.offsetHeight) // 将video对象内指定的区域捕捉绘制到画布上指定的区域，实现拍照。
            this.closeCamera()
            this.isOpen = false
        },
        // 拍照完成关闭相机
        closeCamera() {
            this.mediaStreamTrack.getTracks().forEach(function(track) {
                track.stop()
            })
        },
        // 取消上传
        cancel() {
            this.isCanvas = false
        },
        // 确认上传
        confirm() {
            this.saveImg()
            this.$nextTick(() => {
                this.$emit('confirm', this.file)
            })
            this.isCanvas = false
        },
        // 保存为图片
        saveImg() {
            let canvas1 = this.$refs.canvas1
            this.file = this.dataUrlToFile(canvas1.toDataURL('image/png'))
        },
        dataUrlToFile(dataurl) {
            let filename = this.curImgName
            let arr = dataurl.split(',')
            let mime = arr[0].match(/:(.*?);/)[1]
            let bstr = atob(arr[1])
            let n = bstr.length
            let u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            let file = new File([u8arr], filename, {
                type: mime
            })

            return file
            // var fd = new FormData(document.getElementById('imgUpload'));
            // fd.set('imgFile',file);
            // this.compressedFile = fd;
        } // 压缩end
    }
}
</script>

<style scoped lang='scss'>
.bg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: #000;
}

canvas {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
}
.photograph {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 70px;
    height: 70px;
    z-index: 5;
}
.cancel,
.confirm {
    position: fixed;
    bottom: 50px;
    font-size: 24px;
    color: #fff;
    z-index: 10;
    width: 70px;
    height: 70px;
}
/deep/ .cancel i,
/deep/ .confirm i {
    font-weight: 900;
}
.cancel {
    left: 100px;
}
.confirm {
    right: 100px;
}
</style>
