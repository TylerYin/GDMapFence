var polygonMark = [];
var polygonData = [];
var polygonPoints = [];
var polygonPointNum = 0;

var polygon;
var polygonEditor;
var polygonClickListener;

//定义地图画图工具  中心点等
var map = new AMap.Map("container", {
    resizeEnable: true,
    // 地图中心点, 不设置的话，默认为当前定位位置
    // center: [115.48, 38.85],
    // 地图显示的缩放级别
    zoom: 13
});

$(document).ready(function () {
    loadPolygonData();
});

// ====================================================================多边形电子围栏====================================================================
function loadPolygonData() {
    var param = {"pagenum": 1, "infos": 2};
    $.ajax({
        url: $("#contextPath").val() + "/map/getPolygon",
        type: 'post',
        dataType: 'json',
        data: param,
        async: false,
        success: function (data) {
            if (data != null && data.length > 0) {
                createPolygon(json2arr(JSON.stringify(data)));
                createPolygonEditor();
            } else {
                polygonClickListener = AMap.event.addListener(map, "click", clickOnMap);
            }
        }
    });
}

//创建多边形
function createPolygon(array) {
    polygon = new AMap.Polygon({
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
    polygonEditor = new AMap.PolyEditor(map, polygon);
    AMap.event.addListener(polygonEditor, 'end', endPolygon);
}

//地图上点击事件
function clickOnMap(e) {
    polygonPointNum++;
    polygonPoints.push(e.lnglat);
    polygonMark.push(addPolygonMarker(e.lnglat));
    if (polygonPointNum == 3) {
        AMap.event.removeListener(polygonClickListener);

        createPolygon(polygonPoints);
        createPolygonEditor();
        polygonEditor.open();
        clearPolygonMarks();
    }
}

//保存多边形数据
function savePolygonData() {
    var param = {"org": 1, "polygonData": polygonData.join(';')};
    $.ajax({
        url: $("#contextPath").val() + "/map/savePolygon",
        type: 'post',
        dataType: 'json',
        data: param,
        async: true,
        success: function (data) {
            alert("数据保存成功！");
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
    polygonEditor.open();
}

//关闭多边形方法编辑,关闭时会调用end事件
function closePolygonEdit() {
    polygonEditor.close();
}

//结束多边形的编辑，返回多边形坐标位置
function endPolygon(res) {
    polygonData.push(res.target);
}

// ====================================================================圆形电子围栏====================================================================
var editor = {};

function loadCircle() {
    editor._circle = (function () {
        var circle = new AMap.Circle({
            center: [115.395368002000003, 38.862902000000003],// 圆心位置
            radius: 1000, //半径
            strokeColor: "#F33", //线颜色
            strokeOpacity: 1, //线透明度
            strokeWeight: 3, //线粗细度
            fillColor: "#ee2200", //填充颜色
            fillOpacity: 0.35//填充透明度
        });
        circle.setMap(map);
        return circle;
    })();
    editor._circleEditor = new AMap.CircleEditor(map, editor._circle);
}

editor.startEditCircle = function () {
    editor._circleEditor.open();
};

editor.closeEditCircle = function () {
    editor._circleEditor.close();
};

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