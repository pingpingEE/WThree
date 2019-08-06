import {hasObj} from './../utils/utils'

class SkinEffect {
    constructor () {

    }

    createSkinOptionOnj (_this, flength, fwidth, _obj, _cube, _cubefacenub) {
        if (hasObj(_obj)) {
            if (hasObj(_obj.imgurl)) {
                return {
                    map: this.createSkin(flength, fwidth, _obj),
                    transparent: true
                }
            } else {
                if (hasObj(_obj.skinColor)) {
                    _cube.faces[_cubefacenub].color.setHex(_obj.skinColor)
                    _cube.faces[_cubefacenub + 1].color.setHex(_obj.skinColor)
                }
                return {
                    vertexColors: THREE.FaceColors
                }
            }
        } else {
            return {
                vertexColors: THREE.FaceColors
            }
        }
    }

    createSkin (flength, fwidth, _obj) {
        let imgwidth = 128
        let imgheight = 128
        if (_obj.width !== null && typeof (_obj.width) !== 'undefined') {
            imgwidth = _obj.width
        }
        if (_obj.height !== null && typeof (_obj.height) !== 'undefined') {
            imgheight = _obj.height
        }
        let texture = new THREE.TextureLoader().load(_obj.imgurl)
        let _repeat = false
        if (_obj.repeatx !== null && typeof (_obj.repeatx) !== 'undefined' && _obj.repeatx === true) {
            texture.wrapS = THREE.RepeatWrapping
            _repeat = true
        }
        if (_obj.repeaty !== null && typeof (_obj.repeaty) !== 'undefined' && _obj.repeaty === true) {
            texture.wrapT = THREE.RepeatWrapping
            _repeat = true
        }
        if (_repeat) {
            texture.repeat.set(flength / imgheight, fwidth / imgwidth)
        }
        return texture
    }
}

export default SkinEffect;
