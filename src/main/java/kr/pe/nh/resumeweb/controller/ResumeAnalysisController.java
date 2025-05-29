package kr.pe.nh.resumeweb.controller;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.beans.factory.annotation.Autowired;


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import com.fasterxml.jackson.databind.ObjectMapper;

import kr.pe.nh.resumeweb.model.Resume;
import kr.pe.nh.resumeweb.repository.ResumeRepository;

import java.util.*;

@RestController
@RequestMapping("/api/resume")
public class ResumeAnalysisController {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

    @Data
    public static class ResumeRequest {
        private String content;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeText(@RequestBody ResumeRequest request) {
        try {
            // 분석 요청
            Map<String, Object> analysisResult = requestToGPT(request, true);

            // 보완 요청
            String refinePrompt = """
                다음 자기소개서를 문장력, 구체성, 지원동기, 성장과정 관점에서 보완해줘.
                단, 전체 흐름과 문단 구성은 유지하고, 문장 표현을 자연스럽게 다듬되 각 항목이 뚜렷하게 드러나도록 수정해줘.
                자기소개서:
                """ + request.getContent();

            ResumeRequest refineRequest = new ResumeRequest();
            refineRequest.setContent(refinePrompt);
            Map<String, Object> refineResponse = requestToGPT(refineRequest, false);
            String refinedText = (String) refineResponse.get("content");

            Map<String, Object> result = new HashMap<>();
            result.put("analysis", analysisResult);
            result.put("rawText", request.getContent());
            result.put("refined", refinedText);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("텍스트 분석 실패: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            String extractedText = extractText(file);
            if (extractedText == null) {
                return ResponseEntity.badRequest().body("지원하지 않는 파일 형식입니다.");
            }

            ResumeRequest request = new ResumeRequest();
            request.setContent(extractedText);

            return analyzeText(request); // 공통 로직 재사용
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 분석 실패: " + e.getMessage());
        }
    }

    private Map<String, Object> requestToGPT(ResumeRequest request, boolean isAnalysis) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        String prompt = isAnalysis ?
                """
                다음 자기소개서를 문장력, 구체성, 지원동기, 성장과정 관점에서 분석해서 아래 JSON 형식으로 설명 없이 정확하게 응답해줘:
                {
                  "문장력": "...",
                  "구체성": "...",
                  "지원동기": "...",
                  "성장과정": "..."
                }
                자기소개서:
                """ + request.getContent()
                : request.getContent();

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-3.5-turbo");
        body.put("messages", List.of(Map.of("role", "user", "content", prompt)));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_API_URL, entity, Map.class);

        Map<String, Object> full = response.getBody();
        Map<String, Object> message = (Map<String, Object>) ((Map<String, Object>) ((List<?>) full.get("choices")).get(0)).get("message");
        String content = (String) message.get("content");

        if (isAnalysis) {
            try {
                return new ObjectMapper().readValue(content, Map.class);
            } catch (Exception e) {
                throw new RuntimeException("GPT 응답 JSON 파싱 실패: " + content);
            }
        } else {
            return Map.of("content", content);
        }
    }

    @Autowired
    private ResumeRepository resumeRepository;

    @PostMapping("/analyze-and-save")
    public ResponseEntity<?> analyzeAndSave(@RequestBody ResumeRequest request) {
        try {
            // GPT 분석
            Map<String, Object> analysisResult = requestToGPT(request, true);

            String refinePrompt = "다음 자기소개서를 보완해줘:\n" + request.getContent();
            ResumeRequest refineRequest = new ResumeRequest();
            refineRequest.setContent(refinePrompt);

            Map<String, Object> refinedResult = requestToGPT(refineRequest, false);

            // DB 저장
            Resume resume = Resume.builder()
                    .title("GPT 분석 이력서")
                    .rawText(request.getContent())
                    .refinedText((String) refinedResult.get("content"))
                    .sentenceScore((String) analysisResult.get("문장력"))
                    .detailScore((String) analysisResult.get("구체성"))
                    .motiveScore((String) analysisResult.get("지원동기"))
                    .growthScore((String) analysisResult.get("성장과정"))
                    .createdAt(new Date().toString())
                    .build();

            resumeRepository.save(resume);
            return ResponseEntity.ok(resume);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("실패: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getAllResumes() {
        try {
            List<Resume> resumes = resumeRepository.findAll();
            return ResponseEntity.ok(resumes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("조회 실패: " + e.getMessage());
        }
    }



    private String extractText(MultipartFile file) throws Exception {
        if (file.getOriginalFilename().endsWith(".pdf")) {
            try (PDDocument doc = PDDocument.load(file.getInputStream())) {
                return new PDFTextStripper().getText(doc);
            }
        } else if (file.getOriginalFilename().endsWith(".docx")) {
            try (XWPFDocument doc = new XWPFDocument(file.getInputStream())) {
                return new XWPFWordExtractor(doc).getText();
            }
        }
        return null;
    }
}
