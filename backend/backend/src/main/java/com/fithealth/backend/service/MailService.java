package com.fithealth.backend.service;

import com.fithealth.backend.dto.Mail.MailRequestDto;
import com.fithealth.backend.entity.EmailCode;
import com.fithealth.backend.repository.EmailCodeRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final EmailCodeRepository emailCodeRepository;

    public void sendMail(MailRequestDto request, MultipartFile file, String code) throws MessagingException {
        // 1. 템플릿에 사용할 데이터 구성
        Context context = new Context();
        context.setVariable("title", request.getTitle());
        context.setVariable("body", request.getBody());
        context.setVariable("code", "인증 코드 : " + code);

        boolean isFile = file != null && !file.isEmpty();

        // 2. 템플릿 렌더링
        String htmlContent = templateEngine.process("email-template", context);

        // 3. 메일 생성 및 전송
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, isFile, "UTF-8");

        helper.setTo(request.getTo());
        helper.setSubject(request.getSubject());
        helper.setText(htmlContent, true);
        helper.setFrom("fit-health@gmail.com");

        if(isFile) {
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            helper.addAttachment(originalFilename, file);
        }

        mailSender.send(message);
    }

    public String createCode(MailRequestDto request) {
        String email = request.getTo();
        String code = generateRandomCode();

        Optional<EmailCode> optionalCode = emailCodeRepository.findByEmail(email);

        EmailCode emailCode;
        if (optionalCode.isPresent()) {
            emailCode = optionalCode.get();
            emailCode.changeCode(code);
        } else {
            // 존재하지 않을 경우 → 새로 생성
            emailCode = EmailCode.builder()
                    .email(email)
                    .code(code)
                    .createdDate(LocalDateTime.now())  // @PrePersist가 있어도 명시해도 무방
                    .build();
        }
        // 생성, 수정 모두 save 호출해야 반영됨
        emailCodeRepository.save(emailCode);
        return emailCode.getCode();
    }

    private String generateRandomCode() {
        Random random = new Random();
        int codeNum = 100000 + random.nextInt(900000); // 100000~999999 사이 6자리 숫자
        return String.valueOf(codeNum);
    }

    public Boolean checkCode(String email, String code) {
        EmailCode emailCode = emailCodeRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("이메일이 존재하지 않습니다."));

        long diffSeconds = java.time.Duration.between(emailCode.getCreatedDate(), LocalDateTime.now()).getSeconds();

        if (diffSeconds > 180) { // 3분 초과
            throw new IllegalArgumentException("인증 시간이 만료되었습니다.");
            // 또는 return false; 해도 됨
        }
        return emailCode.getCode().equals(code);
    }
}