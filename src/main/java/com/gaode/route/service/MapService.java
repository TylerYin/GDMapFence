package com.gaode.route.service;

import com.gaode.route.dao.MySqlUtils;
import com.gaode.route.pojo.Shape;

import java.math.BigDecimal;


import javax.servlet.http.HttpServletRequest;

/**
 * @Description
 * @Author Tyler Yin
 */
public class MapService {

    public static String getPolygon() {
        return MySqlUtils.getPolygon();
    }

    public static void savePolygon(HttpServletRequest request) {
        String polyData = request.getParameter("polygonData");
        String[] polyDataArray = polyData.split(";");

        MySqlUtils.deleteShape("2");
        for (String po : polyDataArray) {
            String[] pos = po.split(",");
            Shape point = new Shape();
            point.setLng(new BigDecimal(pos[0]));
            point.setLat(new BigDecimal(pos[1]));
            MySqlUtils.savePolygon(point);
        }
    }

    public static Shape getCircle() {
        return MySqlUtils.getCircle();
    }

    public static void saveCircle(HttpServletRequest request) {
        String circleRadius = request.getParameter("circleRadius");
        String circleCenterLng = request.getParameter("circleCenterLng");
        String circleCenterLat = request.getParameter("circleCenterLat");

        Shape shape = new Shape();
        shape.setLng(new BigDecimal(circleCenterLng));
        shape.setLat(new BigDecimal(circleCenterLat));
        shape.setRadius(new BigDecimal(circleRadius));
        MySqlUtils.deleteShape("1");
        MySqlUtils.saveCircle(shape);
    }
}