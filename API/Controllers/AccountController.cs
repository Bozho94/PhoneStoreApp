using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto registerDto)
        {
            if (await userManager.Users.AnyAsync(x => x.Email != null && x.Email.ToLower() == registerDto.Email.ToLower()))
            {
                return BadRequest("Email is already in use");
            }

            var user = new AppUser
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            await userManager.AddToRoleAsync(user, "Customer");
            return Ok(await CreateAuthenticatedUserDtoAsync(user));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized("Invalid email or password");

            var isPasswordValid = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!isPasswordValid) return Unauthorized("Invalid email or password");

            return Ok(await CreateAuthenticatedUserDtoAsync(user));
        }

        [Authorize]
        [HttpGet("current-user")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var email = CurrentUserEmail;
            if (string.IsNullOrEmpty(email)) return Unauthorized();

            var user = await userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("User not found");

            return Ok(await CreateAuthenticatedUserDtoAsync(user));
        }

        private async Task<AuthenticatedUserDto> CreateAuthenticatedUserDtoAsync(AppUser user)
        {
            var roles = await userManager.GetRolesAsync(user);

            return new AuthenticatedUserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Token = tokenService.CreateToken(user, roles),
                Roles = roles.ToList()
            };
        }
    }
}
