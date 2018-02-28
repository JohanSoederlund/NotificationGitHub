using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NotificationGitHub.Models.DashBoardViewModels
{
    public class DashBoardSettingsViewModel
    {
        public int ID { get; set; }
        public int UserID { get; set; }
        public string OrganizationName { get; set; }
        public bool Release { get; set; }
        public bool Repo { get; set; }
        public bool Commit { get; set; }
    }
}
