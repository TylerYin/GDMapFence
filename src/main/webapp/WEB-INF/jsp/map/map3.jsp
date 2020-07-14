<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>电子围栏</title>
    <link rel="stylesheet" href="http://cache.amap.com/lbs/static/main1119.css"/>
    <script src="http://webapi.amap.com/maps?v=1.3&key=48ac9b440beba27121085f08501a0353&plugin=AMap.PolyEditor"></script>
    <script src="http://webapi.amap.com/maps?v=1.4.6&key=48ac9b440beba27121085f08501a0353&plugin=AMap.PolyEditor,AMap.CircleEditor"></script>
    <script type="text/javascript" src="http://cache.amap.com/lbs/static/addToolbar.js"></script>
    <script src="${pageContext.request.contextPath}/static/jquery-1.8.0.min.js" type="text/javascript" charset="utf-8"></script>
</head>
<body>
<div id="container"></div>
<div class="button-group">
    <div>
        <input name="" type="button" class="button" value="开始绘制多边形" onClick="mapPolygonEditor();" style="width: 110px; background-color: #0D9BF2;"/>
        <input name="" type="button" class="button" value="结束绘制多边形" onClick="closePolygonEdit();" style="width: 110px; background-color: #0D9BF2;"/>
        <input name="" type="button" class="button" value="保存多边形围栏数据" onClick="savePolygonData();" style="width: 110px; background-color: #0D9BF2;"/>
    </div>
    <div>
        <input name="" type="button" class="button" value="开始绘制圆形" onClick="startEditCircle()" style="width: 110px; background-color: #AD9BF2;"/>
        <input name="" type="button" class="button" value="结束绘制圆形" onClick="closeEditCircle()" style="width: 110px; background-color: #AD9BF2;"/>
        <input name="" type="button" class="button" value="保存圆形围栏数据" onClick="saveCircleData();" style="width: 110px; background-color: #AD9BF2;"/>
    </div>
</div>
</body>
<input type="hidden" value="${pageContext.request.contextPath}" id="contextPath">
<script src="${pageContext.request.contextPath}/static/map3.js" type="text/javascript"></script>
</html>