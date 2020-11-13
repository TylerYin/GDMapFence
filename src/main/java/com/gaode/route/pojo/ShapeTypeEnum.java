package com.gaode.route.pojo;

/**
 * @Version: 1.0
 * @Description:
 * @Date: 2020-07-15 14:29
 * @Author: Tyler Yin
 * @Project: GaoDeMapFence
 **/
public enum ShapeTypeEnum {
    CIRCLE(1, "圆形"), POLYGON(2, "多边形");

    private int type;
    private String name;

    ShapeTypeEnum(int type, String name) {
        this.type = type;
        this.name = name;
    }

    public int getType() {
        return type;
    }

    public String getName() {
        return name;
    }
}