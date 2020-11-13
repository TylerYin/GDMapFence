package com.gaode.route.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.gaode.route.pojo.Point;
import com.gaode.route.pojo.Shape;
import com.gaode.route.pojo.ShapeTypeEnum;

/**
 * @Description MySQL数据库操作类
 * @Author Tyler Yin
 */
public class MySqlUtils {
    /**
     * 获取Mysql数据库连接
     *
     * @return Connection
     */
    private Connection getConn() {
        String url = JdbcConfig.url;
        String username = JdbcConfig.username;
        String password = JdbcConfig.password;
        Connection conn = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(url, username, password);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return conn;
    }

    /**
     * 释放JDBC资源
     *
     * @param conn 数据库连接
     * @param ps
     * @param rs   记录集
     */
    private void releaseResources(Connection conn, PreparedStatement ps, ResultSet rs) {
        try {
            if (null != rs) {
                rs.close();
            }
            if (null != ps) {
                ps.close();
            }
            if (null != conn) {
                conn.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Shape getShape(String dealerId) {
        ResultSet rs = null;
        Connection conn = null;
        PreparedStatement ps = null;
        Shape shape = new Shape();
        List<Point> points = new ArrayList<>();

        String sql = "SELECT * FROM shape WHERE del_flag = '0' AND dealer_id = '" + dealerId + "'";
        MySqlUtils mysqlUtil = new MySqlUtils();
        try {
            conn = mysqlUtil.getConn();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            while (rs.next()) {
                int type = rs.getInt("type");
                if (shape.getType() == 0) {
                    shape.setType(type);
                }

                if (ShapeTypeEnum.CIRCLE.getType() == type) {
                    shape.setRadius(rs.getBigDecimal("radius"));
                }

                Point point = new Point();
                point.setLng(rs.getBigDecimal("lng"));
                point.setLat(rs.getBigDecimal("lat"));
                points.add(point);
            }
            shape.setPoints(points);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            mysqlUtil.releaseResources(conn, ps, rs);
        }
        return shape;
    }

    public static void savePolygon(Shape shape) {
        String sql = "INSERT INTO shape(company_id, dealer_id, lng, lat, radius, type) VALUES(?, ?, ?, ?, ?, ?)";
        MySqlUtils mySqlUtils = new MySqlUtils();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = mySqlUtils.getConn();
            ps = conn.prepareStatement(sql);
            for (Point point : shape.getPoints()) {
                ps.setString(1, "3d2772c219694f25ac1ed9240faa7b1c");
                ps.setString(2, shape.getDealerId());
                ps.setBigDecimal(3, point.getLng());
                ps.setBigDecimal(4, point.getLat());
                ps.setBigDecimal(5, null);
                ps.setString(6, "2");
                ps.executeUpdate();
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            mySqlUtils.releaseResources(conn, ps, rs);
        }
    }

    public static void saveCircle(Shape shape) {
        ResultSet rs = null;
        Connection conn = null;
        PreparedStatement ps = null;
        String sql = "INSERT INTO shape(company_id, dealer_id, lng, lat, radius, type) VALUES(?, ?, ?, ?, ?, ?)";
        MySqlUtils mySqlUtils = new MySqlUtils();
        try {
            conn = mySqlUtils.getConn();
            ps = conn.prepareStatement(sql);
            ps.setString(1, "3d2772c219694f25ac1ed9240faa7b1c");
            ps.setString(2, shape.getDealerId());

            for (Point point : shape.getPoints()) {
                ps.setBigDecimal(3, point.getLng());
                ps.setBigDecimal(4, point.getLat());
            }

            ps.setBigDecimal(5, shape.getRadius());
            ps.setString(6, "1");
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            mySqlUtils.releaseResources(conn, ps, rs);
        }
    }

    /**
     * 删除围栏数据
     */
    public static void deleteShape(String type, String dealerId) {
        ResultSet rs = null;
        Connection conn = null;
        PreparedStatement ps = null;

        String sql;
        if (null != type) {
            sql = "DELETE FROM shape WHERE type = '" + type + "' AND dealer_id = '" + dealerId + "'";
        } else {
            sql = "DELETE FROM shape WHERE dealer_id = '" + dealerId + "'";
        }

        MySqlUtils mySqlUtils = new MySqlUtils();
        try {
            conn = mySqlUtils.getConn();
            ps = conn.prepareStatement(sql);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            mySqlUtils.releaseResources(conn, ps, rs);
        }
    }
}