class MergeModel {
    constructor () {
    }

    /**
     * 模型合并 使用ThreeBSP插件mergeOP计算方式 -表示减去 +表示加上
     * @param _this
     * @param mergeOP
     * @param _fobj
     * @param _sobj
     * @returns {*}
     */
    mergeModel (_this, mergeOP, _fobj, _sobj) {
        if (!_this) {
            _this = this
        }
        let fobjBSP = new ThreeBSP(_fobj)
        let sobjBSP = new ThreeBSP(_sobj)
        let resultBSP = null
        if (mergeOP === '-') {
            resultBSP = fobjBSP.subtract(sobjBSP)
        } else if (mergeOP === '+') {
            _sobj.updateMatrix()
            _fobj.geometry.merge(_sobj.geometry, _sobj.matrix)
            return _fobj
        } else if (mergeOP === '&') { // 交集
            resultBSP = fobjBSP.intersect(sobjBSP)
        } else {
            // _this.addObject(_sobj)
            _this.scene.add(_sobj)
            return _fobj
        }
        let cubeMaterialArray = []
        for (let i = 0; i < 1; i++) {
            cubeMaterialArray.push(new THREE.MeshBasicMaterial({
                vertexColors: THREE.FaceColors
            }))
        }
        // let cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray)
        let result = resultBSP.toMesh(cubeMaterialArray)
        result.material.shading = THREE.FlatShading
        result.geometry.computeFaceNormals()
        result.geometry.computeVertexNormals()
        result.uuid = _fobj.uuid + mergeOP + _sobj.uuid
        result.name = _fobj.name + mergeOP + _sobj.name
        result.material.needsUpdate = true
        result.geometry.buffersNeedUpdate = true
        result.geometry.uvsNeedUpdate = true
        let _foreFaceSkin = null
        for (let i = 0; i < result.geometry.faces.length; i++) {
            let _faceset = false
            for (let j = 0; j < _fobj.geometry.faces.length; j++) {
                if (result.geometry.faces[i].vertexNormals[0].x === _fobj.geometry.faces[j].vertexNormals[0].x && result.geometry.faces[i].vertexNormals[0].y === _fobj.geometry.faces[j].vertexNormals[0].y && result.geometry.faces[i].vertexNormals[0].z === _fobj.geometry.faces[j].vertexNormals[0].z && result.geometry.faces[i].vertexNormals[1].x === _fobj.geometry.faces[j].vertexNormals[1].x && result.geometry.faces[i].vertexNormals[1].y === _fobj.geometry.faces[j].vertexNormals[1].y && result.geometry.faces[i].vertexNormals[1].z === _fobj.geometry.faces[j].vertexNormals[1].z && result.geometry.faces[i].vertexNormals[2].x === _fobj.geometry.faces[j].vertexNormals[2].x && result.geometry.faces[i].vertexNormals[2].y === _fobj.geometry.faces[j].vertexNormals[2].y && result.geometry.faces[i].vertexNormals[2].z === _fobj.geometry.faces[j].vertexNormals[2].z) {
                    result.geometry.faces[i].color.setHex(_fobj.geometry.faces[j].color.r * 0xff0000 + _fobj.geometry.faces[j].color.g * 0x00ff00 + _fobj.geometry.faces[j].color.b * 0x0000ff)
                    _foreFaceSkin = _fobj.geometry.faces[j].color.r * 0xff0000 + _fobj.geometry.faces[j].color.g * 0x00ff00 + _fobj.geometry.faces[j].color.b * 0x0000ff
                    _faceset = true
                }
            }
            if (_faceset === false) {
                for (let j = 0; j < _sobj.geometry.faces.length; j++) {
                    if (result.geometry.faces[i].vertexNormals[0].x === _sobj.geometry.faces[j].vertexNormals[0].x && result.geometry.faces[i].vertexNormals[0].y === _sobj.geometry.faces[j].vertexNormals[0].y && result.geometry.faces[i].vertexNormals[0].z === _sobj.geometry.faces[j].vertexNormals[0].z && result.geometry.faces[i].vertexNormals[1].x === _sobj.geometry.faces[j].vertexNormals[1].x && result.geometry.faces[i].vertexNormals[1].y === _sobj.geometry.faces[j].vertexNormals[1].y && result.geometry.faces[i].vertexNormals[1].z === _sobj.geometry.faces[j].vertexNormals[1].z && result.geometry.faces[i].vertexNormals[2].x === _sobj.geometry.faces[j].vertexNormals[2].x && result.geometry.faces[i].vertexNormals[2].y === _sobj.geometry.faces[j].vertexNormals[2].y && result.geometry.faces[i].vertexNormals[2].z === _sobj.geometry.faces[j].vertexNormals[2].z && result.geometry.faces[i].vertexNormals[2].z === _sobj.geometry.faces[j].vertexNormals[2].z) {
                        result.geometry.faces[i].color.setHex(_sobj.geometry.faces[j].color.r * 0xff0000 + _sobj.geometry.faces[j].color.g * 0x00ff00 + _sobj.geometry.faces[j].color.b * 0x0000ff)
                        _foreFaceSkin = _sobj.geometry.faces[j].color.r * 0xff0000 + _sobj.geometry.faces[j].color.g * 0x00ff00 + _sobj.geometry.faces[j].color.b * 0x0000ff
                        _faceset = true
                    }
                }
            }
            if (_faceset === false) {
                result.geometry.faces[i].color.setHex(_foreFaceSkin)
            }
        }
        result.castShadow = true
        result.receiveShadow = true
        return result
    }
}

export default MergeModel;
