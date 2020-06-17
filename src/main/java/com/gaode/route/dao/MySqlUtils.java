package com.gaode.route.dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.gaode.route.pojo.OrgLocation;
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
            // 加载MySQL驱动
            Class.forName("com.mysql.jdbc.Driver");
            // 获取数据库连接
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
            // 释放资源
            mysqlUtil.releaseResources(conn, ps, rs);
        }
        return infoName;
    }

    public static String getOrgLocation() {
        JSONArray jsonArray = new JSONArray();
        List<String> list = new ArrayList<>();
        String sql = "select * from orgloaction ";

        ResultSet rs = null;
        Connection conn = null;
        PreparedStatement ps = null;
        MySqlUtils mysqlUtil = new MySqlUtils();
        try {
            conn = mysqlUtil.getConn();
            ps = conn.prepareStatement(sql);

            rs = ps.executeQuery();
            while (rs.next()) {
                String ss = "[" + rs.getBigDecimal("lng") + "," + rs.getBigDecimal("lat") + "]";
                list.add(ss);
                JSONObject jb = new JSONObject();
                jb.put("lng", rs.getBigDecimal("lng"));
                jb.put("lat", rs.getBigDecimal("lat"));
                jsonArray.add(jb);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            // 释放资源
            mysqlUtil.releaseResources(conn, ps, rs);
        }
        return jsonArray.toString();
    }

    public static void saveOrgLocation(OrgLocation ol) {
        String sql = "insert into orgloaction(orgcode, lng, lat, type) values(?, ?, ?, '1')";
        MySqlUtils mySqlUtils = new MySqlUtils();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = mySqlUtils.getConn();
            ps = conn.prepareStatement(sql);
            ps.setInt(1, ol.getOrgCode());
            ps.setBigDecimal(2, ol.getLng());
            ps.setBigDecimal(3, ol.getLat());
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 释放资源
            mySqlUtils.releaseResources(conn, ps, rs);
        }
    }

    /**
     * 删除围栏数据
     */
    public static void deleteOrgLocation() {
        String sql = "DELETE FROM orgloaction";
        MySqlUtils mySqlUtils = new MySqlUtils();
        Connection conn = null;
        PreparedStatement ps = null;
        ResultSet rs = null;
        try {
            conn = mySqlUtils.getConn();
            ps = conn.prepareStatement(sql);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 释放资源
            mySqlUtils.releaseResources(conn, ps, rs);
        }
    }
}