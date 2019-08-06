// import SkinEffect from './../SkinEffect/index'
// import mixin from "../utils/mixins";

class CubeGeometry {
    constructor () {
    }

    createCube (_this, _obj) {
        if (!_this) {
            _this = this
        }
        _obj = _obj || {}
        let _length = _obj.length ? _obj.length : 1000 // 物体长度 默认1000
        let _width = _obj.width ? _obj.width : _length // 物体宽度
        let _height = _obj.height ? _obj.height : 10 // 物体高度
        let _x = _obj.x ? _obj.x : 0
        let _y = _obj.y ? _obj.y : 0
        let _z = _obj.z ? _obj.z : 0
        let skinColor = (_obj && _obj.style && _obj.style.skinColor) ? _obj.style.skinColor : 0x98750f
        let cubeGeometry = new THREE.CubeGeometry(_length, _height, _width, 0, 0, 1)

        // 设定物体的六面颜色
        for (let i = 0; i < cubeGeometry.faces.length; i += 2) {
            let hex = skinColor || Math.random() * 0x531844
            cubeGeometry.faces[i].color.setHex(hex)
            cubeGeometry.faces[i + 1].color.setHex(hex)
        }

        // 六面纹理
        // 上
        let skinUpObj = {
            vertexColors: THREE.FaceColors
        }
        let skinDownObj = skinUpObj // 下
        let skinForeObj = skinUpObj // 前
        let skinBehindObj = skinUpObj // 后
        let skinLeftObj = skinUpObj // 左
        let skinRightObj = skinUpObj // 右
        if (_obj.style !== null && typeof (_obj.style) !== 'undefined' && _obj.style.skin !== null && typeof (_obj.style.skin) !== 'undefined') {
            _obj.style.skin.opacity = _obj.style.skin.opacity ? _obj.style.skin.opacity : 1
            if (_obj.style.skin.opacity !== null && typeof (_obj.style.skin.opacity) !== 'undefined') {
                // 上
                skinUpObj = _this.createSkinOptionOnj(_this, _length, _width, _obj.style.skin.skin_up, cubeGeometry, 4)
                // 下
                skinDownObj = _this.createSkinOptionOnj(_this, _length, _width, _obj.style.skin.skin_down, cubeGeometry, 6)
                // 前
                skinForeObj = _this.createSkinOptionOnj(_this, _length, _width, _obj.style.skin.skin_fore, cubeGeometry, 0)
                // 后
                skinBehindObj = _this.createSkinOptionOnj(_this, _length, _width, _obj.style.skin.skin_behind, cubeGeometry, 2)
                // 左
                skinLeftObj = _this.createSkinOptionOnj(_this, _length, _width, _obj.style.skin.skin_left, cubeGeometry, 8)
                // 右
                skinRightObj = _this.createSkinOptionOnj(_this, _length, _width, _obj.style.skin.skin_right, cubeGeometry, 10)
            }
        }
        // 为物体给定材质
        let cubeMaterialArray = []
        cubeMaterialArray.push(new THREE.MeshBasicMaterial(skinForeObj))
        cubeMaterialArray.push(new THREE.MeshBasicMaterial(skinBehindObj))
        cubeMaterialArray.push(new THREE.MeshBasicMaterial(skinUpObj))
        cubeMaterialArray.push(new THREE.MeshBasicMaterial(skinDownObj))
        cubeMaterialArray.push(new THREE.MeshBasicMaterial(skinRightObj))
        cubeMaterialArray.push(new THREE.MeshBasicMaterial(skinLeftObj))
        // let cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray)
        let cube = new THREE.Mesh(cubeGeometry, cubeMaterialArray)
        cube.castShadow = true
        cube.receiveShadow = true
        cube.uuid = _obj.uuid
        cube.name = _obj.name
        cube.position.set(_x, _y, _z)
        // 旋转 rotation格式为数组 [{{ direction: 'x', degree: 0 }}] arb表示任意参数值值[x,y,z,angle]
        if (_obj.rotation !== null && typeof (_obj.rotation) !== 'undefined' && _obj.rotation.length > 0) {
            _obj.rotation.forEach((el, index) => {
                switch (el.direction) {
                    case 'x':
                        cube.rotateX(el.degree)
                        break
                    case 'y':
                        cube.rotateY(el.degree)
                        break
                    case 'z':
                        cube.rotateZ(el.degree)
                        break
                    case 'arb':
                        cube.rotateOnAxis(new THREE.Vector3(el.degree[0], el.degree[1], el.degree[2]), el.degree[3])
                        break
                }
            })
        }
        return cube
    }
}

export default CubeGeometry;
