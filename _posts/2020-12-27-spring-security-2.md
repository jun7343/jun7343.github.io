---
layout: post
title: "Spring Security 초기 설정 방법"
comments: true
tags: 
  - Spring Security
---

### Spring Security 초기 설정

Spring Security를 사용하기 위해서는 WebSecurityConfigurerAdapter 를 상속 받아 Overriding 하여 구현해야한다.    

~~~ java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
~~~

WebSecurityConfigurerAdapter 를 상속 받고 @Configuration과 @EnableWebSecurity 어노테이션을 추가하자.    

~~~ java
// 기본 Security 설정
@Override
protected void configure(HttpSecurity http) throws Exception {
    
}
~~~

해당 메서드를 오버라이딩 하여 Security 보안 설정을 적용할 수 있다. 해당 메서드를 통해 적용할 수 있는것들은 다음과 같다.

- 인증 API
  - http.formLogin()
  - http.logout()
  - http.csrf()
  - http.httpBasic()
  - http.SessionManagement()
  - http.RememberMe()
  - http.ExceptionHandling()
  - http.addFilter()
- 인가 API
  - http.authorizeRequests()
  - .antMatchers(/admin)
  - .hasRole(USER)
  - .permitAll()
  - .authenticated()
  - .fullyAuthentication()
  - .acess(hasRole(USER))
  - .denyAll()

~~~ java
@Override
protected void configure(HttpSecurity http) throws Exception { 
	http
		.authorizeRequests()			
		.anyRequest().authenticated()		
	.and()
		.formLogin(); 			
}
~~~

위와 같이 설정하게 된다면, 모든 요청은 인증 요청이 필요하며, formLogin 방식을 사용하게 된다. 어느 URL 요청은 인가처리가 필요하고 어떤 URL은 인가 처리가 필요없는지를 해당 메서드 안에서 구현하면 된다. 글을 읽으면서 무언가 사용하는데 있어 불편함을 느낄 수 있을것이다. 일일이 인가 처리 필요한 URL을 관리하는데 있어 하드코딩? 식으로 관리해야하냐는 점인데 물론 아니다. 위 메서드에서도 처리할 수 있고 @Secured 어노테이션을 Controller 단 또는 Controller 안 메서드에 사용함으로서 인가 요청 유무를 관리 할 수 있다. 해당 메서드에 대한 자세한 내용은 학습 후 업로드 하도록 하겠다.    
이렇게 기본적인 세팅까지 알아보았다. 현재 부분까지만 구현해도 정상적으로 Security 보안 설정된 것을 확인 할 수 있다.    

### 클라이언트와 서버간의 인가 요청
HTTP는 자체적인 인증 관련 기능을 제공한다. 먼저 클라이언트가 보호자원 접근 하려할때 서버가 클라이언트에게 401 UnAuthorized 응답과 함께 WWW-Authenticate header를 기술해서 인증요구를 보낸다. 이후 클라이언트는 ID, Password를 기입하여 해당 값을 Base64로 Encoding하여 Authorization Header에 추가한 뒤 Server에게 전송하여 리소스를 요청하는 식으로 진행된다. 여기서 ID와 Password는 Base64로 Encoding되어 있어 외부에 손쉽게 노출되는 상황이라 SSL, TLS는 필수적이다.    


### formLogin 구현

~~~ java
protected void configure(HttpSecurity http) throws Exception {
	 http.formLogin()
                .loginPage(“/login.html")   				      // 사용자 정의 로그인 페이지
                .defaultSuccessUrl("/home)				        // 로그인 성공 후 이동 페이지
	         .failureUrl(＂/login.html?error=true“)		      // 로그인 실패 후 이동 페이지
                .usernameParameter("username")			      // 아이디 파라미터명 설정
                .passwordParameter(“password”)			      // 패스워드 파라미터명 설정
                .loginProcessingUrl(“/login")			        // 로그인 Form Action Url
                .successHandler(loginSuccessHandler())		// 로그인 성공 후 핸들러
                .failureHandler(loginFailureHandler())		// 로그인 실패 후 핸들러
                .permitAll();                             // 위에 기입한 URL 인가처리 패스
}
~~~

위와 같이 기본적인 formLogin Setting을 함으로서 formLogin을 구현할 수 있다. 위 주석을 읽으면 각 메서드가 어떤 역할을 하는지 바로 이해가 될거라 생각된다, 다만 success와 failur Hanlder의 경우 굳이 구현하지 않아도 된다.    
다음 포스팅에서 이어서 설명하도록 하겠다.


### 참조

- [스프링 시큐리티 - Spring Boot 기반으로 개발하는 Spring Security - 정수원](https://www.inflearn.com/course/%EC%BD%94%EC%96%B4-%EC%8A%A4%ED%94%84%EB%A7%81-%EC%8B%9C%ED%81%90%EB%A6%AC%ED%8B%B0/dashboard)