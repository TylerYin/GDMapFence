package com.gaode.route.pojo;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * @Description POJO
 * @Author Tyler Yin
 */
public class Shape implements Serializable {

    private static final long serialVersionUID = 1L;

    private int id;
    private String dealerId;
    private String companyId;
    private BigDecimal lng;
    private BigDecimal lat;
    private BigDecimal radius;
    private int type;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDealerId() {
        return dealerId;
    }

    public void setDealerId(String dealerId) {
        this.dealerId = dealerId;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

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

    public BigDecimal getRadius() {
        return radius;
    }

    public void setRadius(BigDecimal radius) {
        this.radius = radius;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
