package com.gaode.route.pojo;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @Version: 1.0
 * @Description:
 * @Date: 2020-07-15 14:37
 * @Author: Tyler Yin
 * @Project: GaoDeMapFence
 **/
public class Point implements Serializable {
    private BigDecimal lng;
    private BigDecimal lat;

    public BigDecimal getLng() {
        return lng;
    }

    public void setLng(BigDecimal lng) {
        this.lng = lng;
    }

    public BigDecimal getLat() {
        return lat;
    }

    public void setLat(BigDecimal lat) {
        this.lat = lat;
    }
}