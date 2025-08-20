using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SperlingDU.BLL.DTOs;
using SperlingDU.BLL.Facades;
using System.IO;

namespace SperlingDU.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileAttachmentController : ControllerBase
    {
        private readonly IFileAttachmentFacade _fileAttachmentFacade;
        private readonly IConfiguration _configuration;

        public FileAttachmentController(IFileAttachmentFacade fileAttachmentFacade, IConfiguration configuration)
        {
            _fileAttachmentFacade = fileAttachmentFacade;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileAttachmentDto>>> GetAllFileAttachments()
        {
            try
            {
                var attachments = await _fileAttachmentFacade.GetAllFileAttachmentsAsync();
                return Ok(attachments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FileAttachmentDto>> GetFileAttachmentById(int id)
        {
            try
            {
                var attachment = await _fileAttachmentFacade.GetFileAttachmentByIdAsync(id);
                if (attachment == null)
                {
                    return NotFound($"File attachment with ID {id} not found");
                }
                return Ok(attachment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<FileAttachmentDto>> CreateFileAttachment([FromBody] CreateFileAttachmentDto createDto)
        {
            try
            {
                var attachment = await _fileAttachmentFacade.CreateFileAttachmentAsync(createDto);
                return CreatedAtAction(nameof(GetFileAttachmentById), new { id = attachment.Id }, attachment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FileAttachmentDto>> UpdateFileAttachment(int id, [FromBody] UpdateFileAttachmentDto updateDto)
        {
            try
            {
                var attachment = await _fileAttachmentFacade.UpdateFileAttachmentAsync(id, updateDto);
                if (attachment == null)
                {
                    return NotFound($"File attachment with ID {id} not found");
                }
                return Ok(attachment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteFileAttachment(int id)
        {
            try
            {
                var success = await _fileAttachmentFacade.DeleteFileAttachmentAsync(id);
                if (!success)
                {
                    return NotFound($"File attachment with ID {id} not found");
                }
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }





        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<FileAttachmentDto>>> SearchFileAttachments([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest("Search query is required");
                }

                var attachments = await _fileAttachmentFacade.SearchFileAttachmentsAsync(q);
                return Ok(attachments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("by-type")]
        public async Task<ActionResult<IEnumerable<FileAttachmentDto>>> GetFileAttachmentsByType([FromQuery] string fileType)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(fileType))
                {
                    return BadRequest("File type is required");
                }

                var attachments = await _fileAttachmentFacade.GetFileAttachmentsByTypeAsync(fileType);
                return Ok(attachments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("upload")]
        public async Task<ActionResult<FileAttachmentDto>> UploadFile(IFormFile file, string? description = null)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No file provided");
                }

                if (file.Length > 10 * 1024 * 1024)
                {
                    return BadRequest("File size exceeds maximum allowed size");
                }

                var allowedExtensions = new[] { ".pdf", ".docx", ".doc", ".txt" };
                var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
                if (!allowedExtensions.Contains(fileExtension))
                {
                    return BadRequest($"Allowed file types are: {string.Join(", ", allowedExtensions)}");
                }

                var cudPath = _configuration["FileStorage:CudBasePath"] ?? "C:\\CUD";
                if (!Directory.Exists(cudPath))
                {
                    Directory.CreateDirectory(cudPath);
                }

                var fileName = $"{Guid.NewGuid()}_{file.FileName}";
                var filePath = Path.Combine(cudPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var createDto = new CreateFileAttachmentDto
                {
                    FileName = file.FileName,
                    CudPath = filePath,
                    FileType = fileExtension,
                    Description = description ?? $"Uploaded file: {file.FileName}",
                    FileSize = file.Length
                };

                var attachment = await _fileAttachmentFacade.CreateFileAttachmentAsync(createDto);
                return CreatedAtAction(nameof(GetFileAttachmentById), new { id = attachment.Id }, attachment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}/download")]
        public async Task<IActionResult> DownloadFile(int id)
        {
            try
            {
                var attachment = await _fileAttachmentFacade.GetFileAttachmentByIdAsync(id);
                if (attachment == null)
                {
                    return NotFound($"File attachment with ID {id} not found");
                }

                if (!System.IO.File.Exists(attachment.CudPath))
                {
                    return NotFound("File not found on disk");
                }

                var fileBytes = await System.IO.File.ReadAllBytesAsync(attachment.CudPath);
                var contentType = GetContentType(Path.GetExtension(attachment.FileName));

                return File(fileBytes, contentType, attachment.FileName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string GetContentType(string extension)
        {
            return extension.ToLowerInvariant() switch
            {
                ".pdf" => "application/pdf",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".doc" => "application/msword",
                ".txt" => "text/plain",
                _ => "application/octet-stream"
            };
        }
    }
}
