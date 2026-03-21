package com.dbi.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(length = 1000)
    private String comments;

    @Column(length = 500)
    private String amountSpentOn; // How they spent the amount

    @Column(length = 500)
    private String benefitReceived; // What benefit they received

    @Column
    private Boolean wouldRecommend; // Would they recommend this scheme

    @Column(length = 500)
    private String suggestions; // Suggestions for improvement

    @Column(nullable = false)
    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public String getAmountSpentOn() { return amountSpentOn; }
    public void setAmountSpentOn(String amountSpentOn) { this.amountSpentOn = amountSpentOn; }
    public String getBenefitReceived() { return benefitReceived; }
    public void setBenefitReceived(String benefitReceived) { this.benefitReceived = benefitReceived; }
    public Boolean getWouldRecommend() { return wouldRecommend; }
    public void setWouldRecommend(Boolean wouldRecommend) { this.wouldRecommend = wouldRecommend; }
    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
