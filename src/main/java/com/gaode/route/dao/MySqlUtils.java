package com.gaode.route.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.gaode.route.pojo.Shape;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

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

    /**
     * 根据id查询对应信息
     *
     * @return
     */
    public static String getPeiZhiNameSub(String byteNum, String byteSort, String byteInfo) {
        String infoName = "";
        String sql = "select infoname from peizhiinfo where bytenum=? and bytesort=? and infonum=?";

        MySqlUtils mysqlUtil = new MySqlUtils();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = mysqlUtil.getConn();
            ps = conn.prepareStatement(sql);
            ps.setString(1, byteNum);
            ps.setString(2, byteSort);
            ps.setString(3, byteInfo);
            rs = ps.executeQuery();
            if (rs.next()) {
                infoName = rs.getString("infoName");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            mysqlUtil.releaseResources(conn, ps, rs);
        }
        return infoName;
    }

    public static String getPolygon() {
        ResultSet rs = null;
        Connection conn = null;
        PreparedStatement ps = null;
        JSONArray jsonArray = new JSONArray();

        String sql = "SELECT * FROM SHAPE WHERE TYPE = '2'";
        MySqlUtils mysqlUtil = new MySqlUtils();
        try {
            conn = mysqlUtil.getConn();
            ps = conn.prepareStatement(sql);

            rs = ps.executeQuery();
            while (rs.next()) {
                JSONObject polygon = new JSONObject();
                polygon.put("lng", rs.getBigDecimal("lng"));
                polygon.put("lat", rs.getBigDecimal("lat"));
                jsonArray.add(polygon);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            mysqlUtil.releaseResources(conn, ps, rs);
        }
        return jsonArray.toString();
    }

    public static Shape getCircle() {
        ResultSet rs = null;
        Connection conn = null;
        PreparedStatement ps = null;

        Shape shape = null;
        String sql = "SELECT * FROM SHAPE WHERE TYPE = '1'";
        MySqlUtils mysqlUtil = new MySqlUtils();
        try {
            conn = mysqlUtil.getConn();
            ps = conn.prepareStatement(sql);
            rs = ps.executeQuery();
            while (rs.next()) {
                shape = new Shape();
                shape.setLng(rs.getBigDecimal("lng"));
                shape.setLat(rs.getBigDecimal("lat"));
                shape.setRadius(rs.getBigDecimal("radius"));
            }
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
            ps.setString(1, null);
            ps.setString(2, null);
            ps.setBigDecimal(3, shape.getLng());
            ps.setBigDecimal(4, shape.getLat());
            ps.setBigDecimal(5, null);
            ps.setString(6, "2");
            ps.executeUpdate();
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
            ps.setString(1, null);
            ps.setString(2, null);
            ps.setBigDecimal(3, shape.getLng());
            ps.setBigDecimal(4, shape.getLat());
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
    public static void deleteShape(String type) {
        ResultSet rs = null;
        Connection conn = null;
        PreparedStatement ps = null;
        String sql = "DELETE FROM shape WHERE TYPE = '" + type + "'";
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