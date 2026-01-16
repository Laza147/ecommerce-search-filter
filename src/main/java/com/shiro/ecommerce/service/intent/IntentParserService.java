package com.shiro.ecommerce.service.intent;


public interface IntentParserService {

    SearchIntent parse(String rawQuery);
}
