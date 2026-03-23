package com.dbi.backend.service;

import com.dbi.backend.repository.SchemeRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class SchemeExpiryScheduler {

    @Autowired
    private SchemeRepository schemeRepository;

    @Transactional
    @Scheduled(cron = "0 0 0 * * *")
    @EventListener(ApplicationReadyEvent.class)
    public void expireSchemes() {
        int count = schemeRepository.expireSchemesBefore(LocalDate.now());
        if (count > 0) {
            System.out.println("[SchemeExpiryScheduler] Expired " + count + " scheme(s).");
        }
    }
}
