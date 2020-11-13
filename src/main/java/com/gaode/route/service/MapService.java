package com.gaode.route.service;

import com.gaode.route.dao.MySqlUtils;
import com.gaode.route.pojo.Point;
import com.gaode.route.pojo.Shape;
import com.gaode.route.pojo.ShapeTypeEnum;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


import javax.servlet.http.HttpServletRequest;

/**
 * @Description
 * @Author Tyler Yin
 */
@Service
public class MapService {
    public Shape getShape(String dealerId) {
        return MySqlUtils.getShape(dealerId);
    }

    public void saveShape(HttpServletRequest request) {
        int drawShapeType = Integer.valueOf(request.getParameter("drawShapeType"));
        if (ShapeTypeEnum.CIRCLE.getType() == drawShapeType) {
            saveCircle(request);
        } else {
            savePolygon(request);
        }
    }

    private void savePolygon(HttpServletRequest request) {
        String dealerId = request.getParameter("dealerId");
        String polyData = request.getParameter("polygonData");
        String[] polyDataArray = polyData.split(";");

        Shape shape = new Shape();
        shape.setDealerId(dealerId);

        List<Point> points = new ArrayList<>();
        for (String po : polyDataArray) {
            String[] pos = po.split(",");
            Point point = new Point();
            point.setLng(new BigDecimal(pos[0]));
            point.setLat(new BigDecimal(pos[1]));
            points.add(point);
        }
        shape.setPoints(points);

        MySqlUtils.deleteShape(null, dealerId);
        MySqlUtils.savePolygon(shape);
    }

    private void saveCircle(HttpServletRequest request) {
        String dealerId = request.getParameter("dealerId");
        String circleRadius = request.getParameter("circleRadius");
        String circleCenterLng = request.getParameter("circleCenterLng");
        String circleCenterLat = request.getParameter("circleCenterLat");

        Shape shape = new Shape();
        shape.setRadius(new BigDecimal(circleRadius));
        shape.setDealerId(dealerId);

        List<Point> points = new ArrayList<>();
        Point point = new Point();
        point.setLng(new BigDecimal(circleCenterLng));
        point.setLat(new BigDecimal(circleCenterLat));
        points.add(point);
        shape.setPoints(points);

        MySqlUtils.deleteShape(null, dealerId);
        MySqlUtils.saveCircle(shape);
    }
}