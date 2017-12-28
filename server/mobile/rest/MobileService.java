/*   
 * Copyright (c) 2017年12月20日 by XuanWu Wireless Technology Co.Ltd 
 *             All rights reserved  
 */
package com.xuanwu.ams.mobile.rest;

import com.xuanwu.ams.common.entity.EventState;
import com.xuanwu.ams.common.entity.SysEvent;
import com.xuanwu.ams.common.entity.SysUser;
import com.xuanwu.ams.common.http.response.RestResult;
import com.xuanwu.ams.common.utils.PageDataEncode;
import com.xuanwu.ams.common.utils.impl.RsaEncode;
import com.xuanwu.ams.mobile.token.MobileToken;
import com.xuanwu.ams.sdk.util.PropertyUtil;
import com.xuanwu.ams.services.base.FaultOrderService;
import com.xuanwu.ams.services.base.SysLogService;
import com.xuanwu.ams.services.base.SysUserService;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.PrivateKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2017/12/20
 */
@Path("/")
public class MobileService {

    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private SysLogService sysLogService;
    @Autowired
    private FaultOrderService faultOrderService;

    private PageDataEncode rsaEncode = new RsaEncode();
    private static final String PRIVATE_KEY = "_rsakey";
    private static final String EXPONENT = "exponent";
    private static final String MODULUS = "modulus";
    public static final int HOME_ALARM_NUMBER = 5;//首页前5条告警记录

    @POST
    @Path("login")
    @Produces("application/json")
    public Response login(Map<String, String> info, @Context ServletContext context) {
        try {
            String username = info.get("username");
            String password = info.get("password");
            PrivateKey keyPair = (PrivateKey) context.getAttribute(PRIVATE_KEY);
            if (keyPair != null) {
                password = rsaEncode.getDecode(keyPair, password);
                username = rsaEncode.getDecode(keyPair, username);
                password = reverseStr(URLDecoder.decode(password, "UTF-8"));
                username = reverseStr(URLDecoder.decode(username, "UTF-8"));
                password = generatePasswordDigest(password, username);
            } else {
                return RestResult.failure(500, "无法获取密钥对，请稍后重试",200);
            }
            SysUser user = sysUserService.getLoginAccount(username);
            if (user == null) {
                return RestResult.failure(200, "用户名或者密码错误",200);
            }
            if (Objects.equals(password, user.getPassword())) {
                System.out.println("登陆用户id:" +  user.getId());
                String token = generateToken(user.getId());
                Map<String, Object> params = new HashMap<>();
                params.put("token",token);
                params.put("userId",user.getId());
                return RestResult.success(params);
            } else {
                return RestResult.failure(200, "账号或者密码错误",200);
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
            return RestResult.failure(500, e.getMessage(),200);
        }
    }

    @POST
    @Path("recv")
    public Response recv(int[] ids,@Context HttpServletRequest request){
        String token = request.getHeader("Authorization");
        if(token != null){
            int userId = MobileToken.getUserIdFromToken(token);
            faultOrderService.doRecv(ids,userId);
            return RestResult.success();
        }else{
            return RestResult.failure(401,"token为空",401);
        }
    }

    @GET
    @Path("rsa")
    public Response rsa(@Context ServletContext context) {
        Map<String, Object> keyMap = initKey();
        context.setAttribute(PRIVATE_KEY, keyMap.get(PRIVATE_KEY));
        Map<String, Object> params = new HashMap<>();
        params.put(EXPONENT, keyMap.get(EXPONENT));
        params.put(MODULUS, keyMap.get(MODULUS));

        return RestResult.success(params);
    }

    @GET
    @Path("alarm")
    public Response getAlarm() {
        SysEvent sysEvent = new SysEvent();
        sysEvent.setState(EventState.UN_RECVED.getValue());
        List<SysEvent> topAlarms = sysLogService.findTopEventList(sysEvent, null);
        int unhandle = sysLogService.findSysEventRowCount(sysEvent, null);
        Map<String, Object> params = new HashMap<>();
        params.put("topAlarms", topAlarms);
        params.put("unhandle", unhandle);
        return RestResult.success(params);
    }

    /**
     * 生成密钥对
     */
    private Map<String, Object> initKey() {
        PageDataEncode.RsaParams rsa = rsaEncode.init();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put(EXPONENT, rsa.getExponent());
        map.put(MODULUS, rsa.getModulus());
        map.put(PRIVATE_KEY, rsa.getKey());
        return map;
    }

    /**
     * 反转字符串
     */
    private String reverseStr(String str) {
        StringBuilder sb = new StringBuilder(str);
        return sb.reverse().toString();
    }

    private String generateToken(int  userId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("date", new Date());
        payload.put("ext", System.currentTimeMillis() + 604_800_000_000_0L);
        payload.put("userId", userId);
        return MobileToken.createToken(payload);
    }


    private String generatePasswordDigest(String plainPassword, String salt) {
        String source = salt == null ? plainPassword : (plainPassword + salt);
        return DigestUtils.sha256Hex(source);
    }

}
