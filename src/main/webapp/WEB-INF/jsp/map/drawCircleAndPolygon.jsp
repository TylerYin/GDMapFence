<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
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
        <select name="drawShape" id="drawShape" style="width: 120px; height: 29px; background-color: #0D9BF2;"/>
            <option style="height: 25px;" value="0">选择绘制图形</option>
            <option style="height: 25px;" value="1">绘制圆形</option>
            <option style="height: 25px;" value="2">绘制多边形</option>
        </select>
        <input name="startDraw" id="startDraw" type="button" class="button" value="开始绘制" onClick="openEditor();" style="width: 110px; background-color: #0D9BF2;"/>
        <input name="endDraw" id="endDraw" type="button" class="button" value="结束绘制" onClick="closeEditor();" style="width: 110px; background-color: #0D9BF2;"/>
        <input name="save" id="save" type="button" class="button" value="保存" onClick="saveShape();" style="width: 110px; background-color: #0D9BF2;"/>
        <input name="clear" id="clear" type="button" class="button" value="清除" onClick="clearShape();" style="width: 80px; background-color: #0D9BF2;"/>
    </div>
</div>
</body>
<input type="hidden" value="${pageContext.request.contextPath}" id="contextPath">
<script src="${pageContext.request.contextPath}/static/drawCircleAndPolygon.js" type="text/javascript"></script>
</html>