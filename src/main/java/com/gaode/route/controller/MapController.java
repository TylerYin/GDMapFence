package com.gaode.route.controller;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.gaode.route.pojo.Shape;
import com.gaode.route.service.MapService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.PrintWriter;

/**
 * @Description MySQL Config file
 * @Author Tyler Yin
 */
@Controller
@RequestMapping(value = "/map")
public class MapController {
    /***
     * 多边形查询
     * @return
     */
    @RequestMapping(value = "/{num}")
    public String hello(@PathVariable("num") String num, HttpServletRequest request, HttpServletResponse response, Model model) {
        System.out.println("spring mvc hello world!");
        return "map/map" + num;
    }

    /***
     * 多边形查询
     * @return
     */
    @RequestMapping(value = "/test")
    public String test(HttpServletRequest request, HttpServletResponse response, Model model) {
        System.out.println("spring mvc hello world!");
        return "map/test";
    }

    /***
     * 多边形查询
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getPolygon", method = RequestMethod.POST)
    public void getPolygon(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        String shape = MapService.getPolygon();
        PrintWriter out = response.getWriter();
        out.print(shape);
        out.close();
    }

    /***
     * 圆形查询
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @ResponseBody
    @RequestMapping(value = "/getCircle", method = RequestMethod.POST)
    public Shape getCircle(HttpServletRequest request, HttpServletResponse response) throws Exception {
        return MapService.getCircle();
    }

    /***
     * 多边形保存
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/savePolygon", method = RequestMethod.POST)
    public void savePolygon(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        MapService.savePolygon(request);
    }

    /***
     * 圆形保存
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/saveCircle", method = RequestMethod.POST)
    public void saveCircle(HttpServletRequest request, HttpServletResponse response) throws Exception {
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        MapService.saveCircle(request);
    }
}