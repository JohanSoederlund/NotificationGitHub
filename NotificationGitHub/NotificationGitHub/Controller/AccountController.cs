using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace NotificationGitHub.Controller
{
    [Route("[controller]/[action]")]
    public class AccountController : ControllerBase
    {

        [HttpGet]
        public IActionResult Login(string returnUrl = "/Account")
        {
            return Challenge(new AuthenticationProperties() { RedirectUri = returnUrl });
        }

        [HttpGet]
        public IActionResult Logout(string returnUrl = "/")
        {
            HttpContext.SignOutAsync();
            return RedirectToAction("Index", "Account");
        }

    }
}