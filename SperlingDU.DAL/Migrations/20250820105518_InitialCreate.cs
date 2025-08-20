using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SperlingDU.DAL.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "EmailTemplates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Subject = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false),
                    Body = table.Column<string>(type: "longtext", nullable: false),
                    Placeholders = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false),
                    TemplateType = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    LastModified = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailTemplates", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FileAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    FileName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    CudPath = table.Column<string>(type: "longtext", nullable: false),
                    FileType = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "longtext", nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    UploadDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    LastModified = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileAttachments", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "SystemSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    AccountantEmail = table.Column<string>(type: "longtext", nullable: false),
                    CpdFee = table.Column<int>(type: "int", nullable: false),
                    InvoiceDueDays = table.Column<int>(type: "int", nullable: false),
                    PaymentUrgencyDays = table.Column<int>(type: "int", nullable: false),
                    PaymentUrgencyPeriodDays = table.Column<int>(type: "int", nullable: false),
                    ActionNotificationDays = table.Column<int>(type: "int", nullable: false),
                    LastActionNotificationHours = table.Column<int>(type: "int", nullable: false),
                    SurveyReminderDays = table.Column<int>(type: "int", nullable: false),
                    CpdYearsCount = table.Column<int>(type: "int", nullable: false),
                    CpdClosureUrgencyDays = table.Column<int>(type: "int", nullable: false),
                    CpdClosureUrgencyPeriodDays = table.Column<int>(type: "int", nullable: false),
                    InvoiceSeriesIssued = table.Column<string>(type: "longtext", nullable: false),
                    InvoiceSeriesReceived = table.Column<string>(type: "longtext", nullable: false),
                    InvoiceSeriesSettlement = table.Column<string>(type: "longtext", nullable: false),
                    DefaultCertificationYears = table.Column<int>(type: "int", nullable: false),
                    CertificationExpiryThresholdDays = table.Column<int>(type: "int", nullable: false),
                    InfoBox = table.Column<string>(type: "longtext", nullable: false),
                    DefaultStudentDiscount = table.Column<int>(type: "int", nullable: false),
                    DefaultNonMemberSurcharge = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SystemSettings", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "EmailTemplates",
                columns: new[] { "Id", "Body", "CreatedAt", "LastModified", "Name", "Placeholders", "Subject", "TemplateType" },
                values: new object[,]
                {
                    { 1, "Dobrý den,\n\ninformujeme Vás o konání akce <nazev_akce>\nDatum: <datum_konani>\nCena: <cena_celkem> Kč\n\nS pozdravem,\ntým VETKOM", new DateTime(2025, 8, 20, 10, 55, 18, 186, DateTimeKind.Utc).AddTicks(5106), new DateTime(2025, 8, 20, 10, 55, 18, 186, DateTimeKind.Utc).AddTicks(5284), "Notifikace o akci", "nazev_akce,datum_konani,cena_celkem", "Informace o vzdělávací akci", "notification" },
                    { 2, "Faktura\n\nFakturujeme Vám za účast na akci <nazev_akce>\nDatum konání: <datum_konani>\nCelková cena: <cena_celkem> Kč\nLékař: <cele_jmeno_lekare>", new DateTime(2025, 8, 20, 10, 55, 18, 186, DateTimeKind.Utc).AddTicks(5594), new DateTime(2025, 8, 20, 10, 55, 18, 186, DateTimeKind.Utc).AddTicks(5594), "Faktura za akci", "nazev_akce,datum_konani,cena_celkem,cele_jmeno_lekare", "Faktura za vzdělávací akci", "document" }
                });

            migrationBuilder.InsertData(
                table: "SystemSettings",
                columns: new[] { "Id", "AccountantEmail", "ActionNotificationDays", "CertificationExpiryThresholdDays", "CpdClosureUrgencyDays", "CpdClosureUrgencyPeriodDays", "CpdFee", "CpdYearsCount", "DefaultCertificationYears", "DefaultNonMemberSurcharge", "DefaultStudentDiscount", "InfoBox", "InvoiceDueDays", "InvoiceSeriesIssued", "InvoiceSeriesReceived", "InvoiceSeriesSettlement", "LastActionNotificationHours", "PaymentUrgencyDays", "PaymentUrgencyPeriodDays", "SurveyReminderDays" },
                values: new object[] { 1, "ekonom@vetkom.cz", 7, 30, 30, 5, 500, 3, 5, 30, 30, "Vítejte v systému nastavení", 14, "324123", "124456", "224789", 24, 30, 3, 14 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EmailTemplates");

            migrationBuilder.DropTable(
                name: "FileAttachments");

            migrationBuilder.DropTable(
                name: "SystemSettings");
        }
    }
}
