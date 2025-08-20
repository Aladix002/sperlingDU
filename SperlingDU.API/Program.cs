using Microsoft.EntityFrameworkCore;
using MySql.EntityFrameworkCore;
using SperlingDU.BLL;
using SperlingDU.DAL;
using SperlingDU.DAL.SeedData;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();



var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySQL(connectionString));

builder.Services.AddScoped<SperlingDU.DAL.UnitOfWork.IUnitOfWork, SperlingDU.DAL.UnitOfWork.UnitOfWork>();
builder.Services.AddScoped(typeof(SperlingDU.DAL.Repositories.IRepository<>), typeof(SperlingDU.DAL.Repositories.Repository<>));

builder.Services.AddBLLServices();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactClient", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:51113", "http://localhost:51115")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    if (!context.SystemSettings.Any())
    {
        context.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactClient");
app.UseAuthorization();

app.MapControllers();

app.Run();
