var editor = {};
var polygonClickListener;

var polygonArray = [];

var polygonMark = [];
var polygonData = [];
var polygonPoints = [];
var polygonPointNum = 0;

//定义地图画图工具  中心点等
var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 13
});

$(document).ready(function () {
    loadPolygon();
    map.setFitView();
});

function loadPolygon() {
    $.ajax({
        url: $("#contextPath").val() + "/map/getPolygon?dealerId=10000",
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            createPolygon(0, json2arr(JSON.stringify(data)), "red");
        }
    });

    $.ajax({
        url: $("#contextPath").val() + "/map/getPolygon?dealerId=10001",
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data != null && data.length > 0) {
                createPolygon(1, json2arr(JSON.stringify(data)), "blue");
                createPolygonEditor();
            }
            polygonClickListener = AMap.event.addListener(polygonArray[0], "click", clickPolygonOnMap);
        }
    });
}

//创建多边形
function createPolygon(shapeIndex, path, strokeColor) {
    polygonArray[shapeIndex] = new AMap.Polygon({
        map: map,
        path: path,
        strokeColor: strokeColor,
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#f5deb3",
        fillOpacity: 0.35
    });
}

//打开多边形实例编辑
function createPolygonEditor() {
    editor._polygonEditor = new AMap.PolyEditor(map, polygonArray[1]);
    AMap.event.addListener(editor._polygonEditor, 'end', endPolygon);
    AMap.event.addListener(editor._polygonEditor, 'adjust', adjustPolygon);
}

//地图上点击事件
function clickPolygonOnMap(e) {
    polygonPointNum++;
    polygonPoints.push(e.lnglat);
    polygonMark.push(addPolygonMarker(e.lnglat));
    if (polygonPointNum == 3) {
        AMap.event.removeListener(polygonClickListener);
        createPolygon(1, polygonPoints, "blue");
        createPolygonEditor();
        editor._polygonEditor.open();
        clearPolygonMarks();
    }
}

//保存多边形数据
function savePolygonData() {
    if (polygonArray.length != 2) {
        alert("请完成电子围栏绘制");
    } else {
        if (compute()) {
            var param = {"polygonData": polygonData.join(';'), "dealerId": "10001"};
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
        } else {
            alert("绘制的电子围栏越界了，请调整");
        }
    }
}

function clearPolygonData() {
    editor._polygonEditor.close();
    map.remove(polygonArray[1]);
    polygonClickListener = AMap.event.addListener(polygonArray[0], "click", clickPolygonOnMap);
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
    marker.on('dragging',compute());
    marker.setMap(map);
    return marker;
}

//打开编辑多边形
function mapPolygonEditor() {
    var drawShape = $("#drawShape").val();
    if ("0" == drawShape) {
        alert("请选择要绘制的图形");
    } else {
        if ("1" == drawShape) {

        } else {

        }
    }
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

//结束多边形的编辑，返回多边形坐标位置
function adjustPolygon(res) {
    var validShape = compute();
    if (!validShape) {
        alert("绘制的电子围栏越界了，请调整");
    }
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

function compute() {
    if (polygonArray.length == 2) {
        var polygon1_path = polygonArray[0].getPath();
        var polygon2_path = polygonArray[1].getPath();
        return AMap.GeometryUtil.isRingInRing(polygon2_path, polygon1_path);
    }
    return false;
}