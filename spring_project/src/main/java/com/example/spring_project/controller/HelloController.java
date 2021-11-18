package com.example.spring_project.controller;

import com.example.spring_project.common.searchWord;
import com.example.spring_project.services.wordChoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
    @CrossOrigin(origins = {"http://localhost:9000"})
public class HelloController {

    @Autowired
    private wordChoiceService service;

    @RequestMapping("/hello")
    public String hello() {
        return "hello spring on docker!";
    }

    @RequestMapping("/choice-word")
    @CrossOrigin(origins = {"*"})
    public List<searchWord> choice_word(@RequestParam("word") String word) {
        List<searchWord> searchWord = new ArrayList<>();
        if (word.isEmpty()) {
            return searchWord;
        }

        searchWord = service.returnWordList(word);

        return searchWord;
    }
}
