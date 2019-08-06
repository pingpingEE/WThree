// import * as THREE from 'three'
// import * as OrbitControls from 'three-orbitcontrols' // 鼠标控制
// import 'imports-loader?THREE=three!threebsp' // threebsp 计算 进行模型合并 + - 挖洞
// import TWEEN from '@tweenjs/tween.js' // 实现动画过度效果
import {logo} from './assets/index';
// message
import {version, name, author} from '../package.json';
import CubeGeometry from './CubeGeometry/index';
import SkinEffect from './SkinEffect/index';
import MergeModel from './MergeModel/index'
import Building from './Architecture/Building'
import mixin from './utils/mixins';
import 'imports-loader?THREE=three!threebsp' // threebsp 计算 进行模型合并 + - 挖洞

let currentObject = null
let dbclick = 0

class WThree extends mixin(
    CubeGeometry,
    SkinEffect,
    MergeModel,
    Building
) {
    constructor (_fid, _options, _datajson) {
        super();
        /**
         * 当前版本
         */
        this.version_ = version;

        /**
         * logo
         * @type {string}
         * @private
         */
        this.logo_ = logo;

        /**
         * dom元素id
         */
        this.fid = _fid

        /**
         * 处理options元素信息
         * @type {{}}
         */
        this.options = {}
        _options = _options || {}
        /**
         * 锯齿 默认true
         * @type {boolean}
         */
        this.options.antialias = _options['antialias'] || true
        /**
         * 刷新色
         * @type {number}
         */
        this.options.clearCoolr = (_options && _options.clearCoolr) ? _options.clearCoolr : 0x1b7ace // 刷新色
        /**
         * 容器宽度
         * @type {number}
         */
        this.options.divWidth = _options['divWidth'] ? _options['divWidth'] : document.body.clientWidth
        /**
         * 容器高度
         * @type {number}
         */
        this.options.divHeight = _options['divHeight'] ? _options['divHeight'] : document.body.clientHeight
        /**
         * 是否创建网格线  默认不创建
         * @type {boolean}
         */
        this.options.showHelpGrid = _options['showHelpGrid'] ? _options['showHelpGrid'] : false

        /**
         * 渲染器
         * @type {null}
         */
        this.renderer = null

        /**
         * 场景
         * @type {null}
         */
        this.scene = null

        /**
         * 摄像机
         * @type {null}
         */
        this.camera = null

        /**
         * 场景宽度
         * @type {number}
         */
        this.width = this.options.divWidth

        /**
         * 场景高度
         * @type {number}
         */
        this.height = this.options.divHeight

        /**
         * 鼠标事件  如旋转等操作 鼠标控制器
         * @type {THREE.Vector2}
         */
        this.mouseClick = new THREE.Vector2()

        /**
         * 给模型绑定点击事件
         * @type {THREE.Raycaster}
         */
        this.raycaster = new THREE.Raycaster()

        /**
         * 当前选中物体的模型
         * @type {null}
         */
        this.SELECTID = null

        /**
         * 鼠标控制器
         * @type {null}
         */
        this.controls = null

        _datajson = _datajson || {}

        /**
         * 存放界面元素、物体模型数组
         * @type {Array}
         */
        this.objects = []

        this.objList = (_datajson && _datajson.objects) ? _datajson.objects : [] // 对象列表

        /**
         * 当前类对象
         * @type {null}
         */
        this.currentObject = null

        /**
         * 打印版本信息
         */
        this.showMassages_();
    }

    /**
     * 显示相关信息
     * @private
     */
    showMassages_ () {
        console.log(
            '%c            ',
            "font-size:16px; padding:18px 24px;line-height:48px;background:url('" +
            this.logo_ +
            "') no-repeat;background-size: 128px;"
        );
        console.log(name, version, '©', author);
    }

    /**
     * 初始化渲染器
     * @private
     */
    initThree_ () {
        let _this = this
        _this.renderer = new THREE.WebGLRenderer({alpha: true, anitalias: _this.options.antialias})
        _this.renderer.setSize(_this.width, _this.height)
        document.getElementById(_this.fid).append(_this.renderer.domElement)
        _this.renderer.setClearColor(_this.options.clearCoolr, 1.0)
        _this.renderer.shadowMap.enabled = true
        _this.renderer.shadowMapSoft = true

        // 针对渲染器添加鼠标事件
        _this.renderer.domElement.addEventListener('mousedown', _this.onDocumentMouseDown, false)
        _this.renderer.domElement.addEventListener('mousemove', _this.onDocumentMouseMove, false)
    }

    onDocumentMouseDown (_event) {
    }

    onDocumentMouseMove (_event) {
    }

    /**
     * 初始化场景
     * @private
     */
    initScene_ () {
        let _this = this
        _this.scene = new THREE.Scene()
    }

    /**
     * 初始化相机
     * @private
     */
    initCamera_ () {
        let _this = this
        // 创建一个透视相机
        _this.camera = new THREE.PerspectiveCamera(45, _this.width / _this.height, 1, 100000)
        // 为相机起一个别名
        _this.camera.name = 'mainCamera'
        // 给定相机位置
        _this.camera.position.x = 0
        _this.camera.position.y = 1000
        _this.camera.position.z = -1800
        _this.camera.up.x = 0
        _this.camera.up.y = 1
        _this.camera.up.z = 0
        _this.camera.lookAt({x: 0, y: 0, z: 0})
        _this.objects.push(_this.camera)
    }

    /**
     * 创建网格线
     * @private
     */
    initHelpGrid_ () {
        let _this = this
        if (_this.options.showHelpGrid) {
            let helpGrid = new THREE.GridHelper(1000, 50)
            _this.scene.add(helpGrid)
        }
    }

    /**
     * 创建光源
     * @private
     */
    initLight_ () {
        let _this = this
        let light = new THREE.AmbientLight(0x000000) // 环境光  0xcccccc为光源颜色
        light.position.set(0, 0, 0) // 设定光源位置
        _this.scene.add(light) // 将光源添加至场景中
        let light2 = new THREE.PointLight(0x555555) // 点光源
        light2.shadow.camera.near = 1 // 投影禁点 表示距离光源的哪一个位置开始生成阴影
        light2.shadow.camera.far = 5000 // 投影远点
        light2.position.set(0, 350, 0)
        light2.castShadow = true // 表示这个光源是可以产生阴影的
        _this.scene.add(light2)
    }

    /**
     * 创建鼠标控制器
     * @private
     */
    initMouseCtrl_ () {
        let _this = this
        _this.controls = new OrbitControls(_this.camera, _this.renderer.domElement)
    }

    /**
     * 动画循环渲染界面
     */
    animation () {
        let _this = currentObject
        if (TWEEN !== null && typeof (TWEEN) !== 'undefined') {
            TWEEN.update()
        }
        requestAnimationFrame(_this.animation)
        _this.renderer.render(_this.scene, _this.camera)
    }

    /**
     * 渲染渲染器  为渲染器填充内容
     * @private
     */
    start () {
        let _this = this
        currentObject = _this
        // _this.currentObject = _this
        _this.initThree_()
        _this.initCamera_()
        _this.initScene_()
        _this.initHelpGrid_()
        _this.initLight_()
        _this.objList.forEach((_obj, index) => {
            _this._initAddObject(_obj)
        })
        _this.initMouseCtrl_()
        _this.animation()
    }

    _initAddObject (_obj) {
        let _this = this
        if (_obj.show === null || typeof (_obj.show) === 'undefined' || _obj.show) {
            let _tempObj = null
            // _obj.objType 物体类型
            switch (_obj.objType) {
                case 'cube':
                    _tempObj = this.createCube(_this, _obj)
                    _this._addObject(_tempObj)
                    break
                case 'building':
                    _tempObj = this.createBuilding(_this, _obj)
                    // _this._addObject(_tempObj)
                    break
            }
        }
    }

    _addObject (_obj) {
        let _this = currentObject
        _this.objects.push(_obj)
        this.scene.add(_obj)
    }
}

export default {
    WThree: WThree,
    THREE: THREE,
    TWEEN: TWEEN,
    OrbitControls: OrbitControls,
    ThreeBSP: ThreeBSP
};
