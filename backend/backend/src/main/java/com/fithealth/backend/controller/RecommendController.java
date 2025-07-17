package com.fithealth.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fithealth.backend.dto.Recommend.BmiRequestDto;
import com.fithealth.backend.dto.Recommend.DietRequestDto;
import com.fithealth.backend.dto.Recommend.RecommendDietDto;
import com.fithealth.backend.dto.Recommend.RecommendExerciseDto;
import com.fithealth.backend.service.RecommendService;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger; // Logger import
import org.slf4j.LoggerFactory; // LoggerFactory import


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/recommend")
@RequiredArgsConstructor
public class RecommendController {
    private static final Logger logger = LoggerFactory.getLogger(RecommendController.class); // Logger 인스턴스 생성

    private final RecommendService recommendService;

    @Autowired
    private ChatModel chatModel;

    @Autowired
    private ObjectMapper objectMapper;

    // The prompt template resource for diet recommendations
    @Value("classpath:/diet-prompt-template.st")
    private Resource dietPromptTemplate;

    @PostMapping("/exercise")
    public ResponseEntity<List<RecommendExerciseDto>> recommendExercise(@RequestBody BmiRequestDto bmiRequestDto) {
        List<RecommendExerciseDto> result = recommendService.getRecommendExercise(bmiRequestDto);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/diet")
    public RecommendDietDto recommendDiet(@RequestBody @Valid DietRequestDto dietRequestDto) {
        try {
            System.out.println("프론트에서 받은 결과는 : " + dietRequestDto);
            System.out.println("name: " + dietRequestDto.getName());
            System.out.println("gender: " + dietRequestDto.getGender());
            System.out.println("age: " + dietRequestDto.getAge());
            System.out.println("height: " + dietRequestDto.getHeight());
            System.out.println("weight: " + dietRequestDto.getWeight());
            System.out.println("weeklyExerciseFrequency: " + dietRequestDto.getWeeklyExerciseFrequency());
            System.out.println("bmr: " + dietRequestDto.getBmr());
            System.out.println("goalCategory: " + dietRequestDto.getGoalCategory());

            // 1. 시스템 메시지로 JSON 스키마를 정의합니다.
            // 이 문자열을 system() 메서드에 직접 전달합니다.
            String systemPromptContent = """
                당신은 개인 맞춤형 식단을 추천해주는 전문 영양사입니다.
                사용자가 이해하기 쉽게 **JSON 형식**으로만 출력하세요.
                **설명 문장이나 코드 블록(```json 등)은 절대 포함하지 마세요.**

                --- 출력 예시 스키마 ---
                {
                  "breakfast": {
                    "menu": ["예: 오트밀", "닭가슴살 100g", "사과 반쪽"],
                    "description": "아침은 단백질과 복합 탄수화물 위주로 구성된 균형 잡힌 식단입니다.",
                    "nutrients": {
                      "carbsPercentage": 50,
                      "proteinPercentage": 30,
                      "fatsPercentage": 20
                    },
                    "calories": 500
                  },
                  "lunch": {
                    "menu": ["현미밥", "소고기 불고기", "미역국"],
                    "description": "점심은 에너지를 충분히 공급할 수 있도록 탄수화물과 단백질을 조화롭게 구성했습니다.",
                    "nutrients": {
                      "carbsPercentage": 45,
                      "proteinPercentage": 35,
                      "fatsPercentage": 20
                    },
                    "calories": 700
                  },
                  "dinner": {
                    "menu": ["두부 샐러드", "삶은 계란", "고구마"],
                    "description": "저녁은 소화가 잘되는 저지방 고단백 식단으로 구성했습니다.",
                    "nutrients": {
                      "carbsPercentage": 40,
                      "proteinPercentage": 40,
                      "fatsPercentage": 20
                    },
                    "calories": 400
                  },
                  "totalDailyCalories": 1600
                }

                ※ 음식은 한국인이 일반적으로 섭취하는 식품을 기준으로 구성하세요.
                """;

            // 2. 사용자 메시지로 실제 사용자 정보를 전달합니다.
            String userPromptContent = """
                다음 사용자 정보를 바탕으로, 아침, 점심, 저녁 식단을 추천해주세요.
                각 식단은 구체적인 음식 이름 2~3가지로 구성하고, 간단한 설명도 포함해주세요.
                또한 각 식단의 탄수화물, 단백질, 지방 비율과 예상 칼로리를 포함해주세요.

                --- 사용자 정보 ---
                이름: {name}
                성별: {gender}
                나이: {age} 세
                키: {height} cm
                몸무게: {weight} kg
                주간 운동 횟수: {weeklyExerciseFrequency} 회
                기초대사량(BMR): {bmr} kcal
                목표: {goalCategory}
                """;

            ChatClient chatClient = ChatClient.builder(chatModel).build();

            RecommendDietDto recommendedDiet = chatClient.prompt()
                    .system(systemPromptContent)
                    .user(userSpec -> userSpec.text(userPromptContent)
                            .param("name", dietRequestDto.getName())
                            .param("gender", dietRequestDto.getGender())
                            .param("age", dietRequestDto.getAge())
                            .param("height", dietRequestDto.getHeight())
                            .param("weight", dietRequestDto.getWeight())
                            .param("weeklyExerciseFrequency", dietRequestDto.getWeeklyExerciseFrequency())
                            .param("bmr", dietRequestDto.getBmr())
                            .param("goalCategory", dietRequestDto.getGoalCategory())
                    )
                    .call()
                    .entity(new ParameterizedTypeReference<RecommendDietDto>() {});

            String jsonResponse = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(recommendedDiet);
            System.out.println("백엔드에서 프론트엔드로 전송될 JSON 응답: \n" + jsonResponse);

            return recommendedDiet;

        } catch (IllegalArgumentException e) {
            logger.error("Invalid request for diet recommendation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Server error occurred while generating diet recommendation: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "식단 추천을 생성하는 중 서버 오류가 발생했습니다.", e);
        }
    }
}
