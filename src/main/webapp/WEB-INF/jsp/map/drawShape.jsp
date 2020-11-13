<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>电子围栏</title>
    <script src="${pageContext.request.contextPath}/static/jquery-1.8.0.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="${pageContext.request.contextPath}/static/colorbox/jquery.colorbox.js"></script>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/static/colorbox/colorbox.css" />

    <script type="text/javascript">
        $(document).ready(function () {
            $("#drawFirstShapeId").bind("click", function () {
                window.open("${pageContext.request.contextPath}/map/drawCircleAndPolygon");
            });

            $("#drawSecondShapeId").bind("click", function () {
                window.open("${pageContext.request.contextPath}/map/drawInnerShape");
            });
        });
    </script>
</head>
<body>

<div>
    <span>
        <input type="button" name="drawFirstShapeId" id="drawFirstShapeId" value="绘制一级电子围栏">
    </span>

    <span>
        <input type="button" name="drawSecondShapeId" id="drawSecondShapeId" value="绘制二级电子围栏">
    </span>
</div>

</body>
</html>