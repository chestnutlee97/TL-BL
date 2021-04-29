//创建杆塔函数
window.tower1 = function(towerHei) {
    let scale = 1 / ydivision * Gridsize;
    let tower = new THREE.Shape();
    /****修改****/
    // tower.moveTo(0,0);
    // tower.lineTo(1,0);tower.lineTo(1,towerLineWid);tower.lineTo(0.75,towerLineWid);
    // tower.lineTo(0.75,towerHei-4.5-towerLineWid);tower.lineTo(1.5,towerHei-4.5-towerLineWid);
    // tower.lineTo(1.5,towerHei-4.5);tower.lineTo(0.75,towerHei-4.5);tower.lineTo(0.75,towerHei);
    // tower.lineTo(0.25,towerHei);tower.lineTo(0.25,towerHei-4.5);tower.lineTo(-0.5,towerHei-4.5);
    // tower.lineTo(-0.5,towerHei-4.5-towerLineWid);tower.lineTo(0.25,towerHei-4.5-towerLineWid);
    // tower.lineTo(0.25,towerLineWid);tower.lineTo(0,towerLineWid);
    // tower.lineTo(0,0);
    tower.moveTo(-0.5,0);
    tower.lineTo(0.5,0);tower.lineTo(0.5,towerLineWid);tower.lineTo(0.25,towerLineWid);
    tower.lineTo(0.25,towerHei-4.5-towerLineWid);tower.lineTo(1,towerHei-4.5-towerLineWid);
    tower.lineTo(1,towerHei-4.5);tower.lineTo(0.25,towerHei-4.5);tower.lineTo(0.25,towerHei);
    tower.lineTo(-0.25,towerHei);tower.lineTo(-0.25,towerHei-4.5);tower.lineTo(-1,towerHei-4.5);
    tower.lineTo(-1,towerHei-4.5-towerLineWid);tower.lineTo(-0.25,towerHei-4.5-towerLineWid);
    tower.lineTo(-0.25,towerLineWid);tower.lineTo(-0.5,towerLineWid);
    tower.lineTo(-0.5,0);
    /****修改****/
    let towerGroup = new THREE.ShapeGeometry(tower);
    towerGroup.scale(scale,scale,scale);
    let towMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
    var towMesh = new THREE.Mesh( towerGroup, towMaterial ) ;
    towMesh.renderOrder = towerHei;
    return towMesh;
}

//弧垂
window.DisplayFawCurve = function(x1,y1,x2,y2,k,x0,bInsular,constt,length,material, name) {

    if (x1 < 0) return;
    let f,l1,l2,l,x3, y3;
    let loa,h;
    let endL,startL;
    let ptCount =0;
    let insertPoint = [];

    l1 = 0;
    l = x2-x1;
    h = y2-y1;
    loa = l/2.0 - arcsh(k*h/sinh(k*l))/2.0/k;
    if(!bInsular)
    {
        /****修改****/
        startL=x1;
        /****修改****/
        endL = Math.min(x2,xMax);
        ptCount = parseInt(endL - startL)+1;
        for(let i=0;i<ptCount &&i< 2048 ;i++ )
        {
            l1 = 1.0*i + startL-x1;
            l2 = l - l1;
            if(i!=ptCount-1)//非最后点
            {
                //P180手册公式
                f = l1*h/l +( sinh(k*(2*loa-l1)) * sinh(k*l1) )/k;
                x3 = x1 + l1;
                y3 = (l1*y2+l2*y1)/l-f;
            }
            /****修改****/
            else if(x2 <= xMax)	//最后一点
                /****修改****/
            {
                x3 = x2;
                y3 = y2;
            }
            /****修改****/
            insertPoint.push(new THREE.Vector3((x3-xMin)/xdivision*Gridsize , (y3 - yMin)/ydivision*Gridsize, 0))
            /****修改****/
        }
    }
    else
    {
        startL=x1;
        endL = Math.min( x2-length*Math.cos(Math.atan(h/l)),xMax );
        ptCount = parseInt (endL - startL)+2;
        for(let i=0;i<ptCount;i++ )
        {
            if(i==0)			//第一点
            {
                x3 = x1;
                y3 = y1;
            }
            else if(i!=ptCount-1)//中间点
            {
                l1 = 1.0*(i-1) + startL-x1;
                l2 = l - l1;
                //P193手册公式
                f =( k*l1*(l-l1) + constt )/Math.cos(Math.atan(h/l));
                x3 = x1 + l1;
                y3 = (l1*y2+l2*y1)/l-f;
            }
            else if(x2<=xMax)	//最后一点
            {
                x3 = x2;
                y3 = y2;
            }
            /****修改****/
            insertPoint.push(new THREE.Vector3((x3-xMin)/xdivision*Gridsize, (y3 - yMin)/ydivision*Gridsize, 0))
            /****修改****/
        }
    }
    var conductGeo = new THREE.Geometry();
    for (let i = 0 ; i < insertPoint.length ; i++){
        conductGeo.vertices.push(insertPoint[i]);
    }
    var conductObj = new THREE.Line( conductGeo, material );
    conductObj.name = name;
    conductObj.renderOrder = 999;
    conductObj.onBeforeRender = function( renderer ) { renderer.clearDepth(); };
    scene.add(conductObj);
}

//升高杆塔
function riseTower(event){
    document.body.style.cursor = "url(./css/rise.ico) 9 9, default";
    if (event.button === 0) {
        var intersectsTower = getIntersectsObject(event);
        console.log(intersectsTower[0]);
        let tempTowerHei = intersectsTower[0].object.renderOrder;
        let deleteWire = [];

        if (tempTowerHei < 45) {
            tempTowerHei += 3;
            scene.remove(intersectsTower[0].object);
        } else return tempTowerHei;

        /****修改****/
        var tempPoints = intersectsTower[0].object.position;
        // var tempLine2Cor = [];
        // for (let i = 0; i < m_linegroup.children.length; i++) {
        // 	for(let j=0;j<m_linegroup.children[i].geometry.vertices.length;j++){
        // 		tempLine2Cor.push([m_linegroup.children[i].geometry.vertices[j].x,m_linegroup.children[i].geometry.vertices[j].y]);
        // 	}
        // }
        // var tempLine2 = turf.lineString(tempLine2Cor);
        // var points = new THREE.Vector3(tempPoints.x, tempPoints.y + 500, 0);
        // var tempLine1 = turf.lineString([[points.x, points.y], [points.x, 0]]);
        // var interPoint = turf.lineIntersect(tempLine1, tempLine2);
        // points = new THREE.Vector3(tempPoints.x, interPoint.features[0].geometry.coordinates[1], 0);
        // createTower(points, inx);

        var towMesh = tower1(tempTowerHei);
        towMesh.position.x = tempPoints.x;
        towMesh.position.y = tempPoints.y;
        /****修改****/
        towMesh.position.z = 0;
        towMesh.name = "fixTower";
        towMesh.geometry.name = intersectsTower[0].object.geometry.name;
        scene.add(towMesh);

        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "fixwire1" || scene.children[i].name === "fixwire2" || scene.children[i].name === "fixwire3" || scene.children[i].name === "fixwire4") {
                deleteWire.push(scene.children[i]);
            }
        }
        console.log(deleteWire)
        for (let i = 0; i < deleteWire.length; i++) {
            scene.remove(deleteWire[i]);
        }

        for (let i = 0; i < towerlist.length; i++) {
            if (towerlist[i].Name == towMesh.geometry.name) {
                towerlist[i].TowerHigh = tempTowerHei
            }
        }

        towerlist.sort(compare('Distance'));
        for (let i = 0; i < towerlist.length; i++) {
            towerlist[i].Name = "G" + i;
        }
        ComputeHugeHigh();
        for (let i = m_start; i < m_end; i++) {
            DisplayFawCurve4(towerlist[i], towerlist[i + 1], "fixwire");
        }
        console.log(towerlist);
        towerlist_tabledata = towerlist;
        console.log(towerlist_tabledata);
        GridManager.setAjaxData(towerlist_tableId, {"data": towerlist_tabledata});
        GridManager.refreshGrid(towerlist_tableId);
    }
    if (event.button === 2){
        document.body.style.cursor = "default";
        document.removeEventListener("mousedown",riseTower);
    }
}

//降低杆塔
function fallTower(event){
    document.body.style.cursor = "url(./css/fall.ico) 9 9, default";
    if (event.button === 0) {
        var intersectsTower = getIntersectsObject(event);
        console.log(intersectsTower[0]);
        let tempTowerHei = intersectsTower[0].object.geometry.vertices[7].y / (1 / ydivision * Gridsize );
        console.log("fallTower",tempTowerHei)
        if (tempTowerHei > 24) {
            tempTowerHei -= 3;
            // intersectsTower[0].object.geometry.vertices[7].y = tempTowerHei * (1 / ydivision * Gridsize )
            scene.remove(intersectsTower[0].object);
        } else return tempTowerHei;
        intersectsTower[0].object.renderOrder = tempTowerHei;
        let deleteWire = [];
        //
        /****修改****/
        var tempPoints = intersectsTower[0].object.position;

        var towMesh = tower1(tempTowerHei);
        towMesh.position.x = tempPoints.x;
        towMesh.position.y = tempPoints.y;
        /****修改****/
        towMesh.position.z = 0;
        towMesh.name = "fixTower";
        towMesh.geometry.name = intersectsTower[0].object.geometry.name;
        scene.add(towMesh);
        // console.log(tempTowerHei)
        // console.log(towMesh.geometry.vertices[7].y / (1 / ydivision * Gridsize ));

        for (let i = 0; i < scene.children.length; i++) {
            if (scene.children[i].name === "fixwire1" || scene.children[i].name === "fixwire2" || scene.children[i].name === "fixwire3" || scene.children[i].name === "fixwire4") {
                deleteWire.push(scene.children[i]);
            }
        }
        for (let i = 0; i < deleteWire.length; i++) {
            scene.remove(deleteWire[i]);
        }

        for (let i = 0; i < towerlist.length; i++) {
            if (towerlist[i].Name === intersectsTower[0].object.geometry.name) {
                towerlist[i].TowerHigh = tempTowerHei;
            }
        }

        towerlist.sort(compare('Distance'));
        for (let i = 0; i < towerlist.length; i++) {
            towerlist[i].Name = "G" + i;
        }
        ComputeHugeHigh();
        console.log(towerlist)
        for (let i = m_start; i < m_end; i++) {
            DisplayFawCurve4(towerlist[i], towerlist[i + 1], "fixwire");
        }

        console.log(towerlist);
        towerlist_tabledata = towerlist;
        console.log(towerlist_tabledata);
        GridManager.setAjaxData(towerlist_tableId, {"data": towerlist_tabledata});
        GridManager.refreshGrid(towerlist_tableId);
    }
    if (event.button === 2){
        document.body.style.cursor = "default";
        document.removeEventListener("mousedown",fallTower);
    }
}