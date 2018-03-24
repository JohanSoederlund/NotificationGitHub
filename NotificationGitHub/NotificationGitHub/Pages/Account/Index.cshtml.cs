using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Octokit;
using Octokit.Internal;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NotificationGitHub.Pages.Account
{
    public class IndexModel : PageModel
    {
        public string GitHubAvatar { get; set; }

        public string GitHubLogin { get; set; }

        public string GitHubName { get; set; }

        public string GitHubUrl { get; set; }

        public IReadOnlyList<Repository> Repositories { get; set; }

        public IReadOnlyList<Organization> Organization { get; set; }

        public async Task OnGetAsync()
        {
            if (User.Identity.IsAuthenticated)
            {
                GitHubName = User.FindFirst(c => c.Type == ClaimTypes.Name)?.Value;
                GitHubLogin = User.FindFirst(c => c.Type == "urn:github:login")?.Value;
                GitHubUrl = User.FindFirst(c => c.Type == "urn:github:url")?.Value;
                GitHubAvatar = User.FindFirst(c => c.Type == "urn:github:avatar")?.Value;

                string accessToken = await HttpContext.GetTokenAsync("access_token");

                var github = new GitHubClient(new ProductHeaderValue("AspNetCoreGitHubAuth"),
                    new InMemoryCredentialStore(new Credentials(accessToken)));
                Repositories = await github.Repository.GetAllForCurrent();

                //Organization = await github.Organization.GetAllForCurrent();

                Organization = await github.Organization.GetAllForCurrent();

                Console.WriteLine("HEJ");
            }
        }

    }
}