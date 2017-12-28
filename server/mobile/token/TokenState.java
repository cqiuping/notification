/*   
 * Copyright (c) 2017年12月20日 by XuanWu Wireless Technology Co.Ltd 
 *             All rights reserved  
 */
package com.xuanwu.ams.mobile.token;

/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2017/12/20
 */
public enum TokenState {
    /**
     * 过期
     */
    EXPIRED("EXPIRED"),
    /**
     * 无效(token不合法)
     */
    INVALID("INVALID"),
    /**
     * 有效的
     */
    VALID("VALID");

    private String state;

    private TokenState(String state) {
        this.state = state;
    }

    /**
     * 根据状态字符串获取token状态枚举对象
     */
    public static TokenState getTokenState(String tokenState) {
        TokenState[] states = TokenState.values();
        TokenState ts = null;
        for (TokenState state : states) {
            if (state.toString().equals(tokenState)) {
                ts = state;
                break;
            }
        }
        return ts;
    }

    public String toString() {
        return this.state;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

}

