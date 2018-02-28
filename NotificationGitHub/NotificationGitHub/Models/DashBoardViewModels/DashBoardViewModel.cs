using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationGitHub.Models.DashBoardViewModels
{
    public class DashBoardViewModel
    {
        public int ID { get; set; }
        public string OrganizationName { get; set; }
        public string Release { get; set; }
        public string RepoName { get; set; }
        public string CommitName { get; set; }
        public string Commit { get; set; }
    }
}
