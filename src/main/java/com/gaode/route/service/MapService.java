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

    private final static String PARENT_DEALER_ID = "10000";

    public static String getPolygon() {
        return MySqlUtils.getPolygon();
    }

    public static void savePolygon(HttpServletRequest request) {
        String dealerId = request.getParameter("dealerId");
        String polyData = request.getParameter("polygonData");
        String[] polyDataArray = polyData.split(";");

        // 测试用，只删除上级经销商的电子围栏区域
        if (dealerId.equals(PARENT_DEALER_ID)) {
            MySqlUtils.deleteShape("2");
        }

        for (String po : polyDataArray) {
            String[] pos = po.split(",");
            Shape point = new Shape();
            point.setLng(new BigDecimal(pos[0]));
            point.setLat(new BigDecimal(pos[1]));
            point.setDealerId(dealerId);
            MySqlUtils.savePolygon(point);
        }
    }

    public static Shape getCircle() {
        return MySqlUtils.getCircle();
    }

    public static void saveCircle(HttpServletRequest request) {
        String dealerId = request.getParameter("dealerId");
        String circleRadius = request.getParameter("circleRadius");
        String circleCenterLng = request.getParameter("circleCenterLng");
        String circleCenterLat = request.getParameter("circleCenterLat");

        Shape shape = new Shape();
        shape.setLng(new BigDecimal(circleCenterLng));
        shape.setLat(new BigDecimal(circleCenterLat));
        shape.setRadius(new BigDecimal(circleRadius));
        shape.setDealerId(dealerId);

        // 测试用，只删除上级经销商的电子围栏区域
        if (shape.getDealerId().equals(PARENT_DEALER_ID)) {
            MySqlUtils.deleteShape("1");
        }

        MySqlUtils.saveCircle(shape);
    }
}