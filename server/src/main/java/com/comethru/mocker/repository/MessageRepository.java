package com.comethru.mocker.repository;

import com.comethru.mocker.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findByTo(String to);

    List<Message> findByFrom(String from);

    List<Message> findByFromAndTo(String from, String to);
}
