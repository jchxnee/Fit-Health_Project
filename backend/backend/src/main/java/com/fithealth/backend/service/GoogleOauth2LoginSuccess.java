package com.fithealth.backend.service;

import com.fithealth.backend.auth.JwtTokenProvider;
import com.fithealth.backend.entity.Member;
import com.fithealth.backend.enums.CommonEnums.Grade;
import com.fithealth.backend.enums.Role;
import com.fithealth.backend.enums.SocialType;
import com.fithealth.backend.repository.MemberRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class GoogleOauth2LoginSuccess extends SimpleUrlAuthenticationSuccessHandler {
    private final MemberRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;

    //Oauth2 인증에 성공했을 때 호출
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        //OAuth2User는 인증된 사용자의 정보를 담는 객체(Google에서 반환한 사용자 json 포함)
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        System.out.println("OAuth2User Attributes : " + oAuth2User.getAttributes());

        //만약 여러가지 플랫폼을 통해서 oauth2 인증을 진행시 아래 코드로 분기 처리 후 사용
          String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId()
                  .toUpperCase();
          SocialType socialType = SocialType.valueOf(registrationId);

        String socialId = null;
        String email = null;
        String name = null;

        if (socialType == SocialType.GOOGLE) {
            socialId = oAuth2User.getAttribute("sub");
            email = oAuth2User.getAttribute("email");
            name = oAuth2User.getAttribute("name") != null ? oAuth2User.getAttribute("name") : "Google User";
        } else if (socialType == SocialType.KAKAO) {
            Object idObj = oAuth2User.getAttribute("id");
            socialId = (idObj != null) ? idObj.toString() : null;

            Map<String, Object> kakaoAccount = oAuth2User.getAttribute("kakao_account");
            email = kakaoAccount != null ? (String) kakaoAccount.get("email") : null;

            Map<String, Object> profile = kakaoAccount != null
                    ? (Map<String, Object>) kakaoAccount.get("profile")
                    : null;

            if (profile != null && profile.get("nickname") instanceof String) {
                name = (String) profile.get("nickname");
            } else {
                Map<String, Object> properties = (Map<String, Object>) oAuth2User.getAttribute("properties");
                if (properties != null && properties.get("nickname") instanceof String) {
                    name = (String) properties.get("nickname");
                } else {
                    name = "Kakao User";
                }
            }
        } else if (socialType == SocialType.NAVER) {
            System.out.println("Naver OAuth2User attributes: " + oAuth2User.getAttributes());
            Map<String, Object> responseData = oAuth2User.getAttribute("response");
            if (responseData != null) {
                socialId = (String) responseData.get("id");
                email = (String) responseData.get("email");
                name = (String) responseData.get("name");

                if (name == null) {
                    name = "Naver User";
                }
            }
        }

        Member member = memberRepository.findBySocialIdAndSocialType(socialId, socialType).orElse(null);
        if (member == null) {
            member = Member.builder()
                    .userEmail(email)
                    .userName(name)
                    .userPwd("")
                    .socialId(socialId)
                    .socialType(socialType)
                    .grade(Grade.U)
                    .role(Role.USER)
                    .build();
            memberRepository.save(member);
        }

        String jwtToken = jwtTokenProvider.createToken(member.getUserEmail(), member.getRole().toString());

        Cookie jwtCookie = new Cookie("token", jwtToken);
        jwtCookie.setPath("/"); //모든 경로에서 쿠키 사용가능
        response.addCookie(jwtCookie);
        response.sendRedirect("http://localhost:5173");

    }

}
