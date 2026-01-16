package com.shiro.ecommerce.exception;

public class InvalidPaginationException extends ApiException {

    public InvalidPaginationException(int page, int limit) {
        super("Invalid pagination values. page=" + page + ", limit=" + limit);
    }
}
