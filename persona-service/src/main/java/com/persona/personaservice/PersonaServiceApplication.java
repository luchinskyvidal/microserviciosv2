package com.persona.personaservice;



import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.hystrix.dashboard.EnableHystrixDashboard;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;

import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;



@SpringBootApplication
@RestController
@EnableDiscoveryClient
@Service
@EnableHystrixDashboard
@EnableCircuitBreaker
@EnableSwagger2
public class PersonaServiceApplication {

    @Bean
    public Docket swagger() {
        return new Docket(DocumentationType.SWAGGER_2)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.persona.personaservice"))
                .paths(PathSelectors.any())
                .build();
    }
 
	@HystrixCommand(fallbackMethod = "personaDefault")
    @RequestMapping(value = "/getStudentDetails/{nombre}", method = RequestMethod.GET)
    public Persona getPersonaDetalles(@PathVariable(name = "nombre") String nombre)
    {
        return new Persona(nombre, "Pune", "MCA");
    }
	public static void main(String[] args) {
		SpringApplication.run(PersonaServiceApplication.class, args);
	}
	
	public Persona personaDefault(String name) {

	    return new Persona("Hello World thanks to Circuit Breaker (Hystrix)", name, name);

	 }

}

class Persona
{
    String nombre;
    String direccion;
    String cls;
 
    public Persona(String nombre, String direccion, String cls) {
        super();
        this.nombre = nombre;
        this.direccion = direccion;
        this.cls = cls;
    }
 
    public String getName() {
        return nombre;
    }
 
    public String getAddress() {
        return direccion;
    }
 
    public String getCls() {
        return cls;
    }
}