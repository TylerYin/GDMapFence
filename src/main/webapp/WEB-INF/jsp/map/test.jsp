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
</body>
<input type="hidden" value="${pageContext.request.contextPath}" id="contextPath">
<script src="${pageContext.request.contextPath}/static/test.js" type="text/javascript" charset="utf-8"></script>
</html>