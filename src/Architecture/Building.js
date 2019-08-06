import {hasObj} from './../utils/utils'

/**
 * 楼房实体类 - 目前只有最简单的楼房效果
 */
class Building {
    constructor () {
    }

    /**
     * 初始化楼房参数, 并开始创建楼房
     * @param _options
     */
    initBuilding (_options) {
        _options = _options || {}
        if (_options['name']) {
            this.name = _options['name']
            if (_options['width'] && _options['height'] && _options['length']) {
                this.length = _options['length'] // 楼房长度
                this.width = _options['width'] // 楼房宽度
                this.height = _options['height'] // 楼房高度
                this.thick = _options['thick'] ? _options['thick'] : 20 // 墙体厚度
                if (_options['position'] && _options['position']['x'] && _options['position']['z']) {
                    this.positionX = _options['position']['x']
                    this.positionZ = _options['position']['z']
                    this.positionY = _options['height'] / 2
                    if (_options['wallSkin']) {
                        if (_options['wallSkin']['skinUpDownColor']) {
                            this.skinUpDownColor = _options['wallSkin']['skinUpDownColor']
                        }
                        if (_options['wallSkin']['skinForeColor']) {
                            this.skinForeColor = _options['wallSkin']['skinForeColor']
                        }
                        if (_options['wallSkin']['skinBehindColor']) {
                            this.skinBehindColor = _options['wallSkin']['skinBehindColor']
                        }
                    }
                    if (_options['wall1']) {
                        this.wall1 = _options['wall1']
                    }
                    if (_options['wall2']) {
                        this.wall2 = _options['wall2']
                    }
                    if (_options['wall3']) {
                        this.wall3 = _options['wall3']
                    }
                    if (_options['wall4']) {
                        this.wall4 = _options['wall4']
                    }
                    this.createBuilding()
                } else {
                    // ps y轴起始值通过楼房高度计算
                    console.error('楼房起始x、z轴值必传')
                }
            } else {
                console.error('楼房长度、宽度、高度必传')
            }
        } else {
            console.error('楼房name必传')
        }
    }


    /**
     * 楼房由什么组成、四面墙体、窗户、楼顶
     */
    createBuilding () {
        let roof = {
            show: true,
            unid: '',
            name: this.name,
            // 楼房定位起始位置
            position: {
                x: this.positionX, // 起始位置x轴
                z: this.positionZ, // 起始位置z轴
                y: this.positionY
            },
            length: this.length, // 楼房长度
            height: this.height, // 楼房高度
            width: this.width, // 楼房宽度
            thick: this.thick, // 楼房厚度
            wallSkin: { // 墙体样式 按照正面样式进行设计识别  因相机视角偏移了  以偏移前的视角进行识别
                // 墙体上下颜色值
                skinUpDownColor: this.skinUpDownColor,
                // 墙体正面、左右颜色值 因左右颜色值相同
                skinForeColor: this.skinForeColor,
                // 墙体后面颜色值
                skinBehindColor: this.skinBehindColor
            },
            wall1: this.wall1,
            wall2: this.wall2,
            wall3: this.wall3,
            wall4: this.wall4
        }
        roof['wallData'] = this.handleWallParam(roof)
        this.createRoofTop(roof)
        return this.createWall(this, roof)
    }

    /**
     * 创建墙体
     * @param _this
     * @param _obj
     */
    createWall (_this, _obj) {
        if (!_this) {
            _this = this
        }
        let _commonThick = (_obj && _obj.thick) ? _obj.thick : 40 // 墙体厚度
        let _commonLength = (_obj && _obj.length) ? _obj.length : 100 // 墙体厚度
        let _commonHeight = (_obj && _obj.height) ? _obj.height : 300 // 强体高度
        let _commonSkin = (_obj && _obj.style && _obj.style.skinColor) ? _obj.style.skinColor : 0x98750f // 墙体颜色
        // 建立墙面
        _obj.wallData.forEach((el, index) => {
            let _cube = this.createWall_(_this, el, _commonThick, _commonLength, _commonHeight, _commonSkin)
            if (hasObj(el.childrens) && el.childrens.length > 0) {
                el.childrens.forEach((ele, ii) => {
                    let _newobj = _this.createWall_(_this, ele, _commonThick, _commonLength, _commonHeight, _commonSkin)
                    _cube = _this.mergeModel(_this, ele.op, _cube, _newobj)
                })
            }
            _this.scene.add(_cube)
        })
    }

    /**
     * 创建墙面 挖洞
     * @param _this
     * @param _obj
     * @param _commonThick
     * @param _commonLength
     * @param _commonHeight
     * @param _commonSkin
     * @returns {Mesh}
     * @private
     */
    createWall_ (_this, _obj, _commonThick, _commonLength, _commonHeight, _commonSkin) {
        if (!_this) {
            _this = this
        }

        let wallLength = _commonLength
        let wallWidth = _obj.thick || _commonThick
        let positionX = ((_obj.startDot.x || 0) + (_obj.endDot.x || 0)) / 2
        let positionY = ((_obj.startDot.y || 0) + (_obj.endDot.y || 0)) / 2
        let positionZ = ((_obj.startDot.z || 0) + (_obj.endDot.z || 0)) / 2
        // z相同 表示x方向为长度
        if (_obj.startDot.z === _obj.endDot.z) {
            wallLength = Math.abs(_obj.startDot.x - _obj.endDot.x)
            wallWidth = _obj.thick || _commonThick
        } else if (_obj.startDot.x === _obj.endDot.x) {
            wallLength = _obj.thick || _commonThick
            wallWidth = Math.abs(_obj.startDot.z - _obj.endDot.z)
        }
        let cubeobj = {
            length: wallLength,
            width: wallWidth,
            height: _obj.height || _commonHeight,
            rotation: _obj.rotation,
            x: positionX,
            y: positionY,
            z: positionZ,
            uuid: _obj.uuid,
            name: _obj.name,
            style: {
                skinColor: _commonSkin,
                skin: _obj.skin
            }
        }
        // cube.position.set(-500, 120, -350);
        return _this.createCube(_this, cubeobj);
    }

    /**
     * 处理四面墙体参数
     * @param roofParam
     * @returns {*[]}
     */
    handleWallParam (roofParam) {
        // 根据楼房长度、宽度、高度、厚度计算位置
        roofParam = roofParam || {}
        const thick = roofParam['thick'] ? roofParam['thick'] : 20 // 墙体厚度
        const roofLength = roofParam['length'] ? roofParam['length'] : 1000 //楼房长度
        const roofWidth = roofParam['width'] ? roofParam['width'] : 800 // 楼房宽度
        const roofHeight = roofParam['height'] ? roofParam['height'] : 240 // 楼房高度
        // 因为墙体颜色要合并 前方效果应和左右两侧接近颜色一致  上下颜色一致  下部一版无法看到 可以忽略
        let wallSkinUpDown = 0xdddddd // 墙体上下颜色值
        let wallSkinFore = 0xb0cee0 // 墙体前面颜色值 及左右颜色值
        let wallSkinBehind = 0xdeeeee // 墙体后面颜色值
        if (roofParam['wallSkin']) {
            if (roofParam['wallSkin']['wallSkinUpDown']) {
                wallSkinUpDown = roofParam['wallSkin']['wallSkinUpDown']
            }
            if (roofParam['wallSkin']['wallSkinFore']) {
                wallSkinFore = roofParam['wallSkin']['wallSkinFore']
            }
            if (roofParam['wallSkin']['wallSkinBehind']) {
                wallSkinBehind = roofParam['wallSkin']['wallSkinBehind']
            }
        }
        if (roofParam['position'] && roofParam['position']['x'] && roofParam['position']['z']) {
            const x = roofParam['position']['x'] // 楼房定位起始x值
            const y = roofHeight / 2 // 楼房定位起始y值
            const z = roofParam['position']['z'] // 楼房定位起始z值
            // 正前方墙体
            let wall1 = {
                uuid: '',
                name: roofParam['name'] + '_wall1',
                thick: thick,
                height: roofHeight,
                skin: {
                    skin_up: {
                        skinColor: wallSkinUpDown
                    },
                    skin_down: {
                        skinColor: wallSkinUpDown
                    },
                    skin_fore: {
                        skinColor: wallSkinFore
                    },
                    skin_behind: {
                        skinColor: wallSkinFore
                    },
                    skin_left: {
                        skinColor: wallSkinBehind
                    },
                    skin_right: {
                        skinColor: wallSkinFore
                    }
                },
                startDot: {
                    x: x,
                    y: y,
                    z: z
                },
                endDot: {
                    x: x + roofLength,
                    y: y,
                    z: z
                },
                rotation: [{direction: 'x', degree: 0}] // 旋转 表示x方向0度  arb表示任意参数值[x,y,z,angle]
            }
            // 正后方墙体
            let wall2 = {
                uuid: '',
                name: roofParam['name'] + '_wall2',
                thick: thick,
                height: roofHeight,
                skin: {
                    skin_up: {
                        skinColor: wallSkinUpDown
                    },
                    skin_down: {
                        skinColor: wallSkinUpDown
                    },
                    skin_fore: {
                        skinColor: wallSkinFore
                    },
                    skin_behind: {
                        skinColor: wallSkinFore
                    },
                    skin_left: {
                        skinColor: wallSkinFore
                    },
                    skin_right: {
                        skinColor: wallSkinBehind
                    }
                },
                startDot: {
                    x: x,
                    y: y,
                    z: z + roofWidth
                },
                endDot: {
                    x: x + roofLength,
                    y: y,
                    z: z + roofWidth
                }
            }
            // 左侧墙体
            let wall3 = {
                uuid: '',
                name: roofParam['name'] + '_wall3',
                thick: thick,
                height: roofHeight,
                skin: {
                    skin_up: {
                        skinColor: wallSkinUpDown
                    },
                    skin_down: {
                        skinColor: wallSkinUpDown
                    },
                    skin_fore: {
                        skinColor: wallSkinFore
                    },
                    skin_behind: {
                        skinColor: wallSkinBehind
                    },
                    skin_left: {
                        skinColor: wallSkinFore
                    },
                    skin_right: {
                        skinColor: wallSkinFore
                    }
                },
                startDot: {
                    x: x + roofLength - (thick / 2),
                    y: y,
                    z: z - (thick / 4)
                },
                endDot: {
                    x: x + roofLength - (thick / 2),
                    y: y,
                    z: z + roofWidth - (thick / 4) + (thick / 2)
                }
            }
            // 右侧墙体
            let wall4 = {
                uuid: '',
                name: roofParam['name'] + '_wall4',
                thick: thick,
                height: roofHeight,
                skin: {
                    skin_up: {
                        skinColor: wallSkinUpDown
                    },
                    skin_down: {
                        skinColor: wallSkinUpDown
                    },
                    skin_fore: {
                        skinColor: wallSkinBehind
                    },
                    skin_behind: {
                        skinColor: wallSkinFore
                    },
                    skin_left: {
                        skinColor: wallSkinFore
                    },
                    skin_right: {
                        skinColor: wallSkinFore
                    }
                },
                startDot: {
                    x: x + (thick / 2),
                    y: y,
                    z: z - (thick / 4)
                },
                endDot: {
                    x: x + (thick / 2),
                    y: y,
                    z: z + roofWidth - (thick / 4) + (thick / 2)
                }
            }
            if (roofParam['wall1']) {
                wall1 = Object.assign(wall1, roofParam['wall1'])
                wall1['childrens'] = this.handleWallGlass(true, roofParam['wall1'], wall1)
            }
            if (roofParam['wall2']) {
                wall2 = Object.assign(wall2, roofParam['wall2'])
            }
            if (roofParam['wall3']) {
                wall3 = Object.assign(wall3, roofParam['wall3'])
            }
            if (roofParam['wall4']) {
                wall4 = Object.assign(wall4, roofParam['wall4'])
            }
            console.log(wall1, wall2, wall3, wall4)
            return [wall1, wall2, wall3, wall4]
        } else {
            console.error('楼房起始定位x、y、z值必传')
        }
    }

    /**
     * 为墙体的childrens添加玻璃
     * @param isHasGlass
     * @param glassOptions
     * @param _options
     * @returns {Array}
     */
    handleWallGlass (isHasGlass, glassOptions, _options) {
        let glassArr = []
        if (isHasGlass) {
            glassOptions = glassOptions || {}
            let glassWidth = glassOptions['glassWidth'] ? glassOptions['glassWidth'] : 40 // 窗户宽度
            let glassHeight = glassOptions['glassHeight'] ? glassOptions['glassHeight'] : 40 // 窗户高度
            let row = glassOptions['glassRow'] || 0 // 该栋楼房该栋墙体拥有几行窗户
            let column = glassOptions['glassColumn'] = glassOptions['glassColumn'] || 0 // 该栋楼房该栋墙体拥有几列窗户
            _options = _options || {} // 当前墙体信息 ps:窗户和当前墙体z值始终相同
            // 通过当前墙体高度计算每列窗户间距  通过当前墙体官渡计算每列窗户间距
            if (_options['height']) {
                let x = (_options['endDot']['x'] - _options['startDot']['x']) / column
                for (let i = 0; i < row; i++) {
                    for (let j = 0; j < column; j++) {
                        glassArr.push(
                            {
                                op: '-',
                                show: true,
                                uuid: '',
                                name: 'windowHole' + (i + 1),
                                thick: 20,
                                height: glassWidth,
                                startDot: {
                                    x: _options['startDot']['x'] + ((x - glassWidth) / 2) + (j * x),
                                    y: ((i + 1) * (_options['height'] / row)) - (20 * (i + 1)),
                                    z: _options['startDot']['z']
                                },
                                endDot: {
                                    x: _options['startDot']['x'] + ((x - glassWidth) / 2) + (j * x) + glassWidth,
                                    y: ((i + 1) * (_options['height'] / row)) - (20 * (i + 1)),
                                    z: _options['startDot']['z']
                                }
                            },
                            {
                                show: true,
                                name: 'glass' + (i + 1),
                                uuid: '',
                                objType: 'cube',
                                thick: 4,
                                height: glassHeight,
                                startDot: {
                                    x: _options['startDot']['x'] + ((x - glassWidth) / 2) + (j * x),
                                    y: ((i + 1) * (_options['height'] / row)) - (20 * (i + 1)),
                                    z: _options['startDot']['z']
                                },
                                endDot: {
                                    x: _options['startDot']['x'] + ((x - glassWidth) / 2) + (j * x) + glassWidth,
                                    y: ((i + 1) * (_options['height'] / row)) - (20 * (i + 1)),
                                    z: _options['startDot']['z']
                                },
                                skin: {
                                    opacity: 0.1,
                                    skin_up: {
                                        skinColor: 0x51443e
                                    },
                                    skin_down: {
                                        skinColor: 0x51443e
                                    },
                                    skin_fore: {
                                        skinColor: 0x51443e
                                    },
                                    skin_behind: {
                                        skinColor: 0x51443e
                                    },
                                    skin_left: {
                                        skinColor: 0x51443e,
                                        imgurl: '../src/static/images/glass.png'
                                    },
                                    skin_right: {
                                        skinColor: 0x51443e,
                                        imgurl: '../src/static/images/glass.png'
                                    }
                                }
                            }
                        )
                    }
                }
            } else {
                console.error('墙体高度必传')
            }
        }
        return glassArr
    }

    /**
     * 创建楼顶
     * @param _options
     */
    createRoofTop (_options) {
        let roofTop = {
            show: true,
            uuid: '',
            name: 'floor',
            objType: 'cube',
            length: _options['length'],
            width: _options['width'] + (_options['thick'] * 2),
            height: _options['thick'] ? _options['thick'] : 20,
            x: _options['position']['x'] + (_options['length'] / 2),
            y: _options['height'],
            z: _options['position']['z'] + (_options['width'] / 2),
            rotation: [{direction: 'x', degree: 0}], // 旋转 表示x方向0度  arb表示任意参数值[x,y,z,angle]
            style: {
                skinColor: 0xa1add8
            }
        }
        let roo = this.createCube(this, roofTop)
        this.scene.add(roo)
    }
}

export default Building;
