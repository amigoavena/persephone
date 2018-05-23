package org.eighthengine.persephone.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TestController {

    @RequestMapping("/api/test")
    public @ResponseBody Map<String,Object> index() {
    		Map<String,Object> result = new HashMap<String,Object>();
    		result.put("message", "spring boot example");
        return result;
    }
}
