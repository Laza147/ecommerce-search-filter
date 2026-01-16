package com.shiro.ecommerce.exception;

public class SearchExecutionException extends ApiException {

    public SearchExecutionException(Throwable cause) {
        super("Search execution failed", cause);
    }
}
