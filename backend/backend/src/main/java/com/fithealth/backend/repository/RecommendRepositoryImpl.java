package com.fithealth.backend.repository;

import com.fithealth.backend.dto.Recommend.BmiRequestDto;
import com.fithealth.backend.dto.Recommend.RecommendExerciseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Repository
@RequiredArgsConstructor
public class RecommendRepositoryImpl implements RecommendRepository {

    private final RestTemplate restTemplate;

    @Value("${openai.model}")
    private String model;


    // 옵션 1: 새로운 @Value 변수를 추가하여 전체 엔드포인트를 가져옴
    @Value("${openai.api.chat-completions-url:https://api.openai.com/v1/chat/completions}")
    private String chatCompletionsUrl; // 새로운 변수명

    @Value("${openai.api-key}")
    private String openAiApiKey;

    private List<String> getExerciseImageNames(String category) {
        String folderName = switch (category) {
            case "헬스" -> "Health";
            case "요가" -> "Yoga";
            default -> "Health"; // 기본값
        };

        File eximgDir = new File("../frontend/public/Eximg/" + folderName);
        File[] files = eximgDir.listFiles((dir, name) -> name.endsWith(".png"));
        List<String> names = new ArrayList<>();
        if (files != null) {
            for (File file : files) {
                String fileName = file.getName();
                names.add(fileName.substring(0, fileName.lastIndexOf('.'))); // 확장자 제거
            }
        }
        return names;
    }

    @Override
    public List<RecommendExerciseDto> fetchRecommendExercise(BmiRequestDto bmiRequestDto) {
        String category = bmiRequestDto.getCategory();
        List<String> exerciseNames = getExerciseImageNames(category);
        String exerciseList = String.join(", ", exerciseNames);

        String prompt = String.format(
                "당신은 퍼스널 트레이너입니다.\n" +
                        "BMI가 %.1f인 사용자가 집에서 할 수 있는 운동 루틴을 요청했습니다.\n" +
                        "아래 조건을 반드시 지키세요.\n" +
                        "1. 운동명은 반드시 다음 목록에서만 선택하고, 표의 운동명도 파일명과 완전히 일치해야 합니다: %s\n" +
                        "2. 운동 루틴은 각 운동에 대해 운동명, 부위, 장비, 무게, 횟수, 셋트 정보를 포함하세요.\n" +
                        "3. 마크다운 표 형식으로 결과를 작성하세요.\n" +
                        "4. 운동명은 오타, 띄어쓰기, 대소문자 차이 없이 반드시 위 목록과 동일하게 작성하세요.\n" +
                        "5. 집에서 가능한 운동만 추천하세요.\n" +
                        "6. 운동은 최소 5개 최대 8개까지 추천해주세요.\n",
                bmiRequestDto.getBmi(),
                exerciseList
        );

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        // <<-- 여기를 수정합니다 -->>
        // 옵션 1: 새로운 변수 chatCompletionsUrl 사용
        ResponseEntity<Map> response = restTemplate.postForEntity(chatCompletionsUrl, entity, Map.class);

        // 옵션 2: 기존 openaiUrl 변수를 사용하여 문자열 조합 (만약 application.properties의 base-url이 https://api.openai.com/ 이라면)
        // String fullUrl = openaiUrl + "v1/chat/completions";
        // ResponseEntity<Map> response = restTemplate.postForEntity(fullUrl, entity, Map.class);


        String content = null;
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                if (message != null) {
                    content = (String) message.get("content");
                }
            }
        } catch (Exception e) {
            System.err.println("OpenAI 응답 파싱 오류: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>(); // 오류 발생 시 빈 리스트 반환
        }

        if (content == null) return new ArrayList<>();

        // <<-- 여기는 기존 코드와 동일하게 유지 -->>
        List<RecommendExerciseDto> result = new ArrayList<>();
        // ... (마크다운 파싱 로직) ...
        Pattern rowPattern = Pattern.compile("\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|([^|]+)\\|");
        Matcher matcher = rowPattern.matcher(content);
        int rowIndex = 0;

        while (matcher.find()) {
            rowIndex++;
            if (rowIndex <= 2) continue; // 헤더, 구분선 스킵

            String name = matcher.group(1).trim();
            String target = matcher.group(2).trim();
            if (name.isEmpty() || target.isEmpty()) continue;

            RecommendExerciseDto dto = new RecommendExerciseDto();
            dto.setExerciseName(name);
            dto.setExerciseTarget(target);
            dto.setExerciseItem(matcher.group(3).trim());

            try {
                dto.setExerciseWeight(Long.parseLong(matcher.group(4).replaceAll("[^0-9]", "").trim()));
            } catch (Exception e) {
                dto.setExerciseWeight(0L);
            }

            try {
                dto.setExerciseCount(Long.parseLong(matcher.group(5).replaceAll("[^0-9]", "").trim()));
            } catch (Exception e) {
                dto.setExerciseCount(0L);
            }

            try {
                dto.setExerciseSet(Long.parseLong(matcher.group(6).replaceAll("[^0-9]", "").trim()));
            } catch (Exception e) {
                dto.setExerciseSet(0L);
            }

            result.add(dto);
        }
        return result;
    }
}