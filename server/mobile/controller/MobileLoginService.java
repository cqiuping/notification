/*   
 * Copyright (c) 2018年02月27日 by XuanWu Wireless Technology Co.Ltd
 *             All rights reserved
 */
package com.xuanwu.ams.mobile.controller;

import static com.xuanwu.ams.web.security.WebSecurityUtil.generatePasswordDigest;

import com.xuanwu.ams.common.entity.SysUser;
import com.xuanwu.ams.common.utils.PageDataEncode;
import com.xuanwu.ams.common.utils.SessionUtil;
import com.xuanwu.ams.common.utils.impl.RsaEncode;
import com.xuanwu.ams.mobile.util.HttpResp;
import com.xuanwu.ams.sdk.util.StringUtil;
import com.xuanwu.ams.services.base.NodeGroupService;
import com.xuanwu.ams.services.base.SysUserService;
import com.xuanwu.ams.services.base.UserLogService;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.security.PrivateKey;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2018/2/27
 */
@Controller
@RequestMapping("/mobile")
public class MobileLoginService {

    private Logger logger = LoggerFactory.getLogger(MobileLoginService.class);
    private PageDataEncode rsaEncode = new RsaEncode();
    private static final String EXPONENT = "exponent";
    private static final String MODULUS = "modulus";
    private static final int SC_OK = 200;
    private static final int SC_INTERNAL_SERVER_ERROR = 500;
    private static final int ALL_GROUP_ID = 0;
    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private NodeGroupService nodeGroupService;
    @Autowired
    private SysUserService userService;

    @ResponseBody
    @RequestMapping(value = "login", method = RequestMethod.POST)
    public ResponseEntity login(@RequestBody Map<String,String> info, HttpServletRequest request) {
        try {
            String username = info.get("username");
            String password = info.get("password");
            PrivateKey keyPair = (PrivateKey) request.getAttribute("privateKey");
            if (keyPair != null) {
                password = rsaEncode.getDecode(keyPair, password);
                username = rsaEncode.getDecode(keyPair, username);
                password = StringUtil.reverseStr(URLDecoder.decode(password, "UTF-8"));
                username = StringUtil.reverseStr(URLDecoder.decode(username, "UTF-8"));
                password = generatePasswordDigest(password, username);
            } else {
                return HttpResp.failure("无法获取密钥对，请稍后重试");
            }
            SysUser user = sysUserService.getLoginAccount(username);
            if (user == null) {
                return HttpResp.failure("用户名或者密码错误");
            }
            if (Objects.equals(password, user.getPassword())) {
                List<Integer> groupIds = nodeGroupService.getGroupIdByUsername(username);
                List<Integer> entIds = nodeGroupService.getEntIdByUsername(username);
                SessionUtil.setCurUser(userService.getByUsername(username));
                Map<Integer, List<Integer>> groupEntMap = nodeGroupService.getAllGroupIdByUsername(username);
                if (groupIds.contains(ALL_GROUP_ID)) {
                    SessionUtil.setSessionAttribute("allGroup", true);
                }
                SessionUtil.setSessionAttribute("groupIds", groupIds);
                SessionUtil.setSessionAttribute("entIds", entIds);
                SessionUtil.setSessionAttribute("groupEntMap", groupEntMap);
//                String token = (String) request.getAttribute("token");
                Map<String, Object> params = new HashMap<>();
//                params.put("token", token);
                params.put("userId", user.getId());
                return HttpResp.success(params);
            } else {
                return HttpResp.failure( "账号或者密码错误");
            }
        } catch (UnsupportedEncodingException e) {
            logger.error("mobile login error:{}", e.getMessage());
            return HttpResp.failure(e.getMessage());
        }
    }

    @ResponseBody
    @RequestMapping(value = "ping", method = RequestMethod.GET)
    public ResponseEntity ping(HttpServletRequest request) {
        /**这里需要修改ping 用于把公钥信息返回**/
        String exponent = request.getAttribute(EXPONENT).toString();
        String modulus = request.getAttribute(MODULUS).toString();
        Map<String, String> params = new HashMap<String, String>();
        params.put(EXPONENT, exponent);
        params.put(MODULUS, modulus);
        return HttpResp.success(params);
    }
}
