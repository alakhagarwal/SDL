package com.sdl.backend.util;

import com.sdl.backend.model.*;
import com.sdl.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final WellnessProfileRepository profileRepository;
    private final WellnessServiceRepository serviceRepository;
    private final ServiceRequestRepository requestRepository;
    private final AvailabilitySlotRepository slotRepository;
    private final AppointmentRepository appointmentRepository;
    private final HabitLogRepository habitLogRepository;
    private final ResourceArticleRepository articleRepository;
    private final NotificationRepository notificationRepository;
    private final AdminAuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded with demo data.");
            return;
        }

        log.info("Seeding Student Wellness Portal demo database with initial users and records...");

        String defaultPass = passwordEncoder.encode("password123");

        // 1. Create Users
        User studentAlakh = User.builder()
                .fullName("Alakh Agarwal")
                .email("24ucs001@lnmiit.ac.in")
                .passwordHash(defaultPass)
                .role(Role.STUDENT)
                .rollNumber("24UCS001")
                .department("Computer Science & Engineering")
                .contactNumber("+91 9876543210")
                .accountStatus("Active")
                .build();

        User studentDaksh = User.builder()
                .fullName("Daksh Mittal")
                .email("24ucs002@lnmiit.ac.in")
                .passwordHash(defaultPass)
                .role(Role.STUDENT)
                .rollNumber("24UCS002")
                .department("Computer Science & Engineering")
                .contactNumber("+91 9876543211")
                .accountStatus("Active")
                .build();

        User counselorAnanya = User.builder()
                .fullName("Dr. Ananya Sharma")
                .email("counselor@lnmiit.ac.in")
                .passwordHash(defaultPass)
                .role(Role.COUNSELOR)
                .department("Institutional Counseling Cell")
                .contactNumber("+91 9876543212")
                .accountStatus("Active")
                .build();

        User counselorRajesh = User.builder()
                .fullName("Dr. Rajesh Verma")
                .email("counselor2@lnmiit.ac.in")
                .passwordHash(defaultPass)
                .role(Role.COUNSELOR)
                .department("Campus Mental Health Unit")
                .contactNumber("+91 9876543213")
                .accountStatus("Active")
                .build();

        User healthOfficer = User.builder()
                .fullName("Dr. S. K. Gupta")
                .email("healthcenter@lnmiit.ac.in")
                .passwordHash(defaultPass)
                .role(Role.HEALTH_CENTER)
                .department("LNMIIT Campus Medical Center")
                .contactNumber("+91 9876543214")
                .accountStatus("Active")
                .build();

        User adminUser = User.builder()
                .fullName("System Administrator")
                .email("admin@lnmiit.ac.in")
                .passwordHash(defaultPass)
                .role(Role.ADMIN)
                .department("Dean of Student Affairs Office")
                .contactNumber("+91 9876543215")
                .accountStatus("Active")
                .build();

        userRepository.saveAll(List.of(studentAlakh, studentDaksh, counselorAnanya, counselorRajesh, healthOfficer, adminUser));

        // 2. Create Wellness Profiles
        WellnessProfile profileAlakh = WellnessProfile.builder()
                .user(studentAlakh)
                .emergencyContactName("Sunil Agarwal")
                .emergencyContactPhone("+91 9811223344")
                .emergencyContactRelation("Father")
                .primaryConcerns("Exam Anxiety & Hostel Sleep Adjustment")
                .preferredCounselingMode("Telehealth")
                .anonymityAlias("BluePhoenix")
                .onboardingCompleted(true)
                .build();

        WellnessProfile profileDaksh = WellnessProfile.builder()
                .user(studentDaksh)
                .emergencyContactName("Rajesh Mittal")
                .emergencyContactPhone("+91 9822334455")
                .emergencyContactRelation("Father")
                .primaryConcerns("Academic Coursework Load")
                .preferredCounselingMode("In-person")
                .anonymityAlias("SilverEcho")
                .onboardingCompleted(true)
                .build();

        profileRepository.saveAll(List.of(profileAlakh, profileDaksh));

        // 3. Create Wellness Services
        WellnessService serviceMentalHealth = WellnessService.builder()
                .title("Individual Psychological Counseling")
                .category("Mental Health")
                .description("Confidential, evidence-based one-on-one psychological counseling sessions for students navigating stress, mood dysregulation, interpersonal challenges, and emotional strain.")
                .mode("Both")
                .venue("Counseling Wing, SAC Room 204")
                .dailyCapacity(8)
                .status("Active")
                .assignedCounselor(counselorAnanya)
                .build();

        WellnessService serviceAcademic = WellnessService.builder()
                .title("Academic Stress & Exam Anxiety Coaching")
                .category("Academic Stress")
                .description("Specialized guidance focusing on cognitive restructuring, time prioritization, overcoming procrastination, and dealing with intense semester coursework pressure.")
                .mode("In-person")
                .venue("Counseling Wing, SAC Room 206")
                .dailyCapacity(10)
                .status("Active")
                .assignedCounselor(counselorRajesh)
                .build();

        WellnessService serviceNutrition = WellnessService.builder()
                .title("Nutritional Health & Hostel Lifestyle Consultation")
                .category("Nutrition & Fitness")
                .description("Consultations tailored to hostel dining adjustments, balanced dietary habits, energy stability during examination periods, and sleep-nutrition harmony.")
                .mode("In-person")
                .venue("Campus Medical Center Room 102")
                .dailyCapacity(6)
                .status("Active")
                .assignedCounselor(counselorAnanya)
                .build();

        WellnessService servicePeerSupport = WellnessService.builder()
                .title("Confidential Peer Listening & Empathy Circles")
                .category("Peer Support")
                .description("A student-to-student safe listening space facilitated by trained senior mentors and supervised by campus counselors.")
                .mode("Telehealth")
                .venue("Virtual Consultation Room")
                .dailyCapacity(12)
                .status("Active")
                .assignedCounselor(counselorRajesh)
                .build();

        serviceRepository.saveAll(List.of(serviceMentalHealth, serviceAcademic, serviceNutrition, servicePeerSupport));

        // 4. Create Availability Slots for Counselors (Tomorrow, Day after tomorrow, +3 days)
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate dayAfter = LocalDate.now().plusDays(2);
        LocalDate threeDays = LocalDate.now().plusDays(3);

        AvailabilitySlot slot1 = AvailabilitySlot.builder()
                .counselor(counselorAnanya)
                .slotDate(tomorrow)
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(10, 45))
                .status(SlotStatus.AVAILABLE)
                .build();

        AvailabilitySlot slot2 = AvailabilitySlot.builder()
                .counselor(counselorAnanya)
                .slotDate(tomorrow)
                .startTime(LocalTime.of(11, 0))
                .endTime(LocalTime.of(11, 45))
                .status(SlotStatus.AVAILABLE)
                .build();

        AvailabilitySlot slot3 = AvailabilitySlot.builder()
                .counselor(counselorAnanya)
                .slotDate(dayAfter)
                .startTime(LocalTime.of(14, 0))
                .endTime(LocalTime.of(14, 45))
                .status(SlotStatus.AVAILABLE)
                .build();

        AvailabilitySlot slot4 = AvailabilitySlot.builder()
                .counselor(counselorAnanya)
                .slotDate(dayAfter)
                .startTime(LocalTime.of(15, 0))
                .endTime(LocalTime.of(15, 45))
                .status(SlotStatus.AVAILABLE)
                .build();

        AvailabilitySlot slot5 = AvailabilitySlot.builder()
                .counselor(counselorRajesh)
                .slotDate(tomorrow)
                .startTime(LocalTime.of(15, 0))
                .endTime(LocalTime.of(15, 45))
                .status(SlotStatus.AVAILABLE)
                .build();

        AvailabilitySlot slot6 = AvailabilitySlot.builder()
                .counselor(counselorRajesh)
                .slotDate(threeDays)
                .startTime(LocalTime.of(11, 0))
                .endTime(LocalTime.of(11, 45))
                .status(SlotStatus.AVAILABLE)
                .build();

        slotRepository.saveAll(List.of(slot1, slot2, slot3, slot4, slot5, slot6));

        // 5. Seed Initial Requests for demonstration
        // Case A: PENDING_REVIEW (in Counselor Triage Queue)
        ServiceRequest pendingReq = ServiceRequest.builder()
                .student(studentAlakh)
                .service(serviceMentalHealth)
                .urgencyLevel(UrgencyLevel.PRIORITY)
                .description("Experiencing recurring sleep disruption and difficulty maintaining concentration during continuous lab hours.")
                .preferredSchedule("Weekday afternoons after 3 PM")
                .preferredMode("Telehealth")
                .status(RequestStatus.PENDING_REVIEW)
                .createdAt(LocalDateTime.now().minusHours(2))
                .updatedAt(LocalDateTime.now().minusHours(2))
                .build();

        // Case B: TRIAGED (ready for student slot booking demonstration!)
        ServiceRequest triagedReq = ServiceRequest.builder()
                .student(studentDaksh)
                .service(serviceAcademic)
                .urgencyLevel(UrgencyLevel.ROUTINE)
                .description("Struggling with mid-term project deadlines and looking for systematic stress management guidance.")
                .preferredSchedule("Morning slots preferred")
                .preferredMode("In-person")
                .status(RequestStatus.TRIAGED)
                .assignedCounselor(counselorAnanya)
                .createdAt(LocalDateTime.now().minusHours(24))
                .updatedAt(LocalDateTime.now().minusHours(12))
                .build();

        requestRepository.saveAll(List.of(pendingReq, triagedReq));

        // 6. Seed Sample Habit Logs for past 5 days (shows streak and chart)
        for (int i = 5; i >= 1; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            HabitLog log = HabitLog.builder()
                    .student(studentAlakh)
                    .logDate(date)
                    .sleepHours(6.5 + (i % 3) * 0.5)
                    .waterIntakeLiters(2.5 + (i % 2) * 0.5)
                    .meditationMinutes(15 + i * 2)
                    .workoutMinutes(20 + i * 5)
                    .moodScore(3 + (i % 3))
                    .journalTag("Reflected on daily targets and hydration")
                    .streakCount(6 - i)
                    .createdAt(LocalDateTime.now().minusDays(i))
                    .build();
            habitLogRepository.save(log);
        }

        // 7. Seed Psychoeducational Articles
        ResourceArticle art1 = ResourceArticle.builder()
                .title("Demystifying Exam Anxiety: Cognitive Grounding Techniques")
                .category("Stress Management")
                .summary("Understand the neurobiology of academic panic and learn the 5-4-3-2-1 sensory grounding method for immediate focus.")
                .contentBody("Exam anxiety triggers our autonomic nervous system into fight-or-flight mode. By practicing controlled diaphragmatic breathing (4-7-8 method) and sensory grounding, students can regulate their amygdala activation during high-stakes presentations and examinations...")
                .authorStaff(counselorAnanya)
                .tags("Anxiety, Exams, Grounding, Mindfulness")
                .readTimeMinutes(6)
                .thumbnailUrl("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80")
                .status("Published")
                .publishedDate(LocalDate.now().minusDays(10))
                .build();

        ResourceArticle art2 = ResourceArticle.builder()
                .title("Circadian Rhythm Alignment for Hostel Students")
                .category("Sleep Hygiene")
                .summary("Evidence-based strategies to optimize sleep quality despite irregular hostel schedules and late-night coding routines.")
                .contentBody("Hostel environments present unique challenges to sleep architecture: ambient blue light, inconsistent noise levels, and midnight caffeine intake. Implementing a consistent wind-down buffer 30 minutes before sleep restores deep delta wave restoration...")
                .authorStaff(counselorRajesh)
                .tags("Sleep, Hostel, Circadian, Health")
                .readTimeMinutes(5)
                .thumbnailUrl("https://images.unsplash.com/photo-1511295742362-92c96b124e52?w=600&auto=format&fit=crop&q=80")
                .status("Published")
                .publishedDate(LocalDate.now().minusDays(5))
                .build();

        ResourceArticle art3 = ResourceArticle.builder()
                .title("Overcoming Imposter Syndrome in Engineering Disciplines")
                .category("Academic Stress")
                .summary("Recognizing cognitive distortions, valuing individual learning curves, and fostering psychological safety.")
                .contentBody("Rigorous technical curricula often lead high-achieving students to attribute their achievements to external luck rather than competence. This guide explores narrative reframing and mentorship collaboration...")
                .authorStaff(counselorAnanya)
                .tags("Engineering, Self-Worth, ImposterSyndrome")
                .readTimeMinutes(7)
                .thumbnailUrl("https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80")
                .status("Published")
                .publishedDate(LocalDate.now().minusDays(2))
                .build();

        articleRepository.saveAll(List.of(art1, art2, art3));

        // 8. Seed Notification
        Notification notif = Notification.builder()
                .recipient(studentAlakh)
                .type("REQUEST_UPDATE")
                .title("Support Request #REQ-" + pendingReq.getRequestId() + " Queued")
                .message("Your confidential support inquiry is currently under clinical review in the triage dashboard.")
                .actionUrl("/dashboard")
                .isRead(false)
                .createdAt(LocalDateTime.now().minusHours(2))
                .build();
        notificationRepository.save(notif);

        // 9. Initial Audit Log
        AdminAuditLog initLog = AdminAuditLog.builder()
                .actorUser(adminUser)
                .actionType("SYSTEM_INITIALIZE")
                .targetEntity("Database")
                .entityId(1L)
                .ipAddress("127.0.0.1")
                .timestamp(LocalDateTime.now())
                .details("Institutional seed dataset initialized successfully.")
                .build();
        auditLogRepository.save(initLog);

        log.info("Student Wellness Portal demo database seeded successfully.");
    }
}
