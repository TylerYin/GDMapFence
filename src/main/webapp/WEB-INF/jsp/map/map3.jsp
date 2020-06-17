<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>编辑折线、多边形、圆</title>
    <link rel="stylesheet" href="http://cache.amap.com/lbs/static/main1119.css"/>
    <script src="http://webapi.amap.com/maps?v=1.3&key=48ac9b440beba27121085f08501a0353&plugin=AMap.PolyEditor"></script>
    <script type="text/javascript" src="http://cache.amap.com/lbs/static/addToolbar.js"></script>
    <script src="${pageContext.request.contextPath}/static/jquery-1.8.0.min.js" type="text/javascript" charset="utf-8"></script>
</head>
<body>
<div id="container"></div>
<div class="button-group">
    <input name="openmap" type="button" class="button" value="地图编辑" onClick="mapEditor();"/>
    <input name="closemap" type="button" class="button" value="地图编辑完成" onClick="closeEditPolygon();"/>
    <input name="savemap" type="button" class="button" value="保存围栏数据" onClick="saveData();"/>
</div>
<script>
    //定义地图画图工具  中心点等
    var editorTool;
    var map = new AMap.Map("container", {
        resizeEnable: true,

        //地图中心点, 不设置的话，默认为当前定位位置
        center: [115.48, 38.85],

        //地图显示的缩放级别
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

    //var resPolygon = [];
    //var resNum = 0;
    //加载后台数据

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
        // document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
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
        //某一点是否在多边形中
        //   resPolygon.push(res.target);
        //alert(resPolygon[resNum].contains([116.386328, 39.913818]));
        //console 打印
        //  appendHideHtml(resNum,res.target.getPath());

        //  resNum++;
        //   init();
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
            url: "savePoly",
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
            url: "getPoly",
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
</script>
</body>
</html>