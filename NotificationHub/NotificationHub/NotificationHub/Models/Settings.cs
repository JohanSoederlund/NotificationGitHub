using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NotificationHub.Models
{
    public class Settings
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string PW { get; set; }
        [NotMapped]
        public bool MyOrganizationBool
        {
            get
            {
                return (Organization == 1);
            }
            set
            {
                if (value == true)
                    Organization = 1;
                else
                    Organization = 0;
            }
        }
        [NotMapped]
        public int MyOrganizationInt
        {
            get
            {
                return Organization;
            }
            set
            {
             
                    Organization = value;

            }
        }
        public int Organization { get; set; }
        [NotMapped]
        public bool Org2 { get; set; }

        [NotMapped]
        public bool MyRepoBool
        {
            get
            {
                return (Repo == 1);
            }
            set
            {
                if (value == true)
                    Repo = 1;
                else
                    Repo = 0;
            }
        }
        public int Repo { get; set; }

        [NotMapped]
        public bool MyCommitBool
        {
            get
            {
                return (Commit == 1);
            }
            set
            {
                if (value == true)
                    Commit = 1;
                else
                    Commit = 0;
            }
        }
        public int Commit { get; set; }
    }
}
