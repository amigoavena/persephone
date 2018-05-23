package org.eighthengine.persephone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication//(exclude = { SecurityAutoConfiguration.class })
public class PersephoneApplication {

	public static void main(String[] args) {
		SpringApplication.run(PersephoneApplication.class, args);
	}
	
}
