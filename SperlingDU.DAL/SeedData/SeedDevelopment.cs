using Microsoft.EntityFrameworkCore;
using SperlingDU.DAL.Entities;

namespace SperlingDU.DAL.SeedData
{
    public static class SeedDevelopment
    {
        public static void Seed(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmailTemplate>().HasData(
                new EmailTemplate
                {
                    Id = 1,
                    Name = "Notifikace o akci",
                    Subject = "Informace o vzdělávací akci",
                    Body = "Dobrý den,\n\ninformujeme Vás o konání akce <nazev_akce>\nDatum: <datum_konani>\nCena: <cena_celkem> Kč\n\nS pozdravem,\ntým VETKOM",
                    Placeholders = "nazev_akce,datum_konani,cena_celkem",
                    TemplateType = "notification",
                    CreatedAt = DateTime.UtcNow,
                    LastModified = DateTime.UtcNow
                },
                new EmailTemplate
                {
                    Id = 2,
                    Name = "Faktura za akci",
                    Subject = "Faktura za vzdělávací akci",
                    Body = "Faktura\n\nFakturujeme Vám za účast na akci <nazev_akce>\nDatum konání: <datum_konani>\nCelková cena: <cena_celkem> Kč\nLékař: <cele_jmeno_lekare>",
                    Placeholders = "nazev_akce,datum_konani,cena_celkem,cele_jmeno_lekare",
                    TemplateType = "document",
                    CreatedAt = DateTime.UtcNow,
                    LastModified = DateTime.UtcNow
                }
            );

            modelBuilder.Entity<SystemSettings>().HasData(
                new SystemSettings
                {
                    Id = 1,
                    AccountantEmail = "ekonom@vetkom.cz",
                    CpdFee = 500,
                    InvoiceDueDays = 14,
                    PaymentUrgencyDays = 30,
                    PaymentUrgencyPeriodDays = 3,
                    ActionNotificationDays = 7,
                    LastActionNotificationHours = 24,
                    SurveyReminderDays = 14,
                    CpdYearsCount = 3,
                    CpdClosureUrgencyDays = 30,
                    CpdClosureUrgencyPeriodDays = 5,
                    InvoiceSeriesIssued = "324123",
                    InvoiceSeriesReceived = "124456",
                    InvoiceSeriesSettlement = "224789",
                    DefaultCertificationYears = 5,
                    CertificationExpiryThresholdDays = 30,
                    InfoBox = "Vítejte v systému nastavení",
                    DefaultStudentDiscount = 30,
                    DefaultNonMemberSurcharge = 30
                }
            );
        }
    }
}