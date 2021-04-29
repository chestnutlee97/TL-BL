//插入杆塔
function towerInsert(event) {
    if (event.button === 0){
        let currentTow = [];
        let deleteWire = [];
        intersects = getIntersects(event);
        tempintersects = intersects;

        var tempLine2Cor = [];
        for (let i = 0; i < m_linegroup.children.length; i++) {
            for(let j=0;j<m_linegroup.children[i].geometry.vertices.length;j++){
                tempLine2Cor.push([m_linegroup.children[i].geometry.vertices[j].x,m_linegroup.children[i].geometry.vertices[j].y]);
            }
        }
        var tempLine2 = turf.lineString(tempLine2Cor);
        var temppointLine1 = turf.lineString([[tempintersects.x,tempintersects.y+500],[tempintersects.x,0]]); // m_line intersect point
        var interPoint1 = turf.lineIntersect(temppointLine1, tempLine2);
        tempintersects = new THREE.Vector3(tempintersects.x, interPoint1.features[0].geometry.coordinates[1], 0);

        var pointsGeometry = new THREE.Geometry();
        pointsGeometry.vertices.push(intersects);
        var temppointsGeometry = new THREE.Geometry();
        temppointsGeometry.vertices.push(tempintersects);

        var pointsMaterial = new THREE.PointsMaterial({color:0xff0000, size: 3});
        var points = new THREE.Points(pointsGeometry, pointsMaterial);
        var temppoints = new THREE.Points(temppointsGeometry, pointsMaterial);
        pointArray.push(temppoints);
        putInd++;

        var pos = new THREE.Vector3(points.geometry.vertices[0].x,points.geometry.vertices[0].y,0);
        var tempLine1 = turf.lineString([[pos.x,pos.y],[pos.x,0]]);
        var interPoint = turf.lineIntersect(tempLine1, tempLine2);
        pos = new THREE.Vector3(points.geometry.vertices[0].x, interPoint.features[0].geometry.coordinates[1], 0);

        var towMesh = tower1(towerHei);
        towMesh.position.x = pos.x;
        towMesh.position.y = pos.y;
        towMesh.position.z = 0;
        towMesh.name = "fixTower";
        scene.add(towMesh);

        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "fixwire1" || scene.children[i].name === "fixwire2" || scene.children[i].name === "fixwire3" || scene.children[i].name === "fixwire4") {
                deleteWire.push(scene.children[i]);
            }
        }
        for(let i = 0; i < deleteWire.length; i++){
            scene.remove(deleteWire[i]);
        }

        scene.children.sort(compare('position'))
        /****修改****/
        towerlist = []
        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name == "fixTower") {
                currentTow.push({
                    "posX":scene.children[i].position.x,
                    "object":scene.children[i]
                });
                towerlist.push({
                    "Name": "G" + i,
                    "Distance": scene.children[i].position.x / Gridsize * xdivision + xMin,
                    "High": scene.children[i].position.y / Gridsize * ydivision + yMin,
                    "TowerType": "ZMVA41",
                    "Base": 0,
                    "TowerHigh": scene.children[i].geometry.vertices[7].y / (1 / ydivision * Gridsize),
                    "Status": 0,
                    "InsulatorLength": 4.5,
                    "ConnectLength": 0.0,
                    "InsulateP": "",
                    "InsulatePA": "X01",
                    "InsulatePANum": -1,
                    "InsulatePB": "X01",
                    "InsulatePBNum": -1,
                    "InsulatePC": "",
                    "InsulatePCNum": 0,
                    "hugeHigh": 0,
                    "hugeGround": 0,		// 地线悬挂点高程
                    "Lk": 0,
                    "L": 0,
                    "cosa": 1,
                    "bInsular": false,
                    "constant": 0,
                    "u": 1,
                    "kPline": 0,			//导线大号侧k值系数
                    "kGround": 0,		//地线大号侧K值系数
                    "kWind": 0,			//大风条件前视档k值系数
                    "kMaxT": 0,			//70度高温k值系数
                    "constMaxT": 0,
                    "Lh": 0,				// 水平档距
                    "Lh1": 0,			// 小号侧垂直档距
                    "Lh2": 0,			// 大号侧垂直档距
                    "Lv": 0,				// 垂直档距
                    "Lv1": 0,			// 小号侧水平档距
                    "Lv2": 0,			// 大号侧水平档距
                    "lvMinTemp": 0,//最低气温垂直档距
                    "lvMaxTemp": 0,//最高气温垂直档距
                    "lvMaxIce": 0,//最大覆冰垂直档距
                    "lvMaxWind": 0,//最大风垂直档距
                    "displayKType": 0,	//k值类型，0为最大弧垂 1为最高线温
                    "displayGround": 0,		//显示地线
                    "displayPower": 1,		//显示导线
                    "displaySafe": 1,	//显示导线对地
                    "displayCross": 1,		//显示导线跨越
                    "LandDist": 8.5,		// 对地安全距离
                    "ElecDist": 6.0	// 电力线安全距离
                })
            }
        }
        /****修改****/
        currentTow.sort(compare('posX'))
        for (let j = 0; j < currentTow.length; j++) {
            for (let i = 0; i < scene.children.length; i++) {
                if (scene.children[i].uuid == currentTow[j].object.uuid){
                    scene.children[i].geometry.name = "G" + j;
                }
            }
        }

        let disToPile = []
        for (let i = 0; i < pile_tabledata.length; i++) {
            disToPile.push({"name": pile_tabledata[i].name,
                "dis":Math.abs(pile_tabledata[i].dist - pos.x/Gridsize*xdivision),
                "value":i
            })
        }
        disToPile.sort(compare("dis"));
        layer.getChildFrame('body',tpIndex).find("#pilelist").val(disToPile[0].value);
        let gap;
        for (let i = 0; i < pile_tabledata.length; i++) {
            if (pile_tabledata[i].name == disToPile[0].name){
                gap = pos.x/Gridsize*xdivision - pile_tabledata[i].dist;
            }
        }
        let gaptoPile2 = layer.getChildFrame('body',tpIndex).find("#gap")[0];
        gaptoPile2.value = gap.toFixed(2);
        var inputHei2 = layer.getChildFrame('body',tpIndex).find("#hei")[0];
        var inputDis2 = layer.getChildFrame('body',tpIndex).find("#dis")[0];

        let disNum = pos.x/Gridsize*xdivision + xMin;
        let heiNum = pos.y/Gridsize*ydivision + yMin;
        inputDis2.value = disNum.toFixed(2);
        inputHei2.value = heiNum.toFixed(2);

        var inputId2 =  layer.getChildFrame('body',tpIndex).find("#towId")[0];
        inputId2.value = "G" + towerlist.length;

        console.log("then",towerlist)
        m_end = towerlist.length - 1;
        /****修改****/
        towerlist.sort(compare('Distance'));
        ComputeHugeHigh();
        /****修改****/
        for (let i = 0; i < towerlist.length; i++) {
            towerlist[i].Name = "G" + i;
        }
        for (let i = m_start; i < m_end; i++) {
            DisplayFawCurve4(towerlist[i],towerlist[i+1], "fixwire");
        }

        towerlist_tabledata=towerlist;
        GridManager.setAjaxData(towerlist_tableId,{"data":towerlist_tabledata});
        GridManager.refreshGrid(towerlist_tableId);
    }
    if (event.button === 2){
        clearTempTow();
        scene.remove(scene.getObjectByName('tower'));
        document.removeEventListener("mousedown",towerInsert);
        document.removeEventListener("mousemove",onMouseMove);
    }
}