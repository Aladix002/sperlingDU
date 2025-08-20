using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Mappers;
using SperlingDU.DAL.Entities;
using SperlingDU.DAL.UnitOfWork;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text;
using System.Net;
using PdfSharpCore.Pdf;
using PdfSharpCore.Drawing;
using System.Text.RegularExpressions;

namespace SperlingDU.BLL.Services
{
    public class EmailTemplateService : IEmailTemplateService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailTemplateMapper _mapper;

        public EmailTemplateService(IUnitOfWork unitOfWork, IEmailTemplateMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EmailTemplateDto>> GetAllTemplatesAsync()
        {
            var templates = await _unitOfWork.EmailTemplates.GetAllAsync();
            return templates.Select(t => _mapper.ToDto(t));
        }

        public async Task<EmailTemplateDto> GetTemplateByIdAsync(int id)
        {
            var template = await _unitOfWork.EmailTemplates.GetByIdAsync(id);
            return template != null ? _mapper.ToDto(template) : null!;
        }

        public async Task<EmailTemplateDto> CreateTemplateAsync(CreateEmailTemplateDto createDto)
        {
            var entity = _mapper.ToEntity(createDto);
            
            await _unitOfWork.EmailTemplates.AddAsync(entity);
            await _unitOfWork.SaveAsync();

            return _mapper.ToDto(entity);
        }

        public async Task<EmailTemplateDto> UpdateTemplateAsync(int id, UpdateEmailTemplateDto updateDto)
        {
            var existingTemplate = await _unitOfWork.EmailTemplates.GetByIdAsync(id);
            if (existingTemplate == null)
            {
                throw new InvalidOperationException("Template not found");
            }

            _mapper.UpdateEntity(existingTemplate, updateDto);
            _unitOfWork.EmailTemplates.Update(existingTemplate);
            await _unitOfWork.SaveAsync();

            return _mapper.ToDto(existingTemplate);
        }

        public async Task<bool> DeleteTemplateAsync(int id)
        {
            var template = await _unitOfWork.EmailTemplates.GetByIdAsync(id);
            if (template == null)
            {
                return false;
            }

            _unitOfWork.EmailTemplates.Remove(template);
            await _unitOfWork.SaveAsync();
            return true;
        }

        public async Task<IEnumerable<EmailTemplateDto>> SearchTemplatesAsync(string searchTerm)
        {
            var templates = await _unitOfWork.EmailTemplates.GetAllAsync();
            var filtered = templates.Where(t => 
                t.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                t.Subject.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
                t.Body.Contains(searchTerm, StringComparison.OrdinalIgnoreCase));
            
            return filtered.Select(t => _mapper.ToDto(t));
        }

        public async Task<byte[]> ExportTemplateAsDocxAsync(int id)
        {
            var template = await _unitOfWork.EmailTemplates.GetByIdAsync(id);
            if (template == null)
            {
                throw new InvalidOperationException("Template not found");
            }

            using (var stream = new MemoryStream())
            {
                using (var document = WordprocessingDocument.Create(stream, WordprocessingDocumentType.Document))
                {
                    var mainPart = document.AddMainDocumentPart();
                    mainPart.Document = new Document();
                    var body = mainPart.Document.AppendChild(new Body());

                    // Add title
                    var titleRun = new Run(new Text(template.Name));
                    titleRun.RunProperties = new RunProperties(new Bold(), new FontSize() { Val = "24" });
                    var title = new Paragraph(titleRun);
                    title.ParagraphProperties = new ParagraphProperties(new Justification() { Val = JustificationValues.Center });
                    body.AppendChild(title);

                    // Add subject
                    var subjectRun = new Run(new Text(template.Subject));
                    subjectRun.RunProperties = new RunProperties(new FontSize() { Val = "16" });
                    var subject = new Paragraph(subjectRun);
                    subject.ParagraphProperties = new ParagraphProperties(new Justification() { Val = JustificationValues.Center });
                    body.AppendChild(subject);

                    // Add body content
                    var bodyContent = new Paragraph(new Run(new Text(template.Body)));
                    body.AppendChild(bodyContent);
                }

                return stream.ToArray();
            }
        }

        public async Task<string> SaveTemplateAsDocxToCudAsync(int id, string cudPath)
        {
            var template = await _unitOfWork.EmailTemplates.GetByIdAsync(id);
            if (template == null)
            {
                throw new InvalidOperationException("Template not found");
            }

            // Ensure CUD directory exists
            if (!Directory.Exists(cudPath))
            {
                Directory.CreateDirectory(cudPath);
            }

            // Generate filename with timestamp
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var filename = $"{template.Name}_{timestamp}.docx";
            var filePath = Path.Combine(cudPath, filename);

            // Create DOCX file
            using (var stream = new MemoryStream())
            {
                using (var document = WordprocessingDocument.Create(stream, WordprocessingDocumentType.Document))
                {
                    var mainPart = document.AddMainDocumentPart();
                    mainPart.Document = new Document();
                    var body = mainPart.Document.AppendChild(new Body());

                    // Add title
                    var titleRun = new Run(new Text(template.Name));
                    titleRun.RunProperties = new RunProperties(new Bold(), new FontSize() { Val = "24" });
                    var title = new Paragraph(titleRun);
                    title.ParagraphProperties = new ParagraphProperties(new Justification() { Val = JustificationValues.Center });
                    body.AppendChild(title);

                    // Add subject
                    var subjectRun = new Run(new Text(template.Subject));
                    subjectRun.RunProperties = new RunProperties(new FontSize() { Val = "16" });
                    var subject = new Paragraph(subjectRun);
                    subject.ParagraphProperties = new ParagraphProperties(new Justification() { Val = JustificationValues.Center });
                    body.AppendChild(subject);

                    // Add body content
                    var bodyContent = new Paragraph(new Run(new Text(template.Body)));
                    body.AppendChild(bodyContent);
                }

                // Save to CUD
                await File.WriteAllBytesAsync(filePath, stream.ToArray());
            }

            return filePath;
        }

        public async Task<byte[]> ExportTemplateAsPdfAsync(int id)
        {
            var template = await _unitOfWork.EmailTemplates.GetByIdAsync(id);
            if (template == null)
            {
                throw new InvalidOperationException("Template not found");
            }

            // Decode HTML entities and convert HTML to plain text for PDF
            var decodedBody = WebUtility.HtmlDecode(template.Body);
            
            // Remove HTML tags but preserve line breaks and spaces
            var plainTextBody = decodedBody
                .Replace("<br>", "\n")
                .Replace("<br/>", "\n")
                .Replace("<br />", "\n")
                .Replace("<p>", "")
                .Replace("</p>", "\n\n")
                .Replace("<div>", "")
                .Replace("</div>", "\n");
            
            // Remove remaining HTML tags
            plainTextBody = Regex.Replace(plainTextBody, "<[^>]*>", "");
            
            // Clean up extra whitespace
            plainTextBody = Regex.Replace(plainTextBody, @"\n\s*\n", "\n\n");
            plainTextBody = plainTextBody.Trim();

            // Create PDF document
            using (var document = new PdfDocument())
            {
                var page = document.AddPage();
                var gfx = XGraphics.FromPdfPage(page);

                // Set up fonts
                var titleFont = new XFont("Arial", 24, XFontStyle.Bold);
                var subjectFont = new XFont("Arial", 16, XFontStyle.Regular);
                var bodyFont = new XFont("Arial", 12, XFontStyle.Regular);

                // Calculate positions
                var margin = 50.0;
                var yPosition = margin;
                var pageWidth = page.Width;
                var textWidth = pageWidth - (2 * margin);

                // Add title (centered)
                var titleSize = gfx.MeasureString(template.Name, titleFont);
                var titleX = (pageWidth - titleSize.Width) / 2;
                gfx.DrawString(template.Name, titleFont, XBrushes.Black, titleX, yPosition);
                yPosition += titleSize.Height + 20;

                // Add subject (centered)
                var subjectSize = gfx.MeasureString(template.Subject, subjectFont);
                var subjectX = (pageWidth - subjectSize.Width) / 2;
                gfx.DrawString(template.Subject, subjectFont, XBrushes.Black, subjectX, yPosition);
                yPosition += subjectSize.Height + 30;

                // Add body content with better word wrapping and paragraph handling
                var paragraphs = plainTextBody.Split(new[] { "\n\n" }, StringSplitOptions.RemoveEmptyEntries);
                
                foreach (var paragraph in paragraphs)
                {
                    if (string.IsNullOrWhiteSpace(paragraph)) continue;
                    
                    // Split paragraph into lines
                    var lines = WrapText(paragraph.Trim(), bodyFont, textWidth, gfx);
                    
                    foreach (var line in lines)
                    {
                        // Check if we need a new page for this line
                        if (yPosition + bodyFont.Height > page.Height - margin)
                        {
                            page = document.AddPage();
                            gfx = XGraphics.FromPdfPage(page);
                            yPosition = margin;
                        }
                        
                        gfx.DrawString(line, bodyFont, XBrushes.Black, margin, yPosition);
                        yPosition += bodyFont.Height + 2;
                    }
                    
                    // Add space between paragraphs
                    yPosition += 8;
                }

                // Save to memory stream
                using (var stream = new MemoryStream())
                {
                    document.Save(stream);
                    return stream.ToArray();
                }
            }
        }

        private List<string> WrapText(string text, XFont font, double maxWidth, XGraphics gfx)
        {
            if (string.IsNullOrWhiteSpace(text)) return new List<string>();
            
            var words = text.Split(' ');
            var lines = new List<string>();
            var currentLine = "";

            foreach (var word in words)
            {
                var testLine = currentLine + (currentLine.Length > 0 ? " " : "") + word;
                var size = gfx.MeasureString(testLine, font);

                if (size.Width > maxWidth && currentLine.Length > 0)
                {
                    lines.Add(currentLine.Trim());
                    currentLine = word;
                }
                else
                {
                    currentLine = testLine;
                }
            }

            if (currentLine.Length > 0)
            {
                lines.Add(currentLine.Trim());
            }

            return lines;
        }
    }
}
