package org.vaadin.wizard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

import com.vaadin.connect.oauth.EnableVaadinConnectOAuthServer;
import com.vaadin.frontend.server.EnableVaadinFrontendServer;

/**
 * Spring boot starter class.
 */
@SpringBootApplication
@EnableVaadinConnectOAuthServer
@EnableVaadinFrontendServer
public class Application extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Application.class);
    }

    /**
     * Main method to run the application.
     *
     * @param args arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
