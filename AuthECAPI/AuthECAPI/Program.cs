using AuthECAPI.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Serviec from Identity Core
builder.Services.AddIdentityApiEndpoints<AppUser>().AddEntityFrameworkStores<AppDbContext>();
builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.User.RequireUniqueEmail = true;
});
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DevDB"));
});

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = null;
    x.DefaultChallengeScheme = null;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(y =>
{
    y.SaveToken = false;
    y.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JWTSecret"]!))
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


#region Config.Cors
app.UseCors(options =>
{
    options.WithOrigins("http://localhost:4200").AllowAnyMethod().AllowAnyHeader();
});
#endregion

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
app.MapGroup("/api").MapIdentityApi<AppUser>();


app.MapPost("/api/signup", async (UserManager<AppUser> userManager, [FromBody] UserRegistrationModel userRegistrationModel) =>
{
    AppUser user = new AppUser()
    {
        UserName = userRegistrationModel.Email,
        Email = userRegistrationModel.Email,
        FullName = userRegistrationModel.FullName,
    };
    var result = await userManager.CreateAsync(user, userRegistrationModel.Password);

    return result.Succeeded?Results.Ok(result):Results.BadRequest(result);
});

app.MapPost("/api/signin", async (UserManager<AppUser> userManager, [FromBody] LoginModel userLoginModel) => 
{
    var user = await userManager.FindByEmailAsync(userLoginModel.Email);
    if (user != null && await userManager.CheckPasswordAsync(user, userLoginModel.Password))
    {
        var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JWTSecret"]!));
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim("UserID", user.Id.ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(10),
            SigningCredentials = new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256Signature)
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        var token = tokenHandler.WriteToken(securityToken);
        return Results.Ok(new { token });
    }
    else 
    {
        return Results.BadRequest(new { message = "Username or password is incorrect" });
    }
});

app.Run();

public class UserRegistrationModel
{
    public string Email { get; set; }
    public string Password { get; set; }
    public string FullName { get; set; }
}
public class LoginModel
{
    public string Email { get; set; }
    public string Password { get; set; }
}