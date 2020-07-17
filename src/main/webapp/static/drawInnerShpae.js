var polygonData = [];
var polygonClickListener;

var circleClickListener;
var circleRadius, circleCenterLng, circleCenterLat;

var editor = {};
var markers = [];
var points = [];
var shapeArray = [];

var pointNum = 0;
var drawShapeType;
var parentShapeType;

var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 13
});

$(document).ready(function () {
    loadShape();
    map.setFitView();
});

function loadShape() {
    $.ajax({
        url: $("#contextPath").val() + "/map/getShape?dealerId=10000",
        type: 'post',
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data.points.length > 0) {
                parentShapeType = data.type;
                if ("1" == data.type) {
                    createCircle(0, data.points[0].lng, data.points[0].lat, data.radius, "red");
                } else {
                    createPolygon(0, json2arr(data.points), "red");
                }
            }
        }
    });

    $.ajax({
        url: $("#contextPath").val() + "/map/getShape?dealerId=10001",
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
                $("#drawShape").val(data.type);
                $("#drawShape").attr("disabled", true);

                drawShapeType = data.type;
                if ("1" == data.type) {
                    createCircle(1, data.points[0].lng, data.points[0].lat, data.radius, "blue");
                } else {
                    createPolygon(1, json2arr(data.points), "blue");
                }
            }
        }
    });
}

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
            createCircle(1, points[0].O, points[0].P, radius, "blue");
            createCircleEditor();
            editor._circleEditor.open();
            clearMarker();
        }
    } else {
        if (pointNum == 3) {
            AMap.event.removeListener(polygonClickListener);
            createPolygon(1, points, "blue");
            createPolygonEditor();
            editor._polygonEditor.open();
            clearMarker();
        }
    }
}

function saveShape() {
    if (shapeArray.length != 2) {
        alert("请完成电子围栏绘制");
    } else {
        if (isRingInRing()) {
            var param;
            if (1 == drawShapeType) {
                param = {
                    "circleRadius": circleRadius,
                    "circleCenterLng": circleCenterLng,
                    "circleCenterLat": circleCenterLat,
                    "dealerId": "10001",
                    "drawShapeType": drawShapeType
                };
            } else {
                param = {"polygonData": polygonData.join(';'), "dealerId": "10001", "drawShapeType": drawShapeType};
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
        } else {
            alert("电子围栏越界，请调整");
        }
    }
}

function clearShape() {
    map.remove(shapeArray[1]);
    shapeArray[1] = null;
    drawShapeType = $("#drawShape").val();
    if ("1" == drawShapeType) {
        editor._circleEditor.close();
        AMap.event.removeListener(circleClickListener);
    } else {
        editor._polygonEditor.close();
        AMap.event.removeListener(polygonClickListener);
    }

    $("#drawShape").val(0);
    $("#drawShape").removeAttr("disabled");
    $("#endDraw").attr("disabled", true);
    $("#endDraw").css("color", "gray");
    $("#clear").attr("disabled", true);
    $("#clear").css("color", "gray");
    $("#save").attr("disabled", true);
    $("#save").css("color", "gray");
}

function createPolygon(shapeIndex, path, strokeColor) {
    shapeArray[shapeIndex] = new AMap.Polygon({
        map: map,
        path: path,
        strokeColor: strokeColor,
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#f5deb3",
        fillOpacity: 0.35
    });
}

function createCircle(shapeIndex, lng, lat, radius, strokeColor) {
    shapeArray[shapeIndex] = new AMap.Circle({
        map: map,
        center: [lng, lat],
        radius: radius,
        strokeColor: strokeColor,
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#ee2200",
        fillOpacity: 0.35
    });
}

function openEditor() {
    $("#save").attr("disabled", true);
    $("#save").css("color", "gray");

    drawShapeType = $("#drawShape").val();
    if ("0" == drawShapeType) {
        alert("请选择要绘制的图形");
    } else {
        $("#drawShape").attr("disabled", true);
        $("#startDraw").attr("disabled", true);
        $("#startDraw").css("color", "gray");
        $("#endDraw").removeAttr("disabled");
        $("#endDraw").css("color", "white");
        $("#clear").removeAttr("disabled");
        $("#clear").css("color", "white");

        if ("1" == drawShapeType) {
            circleClickListener = AMap.event.addListener(shapeArray[0], "click", clickOnMap);
            if (undefined == editor._circleEditor) {
                createCircleEditor();
            }
            editor._circleEditor.open();
        } else {
            polygonClickListener = AMap.event.addListener(shapeArray[0], "click", clickOnMap);
            if (undefined == editor._polygonEditor) {
                createPolygonEditor();
            }
            editor._polygonEditor.open();
        }
    }
}

function createPolygonEditor() {
    editor._polygonEditor = new AMap.PolyEditor(map, shapeArray[1]);
    AMap.event.addListener(editor._polygonEditor, 'end', endEditor);
    AMap.event.addListener(editor._polygonEditor, 'adjust', adjustShape);
}

function createCircleEditor() {
    editor._circleEditor = new AMap.CircleEditor(map, shapeArray[1]);
    AMap.event.addListener(editor._circleEditor, 'end', endEditor);
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

function closeEditor() {
    if ("1" == drawShapeType) {
        editor._circleEditor.close();
    } else {
        editor._polygonEditor.close();
    }
}

function clearMarker() {
    map.remove(markers);
}

function addMarker(lnglat) {
    var marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglat
    });
    if ("2" == drawShapeType && (undefined != shapeArray[1] && null != shapeArray[1])) {
        marker.on('dragging', isRingInRing());
    }
    marker.setMap(map);
    return marker;
}

function adjustShape(res) {
    if (!isRingInRing()) {
        alert("电子围栏越界了");
    }
}

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

function isRingInRing() {
    var shape1_path;
    var shape2_path;

    if ("1" == parentShapeType) {
        shape1_path = convertCircleToPolygon(shapeArray[0].getCenter(), shapeArray[0].getRadius());
    } else {
        shape1_path = shapeArray[0].getPath();
    }

    if ("1" == drawShapeType) {
        shape2_path = convertCircleToPolygon(shapeArray[1].getCenter(), shapeArray[1].getRadius());
    } else {
        shape2_path = shapeArray[1].getPath();
    }

    return AMap.GeometryUtil.isRingInRing(shape2_path, shape1_path);
}

function convertCircleToPolygon(centerPoint, radius) {
    var r = 6371000.79;
    var numPoints = 60;
    var phase = 2 * Math.PI / numPoints;

    var lngLats = [];
    for (var i = 0; i < numPoints; i++) {
        var dx = (radius * Math.cos(i * phase));
        var dy = (radius * Math.sin(i * phase));

        var dlng = dx / (r * Math.cos(centerPoint.getLat() * Math.PI / 180) * Math.PI / 180);
        var dlat = dy / (r * Math.PI / 180);
        var newlng = centerPoint.getLng() + dlng;
        lngLats.push(new AMap.LngLat(newlng, centerPoint.getLat() + dlat));
    }
    return lngLats;
}