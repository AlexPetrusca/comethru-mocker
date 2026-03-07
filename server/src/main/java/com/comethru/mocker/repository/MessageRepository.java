package com.comethru.mocker.repository;

import com.comethru.mocker.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByTo(String to);

    List<Message> findByFrom(String from);

    @Query("""
        SELECT m FROM Message m
        WHERE (m.from = :a AND m.to = :b)
           OR (m.from = :b AND m.to = :a)
        ORDER BY m.sentAt ASC
    """)
    List<Message> findConversation(@Param("a") String a, @Param("b") String b);
}
