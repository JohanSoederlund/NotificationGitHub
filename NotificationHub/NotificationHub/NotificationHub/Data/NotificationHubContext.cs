using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace NotificationHub.Models
{
    public class NotificationHubContext : DbContext
    {
        public NotificationHubContext (DbContextOptions<NotificationHubContext> options)
            : base(options)
        {
        }

        public DbSet<NotificationHub.Models.Settings> Settings { get; set; }
    }
}
