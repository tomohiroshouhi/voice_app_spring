package com.example.spring_project.services;

import com.example.spring_project.common.searchWord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Component
@Service
@PropertySource(value= "classpath:app.properties", encoding= "UTF-8")
public class wordChoiceService {
    @Value("${word.list}")
    private List<String> configWordList;

    public List<searchWord> returnWordList(String words) {
        List<searchWord> wordList = new ArrayList<>();

        for (String word: configWordList){
            Integer num = words.indexOf(word) + 1;
            if (words.contains(word)) {
                wordList.add(new searchWord(
                        word,
                        num,
                        "[" + word + "]という文字は" + num + "文字目です。",
                        beforeWord(words, word),
                        afterWord(words, word)
                ));
            }
        }

        return wordList;
    }

    private String beforeWord(String words,String word) {
        String before = "";
        Integer num = words.indexOf(word);

        if (num > 0 && num < 6 && words.contains(word)) {
            before = words.substring(0, num);
        } else if (num >= 6 && words.contains(word)) {
            before = words.substring(num - 6, num);
        }

        return before;
    }

    private String afterWord(String words,String word) {
        String after = "";
        Integer num = words.indexOf(word) + word.length();

        if (num + 5 < word.length() && words.contains(word)) {
            after = words.substring(num, word.length());
        } else if (num + 5 >= word.length() && words.contains(word)) {
            after = words.substring(num, num + 5);
        }

        return after;
    }
}
