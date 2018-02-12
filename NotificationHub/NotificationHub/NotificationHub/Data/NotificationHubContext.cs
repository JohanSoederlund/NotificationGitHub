using Microsoft.EntityFrameworkCore;
using NotificationHub.Models;

namespace NotificationHub.Models
{
    public class NotificationHubContext : DbContext
    {
        public NotificationHubContext (DbContextOptions<NotificationHubContext> options)
            : base(options)
        {
        }

        public DbSet<NotificationHub.Models.Settings> Settings { get; set; }

        public DbSet<NotificationHub.Models.Hub> Hub { get; set; }

        public DbSet<NotificationHub.Models.Login> Login { get; set; }
    }
}
