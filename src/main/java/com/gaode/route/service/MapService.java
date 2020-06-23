package com.gaode.route.service;

import com.gaode.route.dao.MySqlUtils;
import com.gaode.route.pojo.OrgLocation;

import java.math.BigDecimal;


import javax.servlet.http.HttpServletRequest;

/**
 * @Description MySQL Config file
 * @Author Tyler Yin
 */
public class MapService {

    public static String getOrgLocation() {
        return MySqlUtils.getOrgLocation();
    }

    public static String saveOrgLocation(HttpServletRequest request) {
        String org = request.getParameter("org");

        String polyData = request.getParameter("polygonData");
        String[] polyDataArray = polyData.split(";");

        MySqlUtils.deleteOrgLocation();
        for (String po : polyDataArray) {
            String[] pos = po.split(",");
            OrgLocation ol = new OrgLocation();
            ol.setLng(new BigDecimal(pos[0]));
            ol.setLat(new BigDecimal(pos[1]));
            ol.setOrgCode(Integer.parseInt(org));
            MySqlUtils.saveOrgLocation(ol);
        }
        System.out.println(polyData);
        return null;
    }
}