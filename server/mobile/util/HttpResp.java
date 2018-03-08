/*   
 * Copyright (c) 2018年02月27日 by XuanWu Wireless Technology Co.Ltd 
 *             All rights reserved  
 */
package com.xuanwu.ams.mobile.util;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * @author <a href="mailto:chengqiuping@wxchina.com ">qiuping.Cheng</a>
 * @version 1.0.0
 * @Description
 * @date 2018/2/27
 */
public class HttpResp{

    public static final int SUCCESS_STATUS = 0;

    public static final int DEFAULT_FAIL_STATUS = -1;

    private String errorMsg;
    private Object data;
    /** 0表示成功 -1表示失败 */
    private int status;

    public HttpResp(String errorMsg, int status){
        this.errorMsg = errorMsg;
        this.status = status;
    }

    public HttpResp(Object data, int status){
        this.data = data;
        this.status = status;
    }

    public static ResponseEntity success(Object data){
        HttpResp resParam = new HttpResp(data,SUCCESS_STATUS );
        return new ResponseEntity(resParam, HttpStatus.OK);
    }

    public static ResponseEntity success(){
        return success("");
    }

    public static ResponseEntity failure(String errorMessage,int errCode){
        HttpResp resParam = new HttpResp(errorMessage,DEFAULT_FAIL_STATUS );
        return new ResponseEntity(resParam,HttpStatus.valueOf(errCode));
    }

    public static ResponseEntity failure(String errorMessage){
        return failure(errorMessage,200);
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }
}
