using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Facades;

namespace SperlingDU.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailTemplateController : ControllerBase
    {
        private readonly IEmailTemplateFacade _emailTemplateFacade;
        private readonly IConfiguration _configuration;

        public EmailTemplateController(IEmailTemplateFacade emailTemplateFacade, IConfiguration configuration)
        {
            _emailTemplateFacade = emailTemplateFacade;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmailTemplateDto>>> GetAllTemplates()
        {
            try
            {
                var templates = await _emailTemplateFacade.GetAllTemplatesAsync();
                return Ok(templates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmailTemplateDto>> GetTemplateById(int id)
        {
            try
            {
                var template = await _emailTemplateFacade.GetTemplateByIdAsync(id);
                if (template == null)
                {
                    return NotFound($"Template with ID {id} not found");
                }
                return Ok(template);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<EmailTemplateDto>> CreateTemplate([FromBody] CreateEmailTemplateDto createDto)
        {
            try
            {
                var template = await _emailTemplateFacade.CreateTemplateAsync(createDto);
                return CreatedAtAction(nameof(GetTemplateById), new { id = template.Id }, template);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<EmailTemplateDto>> UpdateTemplate(int id, [FromBody] UpdateEmailTemplateDto updateDto)
        {
            try
            {
                var template = await _emailTemplateFacade.UpdateTemplateAsync(id, updateDto);
                if (template == null)
                {
                    return NotFound($"Template with ID {id} not found");
                }
                return Ok(template);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTemplate(int id)
        {
            try
            {
                var success = await _emailTemplateFacade.DeleteTemplateAsync(id);
                if (!success)
                {
                    return NotFound($"Template with ID {id} not found");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<EmailTemplateDto>>> SearchTemplates([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest("Search query is required");
                }

                var templates = await _emailTemplateFacade.SearchTemplatesAsync(q);
                return Ok(templates);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}/export/docx")]
        public async Task<IActionResult> ExportTemplateAsDocx(int id)
        {
            try
            {
                var docxBytes = await _emailTemplateFacade.ExportTemplateAsDocxAsync(id);
                return File(docxBytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document", $"template_{id}.docx");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("{id}/save-to-cud")]
        public async Task<IActionResult> SaveTemplateToCud(int id)
        {
            try
            {
                var cudPath = _configuration["FileStorage:CudBasePath"] ?? "C:\\CUD";
                var filePath = await _emailTemplateFacade.SaveTemplateAsDocxToCudAsync(id, cudPath);
                return Ok(new { 
                    message = "Dokument byl úspěšně uložen do CUD", 
                    filePath = filePath,
                    fileName = Path.GetFileName(filePath)
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}/export/pdf")]
        public async Task<IActionResult> ExportTemplateAsPdf(int id)
        {
            try
            {
                var pdfBytes = await _emailTemplateFacade.ExportTemplateAsPdfAsync(id);
                return File(pdfBytes, "application/pdf", $"template_{id}.pdf");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
