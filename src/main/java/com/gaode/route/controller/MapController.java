package com.gaode.route.controller;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.gaode.route.pojo.Shape;
import com.gaode.route.service.MapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * @Description MySQL Config file
 * @Author Tyler Yin
 */
@Controller
@RequestMapping(value = "/map")
public class MapController {

    @Autowired
    private MapService mapService;

    /***
     * 绘制电子围栏
     * @return
     */
    @RequestMapping(value = "/drawCircleAndPolygon")
    public String drawCircleAndPolygon(HttpServletRequest request, HttpServletResponse response, Model model) {
        return "map/drawCircleAndPolygon";
    }

    /***
     * 多边形查询
     * @return
     */
    @RequestMapping(value = "/drawInnerShape")
    public String test(HttpServletRequest request, HttpServletResponse response, Model model) {
        System.out.println("spring mvc hello world!");
        return "map/drawInnerShape";
    }

    /***
     * 电子围栏查询
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping(value = "/getShape", method = RequestMethod.POST)
    public Shape getShape(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        String dealerId = request.getParameter("dealerId");
        return mapService.getShape(dealerId);
    }

    /***
     * 电子围栏保存
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/saveShape", method = RequestMethod.POST)
    public void saveShape(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        mapService.saveShape(request);
    }
}