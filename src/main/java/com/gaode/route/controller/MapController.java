package com.gaode.route.controller;

import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.gaode.route.service.MapService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getPoly", method = RequestMethod.POST)
    public void getPoly(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // 将请求、响应的编码均设置为UTF-8（防止中文乱码）
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        // 调用Api处理服务
        String orgLocation = MapService.getOrgLocation();

        // 响应消息
        PrintWriter out = response.getWriter();
        out.print(orgLocation);
        out.close();
        out = null;
    }

    /***
     * 多边形保存
     * @param request
     * @param response
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/savePoly", method = RequestMethod.POST)
    public void savePoly(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // 将请求、响应的编码均设置为UTF-8（防止中文乱码）
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        // 调用Api处理服务
        String orgloc = MapService.saveOrgLocation(request);

        // 响应消息
        PrintWriter out = response.getWriter();
        out.print(orgloc);
        out.close();
        out = null;
    }
}
