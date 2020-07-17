var polygonData = [];
var polygonClickListener;

var circleClickListener;
var circleRadius, circleCenterLng, circleCenterLat;

var editor = {};
var markers = [];
var points = [];

var pointNum = 0;
var drawShapeType;
var isEditShape = false;
var isClearShape = false;

//定义地图画图工具  中心点等
var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 13
});

$(document).ready(function () {
    $.ajax({
        url: $("#contextPath").val() + "/map/getShape?dealerId=10000",
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            $("#endDraw").attr("disabled", true);
            $("#endDraw").css("color", "gray");
            $("#save").attr("disabled", true);
            $("#save").css("color", "gray");
            $("#clear").attr("disabled", true);
            $("#clear").css("color", "gray");

            if (data.points.length > 0) {
                isEditShape = true;
                $("#drawShape").val(data.type);
                $("#drawShape").attr("disabled", true);

                if ("1" == data.type) {
                    createCircle(data.points[0].lng, data.points[0].lat, data.radius);
                    createCircleEditor();
                } else {
                    createPolygon(json2arr(data.points));
                    createPolygonEditor();
                }
            }
        }
    });
    map.setFitView();
});

function openEditor() {
    $("#save").attr("disabled", true);
    $("#save").css("color", "gray");
    $("#clear").removeAttr("disabled");
    $("#clear").css("color", "white");

    drawShapeType = $("#drawShape").val();
    if ("0" == drawShapeType) {
        alert("请选择要绘制的图形");
    } else {
        $("#drawShape").attr("disabled", true);
        $("#endDraw").removeAttr("disabled");
        $("#endDraw").css("color", "white");
        $("#startDraw").css("color", "gray");
        $("#startDraw").attr("disabled", true);

        if ("1" == drawShapeType) {
            if (!isEditShape && (null == circleClickListener || undefined == circleClickListener)) {
                circleClickListener = AMap.event.addListener(map, "click", clickOnMap);
            }
            if (undefined == editor._circleEditor) {
                createCircleEditor();
            }
            editor._circleEditor.open();
        } else {
            if (!isEditShape && (null == polygonClickListener || undefined == polygonClickListener)) {
                polygonClickListener = AMap.event.addListener(map, "click", clickOnMap);
            }
            if (undefined == editor._polygonEditor) {
                createPolygonEditor();
            }
            editor._polygonEditor.open();
        }
    }
}

function closeEditor() {
    if ("1" == drawShapeType) {
        editor._circleEditor.close();
    } else {
        editor._polygonEditor.close();
    }
}

function endEditor(res) {
    $("#startDraw").removeAttr("disabled");
    $("#startDraw").css("color", "white");
    $("#endDraw").attr("disabled", true);
    $("#endDraw").css("color", "gray");
    $("#save").removeAttr("disabled");
    $("#save").css("color", "white");

    if ("1" == drawShapeType) {
        circleRadius = res.target.getRadius();
        circleCenterLng = res.target.getCenter().O;
        circleCenterLat = res.target.getCenter().P;
    } else {
        polygonData.push(res.target);
    }
}

function addMarker(lnglat) {
    var marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglat
    });
    marker.setMap(map);
    return marker;
}

function clearMarker() {
    map.remove(markers);
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

//地图上点击事件
function clickOnMap(e) {
    pointNum++;
    points.push(e.lnglat);
    markers.push(addMarker(e.lnglat));
    if (1 == drawShapeType) {
        if (pointNum == 2) {
            var p1 = new AMap.LngLat(points[0].O, points[0].P);
            var p2 = new AMap.LngLat(points[1].O, points[1].P);
            var radius = Math.round(p1.distance(p2));

            AMap.event.removeListener(circleClickListener);
            createCircle(points[0].O, points[0].P, radius);
            createCircleEditor();
            editor._circleEditor.open();
            clearMarker();
        }
    } else {
        if (pointNum == 3) {
            AMap.event.removeListener(polygonClickListener);
            createPolygon(points);
            createPolygonEditor();
            editor._polygonEditor.open();
            clearMarker();
        }
    }
}

//打开多边形实例编辑
function createPolygonEditor() {
    editor._polygonEditor = new AMap.PolyEditor(map, editor._polygon);
    AMap.event.addListener(editor._polygonEditor, 'end', endEditor);
}

//打开圆形实例编辑
function createCircleEditor() {
    editor._circleEditor = new AMap.CircleEditor(map, editor._circle);
    AMap.event.addListener(editor._circleEditor, 'end', endEditor);
}

function saveShape() {
    var param;
    if ("1" == drawShapeType) {
        param = {
            "circleRadius": circleRadius,
            "circleCenterLng": circleCenterLng,
            "circleCenterLat": circleCenterLat,
            "dealerId": "10000",
            "drawShapeType": drawShapeType
        };
    } else {
        param = {"polygonData": polygonData.join(';'), "dealerId": "10000", "drawShapeType": drawShapeType};
    }

    $.ajax({
        url: $("#contextPath").val() + "/map/saveShape",
        type: 'post',
        dataType: 'json',
        data: param,
        async: true,
        success: function (data) {
            alert("电子围栏保存成功！");
        }
    });

    $("#save").attr("disabled", true);
    $("#save").css("color", "gray");
    $("#clear").attr("disabled", true);
    $("#clear").css("color", "gray");
}

function clearShape() {
    isClearShape = true;
    isEditShape = false;

    clearMap();

    $("#drawShape").val(0);
    $("#drawShape").removeAttr("disabled");
    $("#save").attr("disabled", true);
    $("#save").css("color", "gray");
    $("#clear").attr("disabled", true);
    $("#clear").css("color", "gray");
    $("#startDraw").removeAttr("disabled");
    $("#startDraw").css("color", "white");
    $("#endDraw").attr("disabled", true);
    $("#endDraw").css("color", "gray");
}

function clearMap() {
    if ("1" == drawShapeType) {
        editor._circleEditor.close();
        map.remove(editor._circle);
    } else {
        editor._polygonEditor.close();
        map.remove(editor._polygon);
    }
}

//格式转换
function json2arr(json) {
    var res = [];
    for (var i = 0; i < json.length; i++) {
        var line = [];
        line.push(json[i].lng);
        line.push(json[i].lat);
        res.push(line);
    }
    return res;
}