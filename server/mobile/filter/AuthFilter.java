/*   
 * Copyright (c) 2018年02月27日 by XuanWu Wireless Technology Co.Ltd 
 *             All rights reserved  
 */
package com.xuanwu.ams.mobile.filter;


import com.xuanwu.ams.common.utils.PageDataEncode;
import com.xuanwu.ams.common.utils.PageDataEncode.RsaParams;
import com.xuanwu.ams.common.utils.SessionUtil;
import com.xuanwu.ams.common.utils.impl.RsaEncode;
import com.xuanwu.ams.monitor.security.util.ServerTokenManage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2018/2/27
 */
public class AuthFilter implements Filter {

    private Logger logger = LoggerFactory.getLogger(AuthFilter.class);
    private PageDataEncode rsaEncode = new RsaEncode();
    private  RsaParams rsa;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse,
            FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) servletRequest;
        HttpServletResponse httpServletResponse = (HttpServletResponse) servletResponse;
        System.out.println(httpServletRequest.getRequestURI() + ":" + httpServletRequest.getSession().getId());
        String uri = httpServletRequest.getRequestURI();
        try {
             if (!"OPTIONS".equalsIgnoreCase(httpServletRequest.getMethod())) {
                 if(uri.contains("websocket")){
                     filterChain.doFilter(httpServletRequest,httpServletResponse);
                     return;
                 }
                if (uri.contains("login")) {
                    servletRequest.setAttribute("privateKey", rsa.getKey());
                } else if(uri.contains("ping")){
                    handlePing(servletRequest);
                }else{
//                    if(uri.contains("recvUsername")){
                    if(SessionUtil.getCurUser() == null || uri.contains("recvUsername")){
                        httpServletRequest.getRequestDispatcher("/mobile/unauthorized").forward(httpServletRequest,httpServletResponse);
                        return;
                    }
                }
            }
            filterChain.doFilter(httpServletRequest, httpServletResponse);
        } catch (Exception e) {
            logger.error("get token failed", e);
            sendInternalServerError(httpServletResponse);
            return;
        }
    }

    @Override
    public void destroy() {

    }

    /**
     * 返回401 要求身份验证
     */
    private void sendUnauthorizedResponse(HttpServletResponse httpServletResponse)
            throws IOException {
        httpServletResponse.setContentType("text/html");
        httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpServletResponse.getWriter().write("required login");
    }

    /**
     * 返回500 内部错误
     */
    private void sendInternalServerError(HttpServletResponse httpServletResponse)
            throws IOException {
        if (!httpServletResponse.isCommitted()) {
            httpServletResponse.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            httpServletResponse.getWriter().write("server internal error");
        }
    }

    /**
     * 处理ping的逻辑
     * @param requestWrapper
     * @throws Exception
     */
    private void handlePing(ServletRequest requestWrapper) throws Exception {
        rsa = rsaEncode.init();
        requestWrapper.setAttribute("exponent", rsa.getExponent());
        requestWrapper.setAttribute("modulus", rsa.getModulus());
    }
}
