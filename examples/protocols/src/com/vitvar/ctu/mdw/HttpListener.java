package com.vitvar.ctu.mdw;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.*;

import org.eclipse.jetty.server.*;
import org.eclipse.jetty.server.bio.SocketConnector;
import org.eclipse.jetty.server.handler.AbstractHandler;

public class HttpListener extends AbstractHandler {

	/** starts the jetty http listener on port 8080 **/
	public static void main(String[] args) throws Exception {
    	Server server = new Server();
    	SocketConnector connector = new SocketConnector();
    	connector.setPort(8080);   	
        server.addConnector(connector);
        server.setHandler(new HttpListener());
        server.start(); server.join();
	}
	 
	/** handles the request when client connects **/
	public void handle(String target, Request baseRequest, HttpServletRequest request, 
			HttpServletResponse response) throws IOException, ServletException {
		
		// test if the host is company.cz
		if (request.getHeader("Host").equals("company.cz")) {
			response.setStatus(200);
			response.setHeader("Content-Type", "text/plain");
			response.getWriter().write("This is the response");
			response.flushBuffer();
		} else
			response.sendError(400); // bad request
	}
}
