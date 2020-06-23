var map = new AMap.Map("container", {
    resizeEnable: true,
    zoom: 13
});

var dataArray;
var beginMark;
var beginPoint;
var beginNum = 0;
var clickListener;

//多边形 全局变量
var polygonEditor;
var polyData = [];

getData();

//给地图增加单击事件及初始化数据
function init() {
    beginPoint = [];
    beginMark = [];
    beginNum = 0;
    polygonEditor = '';
    clickListener = AMap.event.addListener(map, "click", mapOnClick);
    var arr = json2arr(dataArray);
    createPolygon(arr);
}

//后台有数据的话初始化数据
function init2() {
    beginPoint = [];
    beginMark = [];
    beginNum = 0;
    polygonEditor = '';

    // clickListener = AMap.event.addListener(map, "click", mapOnClick);
    var arr = json2arr(dataArray);
    var polygon = createPolygon(arr);
    polygonEditor = createEditor(polygon);
}

//点击事件 点的监听保存
function mapOnClick(e) {
    beginMark.push(addMarker(e.lnglat));
    beginPoint.push(e.lnglat);
    beginNum++;
    if (beginNum == 3) {
        AMap.event.removeListener(clickListener);
        var polygon = createPolygon(beginPoint);
        polygonEditor = createEditor(polygon);
        clearMarks();
    }
}

//多边形实例
function createPolygon(arr) {
    var polygon = new AMap.Polygon({
        map: map,
        path: arr,
        strokeColor: "#0000ff",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#f5deb3",
        fillOpacity: 0.35
    });
    return polygon;
}

//多边形实例编辑、关闭 事件等
function createEditor(polygon) {
    var polygonEditor = new AMap.PolyEditor(map, polygon);
    polygonEditor.open();
    AMap.event.addListener(polygonEditor, 'end', polygonEnd);
    return polygonEditor;
}

//编辑方法
function mapEditor() {
    polygonEditor.open();
}

//关闭方法  关闭时会调用end事件
function closeEditPolygon() {
    polygonEditor.close();
}

//end的事件  返回 多边形坐标位置
function polygonEnd(res) {
    polyData.push(res.target);
}

//console 打印
function appendHideHtml(index, arr) {
    var stringify = JSON.stringify(arr);
    var html = '<input type="hidden" id="index' + index + '" name="paths[]" value="' + stringify + '">';
    $('body').append(html);
    console.log(html);
}

// 清除标记
function clearMarks() {
    map.remove(beginMark);
}

//json to  arr
function json2arr(json) {
    var arr = JSON.parse(json);
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        var line = [];
        line.push(arr[i].lng);
        line.push(arr[i].lat);
        res.push(line);
    }
    return res;
}

// 实例化点标记
function addMarker(lnglat) {
    var marker = new AMap.Marker({
        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        position: lnglat
    });
    marker.setMap(map);
    return marker;
}

/**============================后台数据交互ajax */
//保存
function saveData() {
    var param = {"org": 1, "polyData": polyData.join(';')};
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

//查询
function getData() {
    var param = {"pagenum": 1, "infos": 2};
    $.ajax({
        url: $("#contextPath").val() + "/map/getPolygon",
        type: 'post',
        dataType: 'json',
        data: param,
        async: true,
        success: function (data) {
            if (data != null && data.length > 0) {
                dataArray = JSON.stringify(data);
                init2();
            } else {
                init();
            }
        }
    });
}