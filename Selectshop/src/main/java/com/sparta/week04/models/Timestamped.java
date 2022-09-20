package com.sparta.week04.models;

import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import java.time.LocalDateTime;

@Getter // get 함수를 자동 생성.
@MappedSuperclass // 멤버 변수가 컬럼이 되도록 한다.
@EntityListeners(AuditingEntityListener.class) // 변경되었을 때 자동으로 기록.
public abstract class Timestamped {

    // 최초 생성 시점
    @CreatedDate
    private LocalDateTime createdAt;

    // 마지막 변경 시점
    @LastModifiedDate
    private  LocalDateTime modifiedAt;
}
