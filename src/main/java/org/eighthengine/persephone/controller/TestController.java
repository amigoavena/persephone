package org.eighthengine.persephone.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TestController {

	 @RequestMapping("/home")
	 public String home() {
	  return "index";
	 }
}
