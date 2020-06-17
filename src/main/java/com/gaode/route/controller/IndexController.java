package com.gaode.route.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @Author: Tyler Yin
 * @Date: 2020-06-16 16:10
 * @Description:
 **/
@Controller
public class IndexController {
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index() {
        System.out.print("hello");
        return "index";
    }
}