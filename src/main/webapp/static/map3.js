var editor = {};
var circleClickListener;
var polygonClickListener;

var circleMark = [];
var circlePoints = [];
var circlePointNum = 0;
var circleRadius, circleCenterLng, circleCenterLat;

var polygonMark = [];
var polygonData = [];
var polygonPoints = [];
var polygonPointNum = 0;

//定义地图画图工具  中心点等
var map = new AMap.Map("container", {
    resizeEnable: true,
    // 地图中心点, 不设置的话，默认为当前定位位置
    // center: [115.48, 38.85],
    // 地图显示的缩放级别
    zoom: 13
});

$(document).ready(function () {
    // 两个绘图不能同时打开，监听器有冲突

    //loadPolygon();
    loadCircle();
    map.setFitView();
});

// ====================================================================多边形电子围栏====================================================================
function loadPolygon() {
    $.ajax({
        url: $("#contextPath").val() + "/map/getPolygon",
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data != null && data.length > 0) {
                createPolygon(json2arr(JSON.stringify(data)));
                createPolygonEditor();
            } else {
                polygonClickListener = AMap.event.addListener(map, "click", clickPolygonOnMap);
            }
        }
    });
}

//创建多边形
function createPolygon(array) {
    editor._polygon = new AMap.Polygon({
        map: map,
        path: array,
        strokeColor: "#0000ff",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#f5deb3",
        fillOpacity: 0.35
    });
}

//打开多边形实例编辑
function createPolygonEditor() {
    editor._polygonEditor = new AMap.PolyEditor(map, editor._polygon);
    AMap.event.addListener(editor._polygonEditor, 'end', endPolygon);
}

//地图上点击事件
function clickPolygonOnMap(e) {
    polygonPointNum++;
    polygonPoints.push(e.lnglat);
    polygonMark.push(addPolygonMarker(e.lnglat));
    if (polygonPointNum == 3) {
        AMap.event.removeListener(polygonClickListener);

        createPolygon(polygonPoints);
        createPolygonEditor();
        editor._polygonEditor.open();
        clearPolygonMarks();
    }
}

//保存多边形数据
function savePolygonData() {
    var param = {"polygonData": polygonData.join(';')};
    $.ajax({
        url: $("#contextPath").val() + "/map/savePolygon",
        type: 'post',
        dataType: 'json',
        data: param,
        async: true,
        success: function (data) {
            alert("多边形数据保存成功！");
        }
    });
}

// 清除多边形标记
function clearPolygonMarks() {
    map.remove(polygonMark);
}

// 实例化多边形点标记
function addPolygonMarker(lnglat) {
    var marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglat
    });
    marker.setMap(map);
    return marker;
}

//打开编辑多边形
function mapPolygonEditor() {
    editor._polygonEditor.open();
}

//关闭多边形方法编辑,关闭时会调用end事件
function closePolygonEdit() {
    editor._polygonEditor.close();
}

//结束多边形的编辑，返回多边形坐标位置
function endPolygon(res) {
    polygonData.push(res.target);
}

// ====================================================================圆形电子围栏====================================================================
function loadCircle() {
    $.ajax({
        url: $("#contextPath").val() + "/map/getCircle",
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data != null) {
                createCircle(data.lng, data.lat, data.radius);
                createCircleEditor();
            } else {
                circleClickListener = AMap.event.addListener(map, "click", clickCircleOnMap);
            }
        }
    });
}

//创建圆形
function createCircle(lng, lat, radius) {
    editor._circle = new AMap.Circle({
        map: map,
        center: [lng, lat],
        radius: radius,
        strokeColor: "#F33",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#ee2200",
        fillOpacity: 0.35
    });
}

//打开圆形实例编辑
function createCircleEditor() {
    editor._circleEditor = new AMap.CircleEditor(map, editor._circle);
    AMap.event.addListener(editor._circleEditor, 'end', endCircle);
}

//保存圆形数据
function saveCircleData() {
    var param = {"circleRadius": circleRadius, "circleCenterLng": circleCenterLng, "circleCenterLat": circleCenterLat};
    $.ajax({
        url: $("#contextPath").val() + "/map/saveCircle",
        type: 'post',
        dataType: 'json',
        data: param,
        async: true,
        success: function (data) {
            alert("圆形数据保存成功！");
        }
    });
}

function startEditCircle() {
    editor._circleEditor.open();
}

function closeEditCircle() {
    editor._circleEditor.close();
}

//结束圆形的编辑
function endCircle(res) {
    circleRadius = res.target.getRadius();
    circleCenterLng = res.target.getCenter().O;
    circleCenterLat = res.target.getCenter().P;
}

//地图上点击事件
function clickCircleOnMap(e) {
    circlePointNum++;
    circlePoints.push(e.lnglat);
    circleMark.push(addCircleMarker(e.lnglat));

    if (circlePointNum == 2) {
        var p1 = new AMap.LngLat(circlePoints[0].O, circlePoints[0].P);
        var p2 = new AMap.LngLat(circlePoints[1].O, circlePoints[1].P);
        var radius = Math.round(p1.distance(p2));

        AMap.event.removeListener(circleClickListener);
        createCircle(circlePoints[0].O, circlePoints[0].P, radius);
        createCircleEditor();
        editor._circleEditor.open();
        clearCircleMarks();
    }
}

// 清除圆形标记
function clearCircleMarks() {
    map.remove(circleMark);
}

// 实例化圆形标记
function addCircleMarker(lnglat) {
    var marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglat
    });
    marker.setMap(map);
    return marker;
}

// ====================================================================工具====================================================================
function json2arr(json) {
    var res = [];
    var arr = JSON.parse(json);
    for (var i = 0; i < arr.length; i++) {
        var line = [];
        line.push(arr[i].lng);
        line.push(arr[i].lat);
        res.push(line);
    }
    return res;
}