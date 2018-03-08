/*   
 * Copyright (c) 2018年02月28日 by XuanWu Wireless Technology Co.Ltd 
 *             All rights reserved  
 */
package com.xuanwu.ams.mobile.controller;

import com.esms.monitor.util.StringUtils;
import com.xuanwu.ams.common.entity.EventState;
import com.xuanwu.ams.common.entity.FaultOrder;
import com.xuanwu.ams.common.entity.Node;
import com.xuanwu.ams.common.entity.SysEvent;
import com.xuanwu.ams.common.entity.SysUser;
import com.xuanwu.ams.common.entity.Threshold;
import com.xuanwu.ams.common.http.response.RestResult;
import com.xuanwu.ams.common.utils.DateUtil;
import com.xuanwu.ams.common.utils.JsonUtil;
import com.xuanwu.ams.mobile.util.HttpResp;
import com.xuanwu.ams.services.base.BizDataService;
import com.xuanwu.ams.services.base.FaultOrderService;
import com.xuanwu.ams.services.base.NodeService;
import com.xuanwu.ams.services.base.SysLogService;
import com.xuanwu.ams.services.base.SysUserService;
import com.xuanwu.ams.services.base.ThresholdService;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2018/2/28
 */
@Controller
@RequestMapping("/mobile")
public class MobileHomeService {

    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private SysLogService sysLogService;
    @Autowired
    private FaultOrderService faultOrderService;
    @Autowired
    private BizDataService bizDataService;
    @Autowired
    private NodeService nodeService;
    @Autowired
    private ThresholdService thresholdService;


    private static Logger logger = LoggerFactory.getLogger(MobileHomeService.class);
    private static final String START_TIME = "startTime";
    private static final String END_TIME = "endTime";
    private static final String YYYY_MM_DD = "yyyy-MM-dd";
    private static final int HOME_ALARM_NUMBER = 5;//首页前5条告警记录
    private static final int SC_UNAUTHORIZED = 401;
    private static final int SC_INTERNAL_SERVER_ERROR = 500;
    private static final int SC_OK = 200;
    private static final int ONE_MONTH = -30;
    private static final int TWELVE_WEEK = -90;
    private static final int HALF_YEAR = -180;

    /**
     * 获取前五条工单记录
     */
    @ResponseBody
    @RequestMapping(value = "alarm", method = RequestMethod.GET)
    public ResponseEntity getAlarm() {
        SysEvent sysEvent = new SysEvent();
        sysEvent.setState(EventState.UN_RECVED.getValue());
        int unhandle = sysLogService.findSysEventRowCount(sysEvent, null);
        List<SysEvent> topAlarms = sysLogService.findTopEventList(sysEvent, HOME_ALARM_NUMBER);
        Map<String, Object> params = new HashMap<>();
        params.put("topAlarms", topAlarms);
        params.put("unhandle", unhandle);
        return HttpResp.success(params);
    }

    /**
     * 获取主机监控环形图信息
     */
    @ResponseBody
    @RequestMapping(value = "statisticsHostPie", method = RequestMethod.GET)
    public ResponseEntity statisticsHostPie() {
        try {
            List<Map<String, Integer>> hostData = nodeService
                    .statisticsNodeStateCount(Node.NodeType.HOST.getIndex());
            Map<String, Object> hostMap = new HashMap<String, Object>();
            for (Map<String, Integer> map : hostData) {
                hostMap.put(Node.NodeState.getState(map.get("state")).getStateName(),
                        map.get("count"));
            }
            return HttpResp.success(hostMap);
        } catch (Exception e) {
            logger.error("get Host pie data error:{}", e.getMessage());
            return HttpResp.failure(e.getMessage(), SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 获取应用监控环形图信息
     */
    @ResponseBody
    @RequestMapping(value = "statisticsAppPie", method = RequestMethod.GET)
    public ResponseEntity statisticsAppPie() {
        try {
            List<Map<String, Integer>> appData = nodeService.statisticsAppStateCount();
            Map<String, Object> appMap = new HashMap<String, Object>();
            for (Map<String, Integer> map : appData) {
                appMap.put(Node.NodeState.getState(map.get("state")).getStateName(),
                        map.get("count"));
            }
            return HttpResp.success(appMap);
        } catch (Exception e) {
            logger.error("get app pie data error:{}", e.getMessage());
            return HttpResp.failure(e.getMessage(), SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 获取节点监控环形图信息
     */
    @ResponseBody
    @RequestMapping(value = "statisticsNodePie")
    public ResponseEntity statisticsNodePie() {
        try {
            List<Map<String, Integer>> nodeData = nodeService.statisticsNodeStateCount(null);
            Map<String, Object> nodeMap = new HashMap<String, Object>();
            for (Map<String, Integer> map : nodeData) {
                nodeMap.put(Node.NodeState.getState(map.get("state")).getStateName(),
                        map.get("count"));
            }
            return HttpResp.success(nodeMap);
        } catch (Exception e) {
            logger.error("get node pie data error:{}", e.getMessage());
            return HttpResp.failure(e.getMessage(), SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 获取告警趋势信息
     */
    @ResponseBody
    @RequestMapping(value = "statisticsAlarmLineTrend")
    public ResponseEntity statisticsNodeAlarmTrend(@RequestParam("timeRegion") String timeRegion) {
        try {

            SysEvent sysEvent = new SysEvent();
            if (timeRegion == null) {
                timeRegion = "D";
            }
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            //时间区间
            if ("D".equals(timeRegion)) {
                calendar.add(Calendar.DAY_OF_MONTH, ONE_MONTH);
            } else if ("W".equals(timeRegion)) {
                calendar.add(Calendar.DAY_OF_MONTH, TWELVE_WEEK);
            } else {
                calendar.add(Calendar.DAY_OF_MONTH, HALF_YEAR);
            }
            Date startTime = calendar.getTime();
            Date endTime = DateUtil.getCurDayEndDate();
            sysEvent.setStartTime(startTime);
            sysEvent.setEndTime(endTime);
            List<Map<String, Object>> alarmDatas = sysLogService
                    .statisticsNodeEventCount(sysEvent, timeRegion);
            List<String> time = new ArrayList<String>();
            List<Object> count = new ArrayList<Object>();
            for (Map<String, Object> map : alarmDatas) {
                time.add(map.get("time").toString());
                count.add(map.get("count"));
            }
            Map<String, List<?>> result = new HashMap<String, List<?>>();
            result.put("time", time);
            result.put("count", count);
            return HttpResp.success(result);
        } catch (Exception e) {
            logger.error("statistics Node Alter Trend error", e);
            return HttpResp.failure(e.getMessage(), SC_INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * 获取认领用户信息
     */
    @ResponseBody
    @RequestMapping(value = "recvUsername",method = RequestMethod.POST)
    public ResponseEntity getRecvUsername(@RequestBody Object param) {
        try {
            Map<String, String> paramMap = JsonUtil.toMap(JsonUtil.toJson(param));
            FaultOrder fo = handlePageReqt(paramMap);
            List<String> recvUsername = faultOrderService.getRecvUsername(fo);
            System.err.println(recvUsername);
            return HttpResp.success(recvUsername);
        } catch (Exception e) {
            logger.error("mobile get recvUsernaem error:{}", e.getMessage());
            return HttpResp.failure(e.getMessage(),SC_INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * 认领工单
     */
    @ResponseBody
    @RequestMapping(value = "recv", method = RequestMethod.POST)
    public ResponseEntity recv(@RequestBody Map<String, Object> map, HttpServletRequest request) {
        try {
            int[] ids = JsonUtil
                    .fromJson(JsonUtil.toJson(map.get("ids")), int[].class);
            Integer userId = (Integer) map.get("userId");
            if (userId != null) {
                faultOrderService.doRecv(ids, userId);
                return HttpResp.success();
            } else {
                return HttpResp.failure("userId为空",SC_UNAUTHORIZED);
            }

        } catch (Exception e) {
            logger.error("mobile receive faultOrder error:{}", e.getMessage());
            return HttpResp.failure(e.getMessage(),SC_INTERNAL_SERVER_ERROR);
        }
    }

    @ResponseBody
    @RequestMapping(value = "fault",method = RequestMethod.GET)
    public ResponseEntity getFault(@QueryParam("id")int id){
        try {
            FaultOrder fo = faultOrderService.get(id);
            if (fo.getEventType() == SysEvent.EventType.THOLD_ALARM.getIndex()) {
                Threshold thod = thresholdService.findById(fo.getSourceId());
                fo.setHandleDescribe(thod.getHandleDescribe());
            }
            SysUser user = sysUserService.get(fo.getRecvUser());
            fo.setRecvUserName(user == null ? "" : user.getUsername());
            return HttpResp.success(fo);
        } catch (Exception e) {
            logger.error("get fault order failed: ", e);
            return HttpResp.failure(e.getMessage(),SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 获取符合条件的所有工单信息
     */
    @ResponseBody
    @RequestMapping(value = "faultorder",method = RequestMethod.POST)
    public ResponseEntity getFaultOrder(@RequestBody Object param) {
        try {
            Map<String, String> paramMap =JsonUtil
                    .toMap(JsonUtil.toJson(param));
            FaultOrder fo = handlePageReqt(paramMap);
            List<FaultOrder> reList = faultOrderService.findList(fo, null);
            setHostName(reList);
            return HttpResp.success(reList);
        } catch (Exception e) {
            logger.error("mobile get faultOrder error:{}", e.getMessage());
            return HttpResp.failure(e.getMessage(),SC_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * get请求验证校验失败的时候跳转过来
     */
    @ResponseBody
    @RequestMapping(value = "unauthorized",method = RequestMethod.GET)
    public ResponseEntity getUnAuthorized() {
        return HttpResp.failure( "need login",SC_UNAUTHORIZED);
    }

    /**
     * post请求验证校验失败的时候跳转过来
     */
    @ResponseBody
    @RequestMapping(value = "unauthorized",method = RequestMethod.POST)
    public ResponseEntity postUnAuthorized() {
        return HttpResp.failure( "need login", SC_UNAUTHORIZED);
    }


    /**
     * 处理工单请求的参数
     */
    private FaultOrder handlePageReqt(Map<String, String> paramMap) {
        FaultOrder fo = new FaultOrder();
        String name = paramMap.get("faultName");
        String typeName = paramMap.get("faultType");
        String recvUsername = paramMap.get("recvUsername");
        String faultState = paramMap.get("faultState");
        String alertLevel = paramMap.get("alertLevel");
        if (StringUtils.isNotBlank(recvUsername)) {
            if (sysUserService.getByUsername(recvUsername) != null) {
                fo.setRecvUser(sysUserService.getByUsername(recvUsername).getId());
            }
        }
        if (StringUtils.isNotBlank(name)) {
            fo.setName(name);
        }
        if (StringUtils.isNotBlank(typeName)) {
            fo.setTypeName(typeName);
        }
        if (faultState != null) {
            fo.setState(Integer.parseInt(faultState));
        }
        if (alertLevel != null) {
            fo.setEventLevel(Integer.parseInt(alertLevel));
        }
        if (StringUtils.isNotBlank(paramMap.get(START_TIME))) {
            fo.setStartTime(DateUtil
                    .getDayBeginDate(DateUtil.parse(paramMap.get(START_TIME), YYYY_MM_DD)));
        }
        if (StringUtils.isNotBlank(paramMap.get(END_TIME))) {
            fo.setEndTime(
                    DateUtil.getDayEndDate(DateUtil.parse(paramMap.get(END_TIME), YYYY_MM_DD)));
        }
        return fo;
    }

    /**
     * 给FaultOrder设置hostName属性
     */
    private void setHostName(List<FaultOrder> reList) {
        Map<Integer, String> nodeNameMap = bizDataService.getNodeNameMap();
        for (FaultOrder faultOrder : reList) {
            faultOrder.setHostName(nodeNameMap.get(faultOrder.getHostId()));
            if (StringUtils.isBlank(faultOrder.getHostName()) && faultOrder.getHostId() == 0) {
                faultOrder.setHostName(nodeNameMap.get(faultOrder.getNodeId()));
            }
        }
    }


}
