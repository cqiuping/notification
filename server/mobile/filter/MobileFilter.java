/*   
 * Copyright (c) 2017年12月21日 by XuanWu Wireless Technology Co.Ltd 
 *             All rights reserved  
 */
package com.xuanwu.ams.mobile.filter;


import com.xuanwu.ams.mobile.token.MobileToken;
import com.xuanwu.ams.mobile.token.TokenState;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Date;
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
import net.minidev.json.JSONObject;
import retrofit2.Response;

/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2017/12/21
 */
public class MobileFilter implements Filter {

    private static final int TOKEN_BEGIN_INDEX = 7;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        System.out.println("token过滤器初始化了");
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res,
            FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;
        if (request.getRequestURI().endsWith("/login") || request.getRequestURI()
                .endsWith("/rsa") || request.getRequestURI().endsWith("/blank")) {
            //登陆接口不校验token，直接放行
            chain.doFilter(request, response);
            return;
        }
        if (!"OPTIONS".equalsIgnoreCase(request.getMethod())) {
            String token = request.getHeader("Authorization");
            token = token.substring(TOKEN_BEGIN_INDEX);
            //其他API接口一律校验token
            System.out.println("开始校验token");
            //从请求头中获取token
            Map<String, Object> resultMap = MobileToken.validToken(token);
            TokenState state = TokenState.getTokenState((String) resultMap.get("state"));
            switch (state) {
                case VALID:
                    //取出payload中数据,放入到request作用域中
                    request.setAttribute("data", resultMap.get("data"));
                    //放行
                    chain.doFilter(request, response);
                    break;
                case EXPIRED:
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                    response.getWriter().print("token is expried");
//                    chain.doFilter(request,response);
                    response.setHeader("status","401");
                    break;
                case INVALID:
                    System.out.println("无效token");
                    //token过期或者无效，则输出错误信息返回给ajax
//                    JSONObject outputMSg = new JSONObject();
//                    outputMSg.put("success", false);
//                    outputMSg.put("msg", "您的token不合法或者过期了，请重新登陆");
//                    output(outputMSg.toJSONString(), response);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setHeader("status","401");
//                    chain.doFilter(request,response);
                    break;
            }
        }else{
            chain.doFilter(request,response);
        }
    }

    @Override
    public void destroy() {

    }

    public void output(String jsonStr, HttpServletResponse response) throws IOException {
        response.setContentType("text/html;charset=UTF-8;");
        PrintWriter out = response.getWriter();
//		out.println();
        out.write(jsonStr);
        out.flush();
        out.close();

    }
}
