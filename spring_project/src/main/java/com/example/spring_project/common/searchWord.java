package com.example.spring_project.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public
class searchWord {
    private String word;
    private Integer counter;
    private String message;
    private String beforeWord;
    private String afterWord;
}
